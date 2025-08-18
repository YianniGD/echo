import pwa from "@ducanh2912/next-pwa";

const withPWA = pwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // Disable PWA in development to avoid caching issues.
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
