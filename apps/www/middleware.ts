import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthApiService } from "./external/api";

// Define route patterns with more specific types
type RoutePattern = {
	path: string;
	exact?: boolean;
};

// Protected routes configuration
const protectedRoutes: RoutePattern[] = [
	{ path: "/build", exact: true },
	{ path: "/setting", exact: true },
	{ path: "/build/", exact: false },
];

// Public routes configuration
const publicRoutes: RoutePattern[] = [
	{ path: "/login", exact: true },
	{ path: "/", exact: true },
];

// Helper function to check if a path matches a route pattern
function matchRoute(path: string, route: RoutePattern): boolean {
	if (route.exact) {
		return path === route.path;
	}
	return path.startsWith(route.path);
}

export default async function middleware(req: NextRequest) {
	try {
		const path = req.nextUrl.pathname;

		// Clean the path to handle trailing slashes consistently
		const normalizedPath =
			path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;

		// Check if route is protected or public
		const isProtectedRoute = protectedRoutes.some((route) =>
			matchRoute(normalizedPath, route)
		);
		const isPublicRoute = publicRoutes.some((route) =>
			matchRoute(normalizedPath, route)
		);

		// Get session cookie
		const sessionCookie = await (await cookies()).get("session_id");
		const sessionId = sessionCookie?.value ?? "";

		// Validate session
		const session = await AuthApiService.validateSession(sessionId);
		const isAuthenticated = session?.valid ?? false;

		// Create redirect URL helper
		const createRedirectUrl = (path: string) => new URL(path, req.nextUrl);

		// Handle authentication redirects
		if (isProtectedRoute && !isAuthenticated) {
			// Store the original URL to redirect back after login
			const returnUrl = encodeURIComponent(req.nextUrl.pathname);
			return NextResponse.redirect(
				createRedirectUrl(`/login?returnUrl=${returnUrl}`)
			);
		}

		if (isPublicRoute && isAuthenticated && normalizedPath !== "/") {
			return NextResponse.redirect(createRedirectUrl("/"));
		}

		// Continue to the requested page
		return NextResponse.next();
	} catch (error) {
		console.error("Middleware error:", error);
		// Fail secure: redirect to login on error
		return NextResponse.redirect(new URL("/login", req.nextUrl));
	}
}

// Fixed matcher configuration using Next.js supported syntax
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files with extensions (.png, .jpg, .jpeg, .gif, .ico)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
