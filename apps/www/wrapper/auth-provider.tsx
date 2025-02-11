"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{
	user: any;
	loading: boolean;
}>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadUser() {
			try {
				const response = await fetch("/api/me", {
					credentials: "include",
				});
				if (response.ok) {
					const userData = await response.json();
					setUser(userData);
				}
			} finally {
				setLoading(false);
			}
		}
		loadUser();
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading }}>
			{children}
		</AuthContext.Provider>
	);
}
// frontend/hooks/useAuth.ts
// import { useQuery } from '@tanstack/react-query';

// export function useAuth() {
//   return useQuery({
//     queryKey: ['auth'],
//     queryFn: async () => {
//       const response = await fetch('/api/me', {
//         credentials: 'include' // Send cookies
//       });
//       if (!response.ok) throw new Error('Not authenticated');
//       return response.json();
//     }
//   });
// }

// // frontend/components/PrivateRoute.tsx
// export function PrivateRoute({ children }: { children: React.ReactNode }) {
//   const { isLoading, isError, data: user } = useAuth();

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <Navigate to="/login" />;
  
//   return <>{children}</>;
// }



















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
