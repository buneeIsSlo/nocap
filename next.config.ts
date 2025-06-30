import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com", // widely used for google avatars
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
