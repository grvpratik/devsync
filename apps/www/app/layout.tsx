import type { Metadata } from "next";

import "www/styles/globals.css";

import { geistMono, geistSans } from "./font";
import { Toaster } from "www/components/ui/toaster";
import { AuthProvider } from "www/wrapper/auth-provider";
import { AuthApiService } from "www/external/api";
import { cookies, headers } from "next/headers";
import { ThemeProvider } from "www/wrapper/theme-provider";

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};
async function getUser() {
	const headersList = await cookies();
	const sessionId = headersList.get("session_id")?.value;

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API}/user/auth/data`,
			{
				method: "POST",
				credentials: "include",
				headers: {
					Cookie: `session_id=${sessionId || ""}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user:", error);
		return null;
	}
}
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const data = await getUser();
	console.log("ROOt ", data);
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased  `}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<AuthProvider initialUser={data}>
						{children}
						<Toaster />
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
