import withPWA from 'next-pwa';

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
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
};

export default withPWA(nextConfig);
