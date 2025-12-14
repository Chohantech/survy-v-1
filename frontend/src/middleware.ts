import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	
	// Define public routes that don't require authentication
	const publicRoutes = [
		"/",
		"/sign-in",
		"/sign-up", 
		"/forgot-password",
		"/reset-password",
	];
	
	// Check if the current path is a public route
	const isPublicRoute = publicRoutes.some(route => 
		pathname === route || pathname.startsWith(route + "/")
	);
	
	// Always allow API auth routes
	if (pathname.startsWith("/api/auth/")) {
		return NextResponse.next();
	}
	
	// If it's a public route, allow access
	if (isPublicRoute) {
		return NextResponse.next();
	}
	
	// For protected routes, check for session
	try {
		const sessionCookie = getSessionCookie(request);
		
		// Enhanced logging for debugging production issues
		const isProduction = process.env.NODE_ENV === "production";
		if (!isProduction) {
			console.log("Middleware Debug:", {
				path: pathname,
				sessionCookie: !!sessionCookie,
				host: request.headers.get("host"),
				cookies: request.headers.get("cookie")?.substring(0, 100) + "...",
			});
		}
		
		// If no session cookie, redirect to sign-in
		if (!sessionCookie) {
			const signInUrl = new URL("/sign-in", request.url);
			const response = NextResponse.redirect(signInUrl);
			
			// Add headers to help with debugging
			response.headers.set("x-middleware-redirect", "no-session");
			return response;
		}
		
		return NextResponse.next();
	} catch (error) {
		console.error("Middleware error:", error);
		
		// On error, redirect to sign-in for safety
		const signInUrl = new URL("/sign-in", request.url);
		const response = NextResponse.redirect(signInUrl);
		response.headers.set("x-middleware-redirect", "error");
		return response;
	}
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons, etc.)
     * - api routes that should be public
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|images|api/auth).*)",
  ],
};