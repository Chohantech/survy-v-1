import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const isProduction = process.env.NODE_ENV === "production";

// In production, nginx handles API routing, so NEXT_PUBLIC_API_URL is optional
// In development, it's required for rewrites
if (!isProduction && !apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in your environment (required for development)");
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

  // Rewrite /api/* requests to backend
  // In production: nginx handles /api/* routing directly to backend (no rewrite needed)
  // In development: rewrite to backend URL
  rewrites: async () => {
    // In production, nginx proxies /api/* to backend, so no rewrite needed
    if (isProduction) {
      return [];
    }
    // In development, rewrite to backend URL
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
