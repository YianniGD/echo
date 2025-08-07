const CACHE_NAME = 'echo-cache-v1';

// Pre-cache the main app shell files.
// Other files (like from the CDN) will be cached on-the-fly.
const urlsToPreCache = [
  '/',
  '/index.html',
  '/logo.svg',
  '/manifest.json'
];

// Install the service worker and pre-cache the app shell.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache, pre-caching app shell');
        return cache.addAll(urlsToPreCache);
      })
  );
});

// Activate event to clean up old caches.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event to serve from cache or network.
// This uses a "Cache-First" strategy.
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response from cache.
        if (response) {
          return response;
        }

        // Not in cache - fetch from network.
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response.
            // Don't cache failed requests or chrome-extension URLs.
            if (!response || response.status !== 200 || response.url.startsWith('chrome-extension://')) {
              return response;
            }

            // Clone the response because it's a stream and can only be consumed once.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
