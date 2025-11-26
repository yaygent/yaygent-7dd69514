import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow serving static files from public/uploads
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
};

export default nextConfig;
