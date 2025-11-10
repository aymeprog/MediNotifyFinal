import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn3.iconfinder.com"], // ✅ allow external profile image
  },
};

export default nextConfig;
