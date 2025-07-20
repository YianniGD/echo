// app/next.config.ts
import type {NextConfig} from 'next';

const isGithubPages = process.env.NEXT_PUBLIC_IS_GITHUB_PAGES === 'true';

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false, // Set to false to always enable, or base on a different env var
});

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/echo' : undefined, // Apply basePath only for GitHub Pages
  assetPrefix: isGithubPages ? '/echo/' : undefined, // Apply assetPrefix only for GitHub Pages
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  turbopack: {
    // This object should be empty or contain actual Turbopack configurations
    // The 'scripts' object was incorrectly placed here
  },
};

module.exports = withPWA(nextConfig);