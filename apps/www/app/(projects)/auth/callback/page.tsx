// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSessionCookie } from "../auth-action";

// Define the server action in a separate file


// This is now a Client Component
export default function AuthCallbackPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
console.log(token,"token")
	useEffect(() => {
		async function handleAuth() {
			// If no token is found, redirect to login
			if (!token) {
				router.push("/login");
				return;
			}

			try {
				// Call the server action to set the cookie
				await createSessionCookie(token);
				router.push("/");
			} catch (error) {
				console.error("Error setting session cookie:", error);
				router.push("/login?error=auth_callback_failed");
			}
		}

		handleAuth();
	}, [token, router]);

	return (
		<div className="flex justify-center items-center h-screen">
			Redirecting...
		</div>
	);
}
