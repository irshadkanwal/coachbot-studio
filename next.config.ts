import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/chat',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '100 mb',
    },
  },
  webpack(config, { isServer, dev }) {
    if (isServer) {
      // Only emit source maps for the backend bundles so production stack traces are readable
      config.devtool = 'source-map';
    } else if (!dev) {
      // Explicitly avoid shipping browser source maps
      config.devtool = false;
    }

    return config;
  },
  images: {
    remotePatterns: [{ hostname: 'storage.googleapis.com' }],
  },
};

export default withNextIntl(nextConfig);
