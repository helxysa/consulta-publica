import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['mocha-cdn.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mocha-cdn.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/inicio',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;


