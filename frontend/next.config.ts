import { config } from "@/lib/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
<<<<<<< HEAD
=======

  output: "standalone",
>>>>>>> 4fb1f2c32ffc69a7c1c6c2cbfbd570d233430f13
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path",
        destination: `${config.apiUrl}/api/:path}`,
      },
    ];
  },
};

export default nextConfig;
