import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	
	// Define public routes that don't require authentication
	const publicRoutes = [
		"/",
		"/sign-in",
		"/sign-up", 
		"/forgot-password",
		"/reset-password",
		"/api/auth", // Better Auth API routes
	];
	
	// Check if the current path is a public route or starts with a public route
	const isPublicRoute = publicRoutes.some(route => 
		pathname === route || pathname.startsWith(route + "/") || pathname.startsWith("/api/auth/")
	);
	
	// If it's a public route, allow access
	if (isPublicRoute) {
		return NextResponse.next();
	}
	
	// For protected routes, check for session
	const sessionCookie = getSessionCookie(request);
	
	// If no session cookie, redirect to sign-in
	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|images).*)",
  ],
};
