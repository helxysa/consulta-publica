import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Existing config
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
  // Add webpack configuration for JSON
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
      use: 'json-loader'
    });
    return config;
  },
  // Enable JSON imports via webpack instead of experimental
  // Existing redirects
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