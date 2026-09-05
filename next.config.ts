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
    // Optimize image formats and quality
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  typedRoutes: true,
  // Optimize compilation
  transpilePackages: ['geist'],
  // Reduce server bundle size
  experimental: {
    // Enable optimal CSS loading
    optimizeCss: true,
  },
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(favicon.ico|robots.txt|sitemap.xml)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },
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
