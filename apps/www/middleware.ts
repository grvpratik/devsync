import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { AuthApiService } from "./external/api";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
	// 2. Check if the current route is protected or public
	const path = req.nextUrl.pathname;
	console.log("middleware path",path)
	const isProtectedRoute = protectedRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);

	const cookie = (await cookies()).get("session_id")?.value;
	console.log(cookie,"middleware")
	const session = await AuthApiService.validateSession(cookie);
	console.log(session,"middleware session")

	// 4. Redirect to /login if the user is not authenticated
	if (isProtectedRoute && !session?.valid) {
		return NextResponse.redirect(new URL("/login", req.nextUrl));
	}

	// 5. Redirect to /dashboard if the user is authenticated
	console.log(isPublicRoute,session.valid)
	if (
		isPublicRoute &&
		session?.valid
		&&
		!req.nextUrl.pathname.startsWith("/dashboard")
	) {
		return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
	}

	return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
