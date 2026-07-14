import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'client-media-prod-522419251736.s3.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
