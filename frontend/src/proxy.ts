import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	
	// Handle root path redirect
	if (pathname === "/") {
		return NextResponse.redirect(new URL("/home", request.url));
	}
	
	// Always allow API routes
	if (pathname.startsWith("/api/")) {
		return NextResponse.next();
	}
	
	// Always allow static files and assets
	if (pathname.startsWith("/_next/") || 
		pathname.startsWith("/favicon.ico") ||
		pathname.startsWith("/icons/") ||
		pathname.startsWith("/images/")) {
		return NextResponse.next();
	}
	
	// Allow all other routes to pass through
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
     * - api routes that should be public
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|images|api/auth).*)",
  ],
};