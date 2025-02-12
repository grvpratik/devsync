"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { NEXT_PUBLIC_API } from "www/lib/constant";

export default function AuthCallback() {
	const router = useRouter();

	useEffect(() => {
		const handleCallback = async () => {
			try {
				// Get error parameters if any
				const error = router.query.error;
				if (error) {
					throw new Error(error as string);
				}

				// Exchange the code for session
				// const response = await fetch(`${NEXT_PUBLIC_API}/user/auth/callback${window.location.search}`, {
				//   credentials: 'include',
				// });

				// if (!response.ok) {
				//   throw new Error('Authentication failed');
				// }

				// Get redirect URL or default to home
				const redirect = sessionStorage.getItem("authRedirect") || "/";
				sessionStorage.removeItem("authRedirect");

				router.replace(redirect);
			} catch (error) {
				console.error("Auth callback error:", error);
				router.replace("/auth/error");
			}
		};

		if (router.isReady) {
			handleCallback();
		}
	}, [router.isReady]);

	return <div>Processing authentication...</div>;
}
