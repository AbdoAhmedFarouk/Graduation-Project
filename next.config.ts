import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Set this to your required limit (e.g., '10mb', '20mb')
    },
  },
};

export default nextConfig;
