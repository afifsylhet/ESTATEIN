import type { NextConfig } from 'next';

// Origin of the Express API. The browser never talks to it directly — requests
// go to same-origin `/api/v1/*` and are proxied here (see rewrites below), so
// the httpOnly refresh cookie is stored on the Next.js origin and is readable
// by Server Components via `cookies()`.
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN;

if (process.env.NODE_ENV === 'production' && !BACKEND_ORIGIN) {
  throw new Error('Missing BACKEND_ORIGIN in production environment.');
}

const RESOLVED_BACKEND_ORIGIN = BACKEND_ORIGIN ?? 'http://localhost:5000';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${RESOLVED_BACKEND_ORIGIN}/api/v1/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
