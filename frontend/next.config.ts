import { config } from "@/lib/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "http", hostname: "res.cloudinary.com" },
    ],
  },

  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: `${config.apiUrl}/api/:path*`,
    },
  ],


};

export default nextConfig;

