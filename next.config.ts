import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.micolink.io',
      },
    ],
  },
  typedRoutes: true,
  async rewrites() {
    return [
      {
        source: '/:section(blog|components)/:slug.mdx',
        destination: '/doc.mdx/:slug',
      },
      {
        source: '/:section(blog|components)/:slug',
        destination: '/doc.mdx/:slug',
        has: [
          {
            type: 'header',
            key: 'accept',
            value: '(?<accept>.*text/markdown.*)',
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
