import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: process.env.SERVER_HOST_NAME || 'api.auraglowups.com',
      },
    ],
    domains: [
      'res.cloudinary.com',
      process.env.SERVER_HOST_NAME || 'api.auraglowups.com',
      'localhost',
    ]
  },
};

import removeImports from 'next-remove-imports';
export default removeImports()(nextConfig);
