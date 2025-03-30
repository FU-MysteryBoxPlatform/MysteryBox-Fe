import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // Tắt React Strict Mode
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
