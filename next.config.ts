import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Required for statically wrapped Capacitor builds
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
