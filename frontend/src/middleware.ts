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
  
  // Primary authentication check: Get session from better-auth API
  // This queries the database and is the source of truth
  let session = null;
  let sessionError = null;
  try {
    session = await auth.api.getSession({ headers: request.headers });
  } catch (error) {
    sessionError = error;
    console.error("Error getting session:", error);
  }
  
  // User is authenticated ONLY if session exists in database
  // We don't check cookies because:
  // 1. Cookies might persist even after session deletion
  // 2. Session in database is the source of truth
  // 3. If session is deleted, getSession() returns null/undefined
  const isAuthenticated = !!session?.session;

  console.log("Session from API:", !!session?.session);
  console.log("Is authenticated:", isAuthenticated);
  if (sessionError) {
    console.log("Session error:", sessionError);
  }

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
