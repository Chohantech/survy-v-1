// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const protectedRoutes = [
  "/home",
  "/ads",
  "/groups",
  "/marketplace",
  "/pages",
  "/post",
  "/settings",
  "profile",
  "/user",
  "/chat",
];

const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check for better-auth session cookie (primary authentication method)
  // Better-auth uses a cookie with prefix "better-auth.session_token" by default
  const betterAuthSessionCookie = request.cookies.get("better-auth.session_token")?.value;
  
  // Also check for the custom token cookie (set by backend database hook)
  const tokenCookie = request.cookies.get("token")?.value;

  console.log("Better-auth session cookie:", betterAuthSessionCookie);
  
  // Try to get the session from better-auth API
  let session = null;
  try {
    session = await auth.api.getSession({ headers: request.headers });
  } catch (error) {
    console.error("Error getting session:", error);
  }
  
  // User is authenticated if:
  // 1. Better-auth session exists, OR
  // 2. Better-auth session cookie exists, OR  
  // 3. Custom token cookie exists
  const isAuthenticated = !!(session?.session || betterAuthSessionCookie || tokenCookie);

  console.log("Better-auth session cookie:", !!betterAuthSessionCookie);
  console.log("Token cookie:", !!tokenCookie);
  console.log("Session from API:", !!session?.session);
  console.log("Is authenticated:", isAuthenticated);

  // Redirect unauthenticated user from protected pages
  if (protectedRoutes.some((r) => pathname.startsWith?.(r)) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Redirect logged-in user away from auth pages
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
