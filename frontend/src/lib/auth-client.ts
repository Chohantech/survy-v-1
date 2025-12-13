import { createAuthClient } from "better-auth/react";
import { config } from "./config";

// Configure auth client with baseURL
// If NEXT_PUBLIC_API_URL is set, use it; otherwise use relative URLs (which will be rewritten by Next.js)
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
  fetchOptions: {
    credentials: "include", // Important: include cookies in requests
  },
});
