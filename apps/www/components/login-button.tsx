"use client";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "www/components/ui/avatar";
import { useToast } from "www/hooks/use-toast";
import { AuthApiService } from "www/lib/api";
import { useAuth } from "www/wrapper/auth-provider";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

const LoginButton = () => {
	const { authState,  login } = useAuth();
	const { toast } = useToast();
	const [isChecking, setIsChecking] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const handleLogin = async () => {
		try {
			setIsChecking(true);
			const ok = await AuthApiService.serverCheck();
			console.log(process.env.NEXT_PUBLIC_API_URL,"backend");
			if (ok) {
				setIsOpen(false); // Close modal on successful login
				return login();
			}

			toast({
				variant: "destructive",
				title: "Server Offline",
				description: "Unable to connect to server. Please try again later.",
			});
		} catch (error) {
			console.log(error,"LOGIN ERROR")
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
		return (
			<Button variant="outline" disabled className="w-10 h-10 p-0 rounded-full">
				<LoaderCircle
					className="animate-spin"
					size={16}
					strokeWidth={2}
					aria-hidden="true"
				/>
			</Button>
		);
	}

	if (authState.user) {
		return (
			<Avatar className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
				<AvatarImage
					src={authState.user.picture ?? ""}
					alt={authState.user.name ?? "User"}
				/>
				<AvatarFallback>
					{(authState.user?.name ?? "User").slice(0, 1)}
				</AvatarFallback>
			</Avatar>
		);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="default" className="px-6 rounded-full">
					Login
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md rounded-lg">
				<DialogHeader>
					<DialogTitle className="text-center">Welcome Back</DialogTitle>
				</DialogHeader>
				<div className="flex items-center justify-center p-6">
					<Button
						onClick={handleLogin}
						disabled={isChecking}
						className="flex items-center gap-2 bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 w-full justify-center py-6"
					>
						{isChecking ?
							<>
								<LoaderCircle className="animate-spin mr-2" size={18} />
								Connecting...
							</>
						:	<>
								<svg
									className="w-5 h-5"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										fill="#4285F4"
									/>
									<path
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										fill="#34A853"
									/>
									<path
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										fill="#FBBC05"
									/>
									<path
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										fill="#EA4335"
									/>
								</svg>
								Continue with Google
							</>
						}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default LoginButton;
