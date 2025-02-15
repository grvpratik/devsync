"use client";
import { getGoogleUrl } from "www/lib/auth";
import { useAuth } from "www/wrapper/auth-provider";
import { Button } from "./ui/button";
import { AuthApiService } from "www/external/api";
import { useToast } from "www/hooks/use-toast";
import { useState } from "react";

export default function LoginButton() {
	const { authState, logout, login } = useAuth();
	const { toast } = useToast();
	const [isChecking, setIsChecking] = useState(false);

	const handleLogin = async () => {
		try {
			setIsChecking(true);
			const ok = await AuthApiService.serverCheck();
			if (ok) {
				return login();
			}

			toast({
				variant: "destructive",
				title: "Server Offline",
				description: "Unable to connect to server. Please try again later.",
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Something went wrong. Please try again.",
			});
		} finally {
			setIsChecking(false);
		}
	};

	if (authState.isLoading) {
		return <Button disabled>Loading...</Button>;
	}

	if (authState.error) {
		return <Button variant="destructive">{authState.error.message}</Button>;
	}

	if (authState.user) {
		return (
			<div className="space-y-4">
				<pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
					{JSON.stringify(authState.user, null, 2)}
				</pre>
				<Button variant="destructive" onClick={logout}>
					Logout
				</Button>
			</div>
		);
	}

	return (
		<Button
			
			onClick={handleLogin}
			disabled={isChecking}
			className="flex items-center gap-2"
		>
			{isChecking ?
				"Connecting..."
			:	<>
					<svg viewBox="0 0 24 24" className="w-5 h-5">
						{/* Google SVG paths */}
					</svg>
					Continue with Google
				</>
			}
		</Button>
	);
}
