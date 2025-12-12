import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Must be defined

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in your environment");
}

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
      destination: `${apiUrl}/api/:path*`, // must start with http/https
    },
  ],
};

export default nextConfig;
