"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthApiService } from "www/external/api";
import { getGoogleUrl } from "www/lib/auth";
import { NEXT_PUBLIC_API } from "www/lib/constant";

// types.ts
interface AuthError {
	message: string;
	code: string;
}

interface AuthState {
	isLoading: boolean;
	error: AuthError | null;
	user: any | null;
}

const AuthContext = createContext<{
	authState: AuthState;
	login: () => void;
	logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [authState, setAuthState] = useState<AuthState>({
		isLoading: true,
		error: null,
		user: null,
	});

	// Check for existing session on mount
	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			const response = await axios.get(`${NEXT_PUBLIC_API}/user/auth/data`, {
				withCredentials: true,
			});

			if (response.status !== 200) throw new Error("Session check failed");

			const data = await response.data;
			console.log("context", data);
			setAuthState({
				isLoading: false,
				error: null,
				user: data.user,
			});
		} catch (error) {
			console.log("error context", error);
			setAuthState({
				isLoading: false,
				error: null,
				user: null,
			});
		}
	};

	const login = () => {
		// Store the current URL for redirect after login
		sessionStorage.setItem("authRedirect", window.location.pathname);

		// Start login flow
		window.location.href = getGoogleUrl();
	};

	const logout = async () => {
		try {
			setAuthState((prev) => ({
				...prev,
				isLoading: true,
			}));
			const res = await AuthApiService.logout();
			if (res.success) {
			return setAuthState({
				isLoading: false,
				error: null,
				user: null,
			});
			}
			return setAuthState((prev) => ({
				...prev,
				isLoading: false,
				error: {
					message: "failed logout",
					code: "400",
				},
			}));
		} catch (error) {
			setAuthState((prev) => ({
				...prev,
				isLoading: false,
				error: {
					message: "failed logout",
					code: "400",
				},
			}));
			console.error("Logout failed:", error);
		}
	};

	return (
		<AuthContext.Provider value={{ authState, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
};

// "use client";
// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function AuthCallback() {
// 	const router = useRouter();
// 	const searchParams = useSearchParams();

// 	useEffect(() => {
// 		const handleCallback = async () => {
// 			const code = searchParams.get("code");
// console.log(code)
// 			if (!code) {
// 				router.push("/login?error=no_code");
// 				return;
// 			}

// 			try {
// 				const response = await fetch(
// 					`${process.env.NEXT_PUBLIC_API_URL}/user/auth/google`,
// 					{
// 						method: "POST",
// 						credentials: "include",
// 						headers: {
// 							"Content-Type": "application/json",
// 						},
// 						body: JSON.stringify({ code }),
// 					}
// 				);

// 				if (!response.ok) {
// 					throw new Error("Auth failed");
// 				}

// 				router.push("/dashboard");
// 			} catch (error) {
// 				console.error("Auth error:", error);
// 				router.push("/login?error=auth_failed");
// 			}
// 		};

// 		handleCallback();
// 	}, [router, searchParams]);

// 	return <div>Processing login...</div>;
// }
