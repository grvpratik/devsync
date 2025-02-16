"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthApiService } from "www/external/api";
import { getGoogleUrl } from "www/lib/auth";


interface User {

	email: string;
	name: string;
	picture?: string;

}

interface AuthError {
	message: string;
	code: string;
	details?: unknown;
}

interface AuthState {
	isLoading: boolean;
	isInitialized: boolean;
	error: AuthError | null;
	user: User | null;
}

interface AuthContextType {
	authState: AuthState;
	login: () => Promise<void>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
}

// Create context with a more specific type
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
	children: React.ReactNode;
	initialUser?: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
	const [authState, setAuthState] = useState<AuthState>({
		isLoading: !initialUser,
		isInitialized: false,
		error: null,
		user: initialUser ?? null,
	});

	// Helper to handle errors consistently
	const handleError = (error: unknown, customMessage: string): AuthError => {
		if (error instanceof Error) {
			return {
				message: error.message,
				code: "UNKNOWN",
				details: error,
			};
		}
		return {
			message: customMessage,
			code: "UNKNOWN",
			details: error,
		};
	};

	const refreshUser = async () => {
		try {
			setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
			const response = await AuthApiService.getUserData();

			setAuthState({
				isLoading: false,
				isInitialized: true,
				error: null,
				user: response.user,
			});
		} catch (error) {
			setAuthState((prev) => ({
				...prev,
				isLoading: false,
				isInitialized: true,
				error: handleError(error, "Failed to fetch user data"),
				user: null,
			}));
		}
	};

	// Check auth status on mount only if we don't have initialUser
	useEffect(() => {
		if (!initialUser) {
			refreshUser();
		} else {
			setAuthState((prev) => ({
				...prev,
				isInitialized: true,
			}));
		}
	}, [initialUser]);

	const login = async () => {
		try {
			// Store current path for redirect after login
			// const currentPath = window.location.pathname;
			// sessionStorage.setItem("authRedirect", currentPath);

			// Redirect to Google login
			window.location.href = getGoogleUrl();
		} catch (error) {
			setAuthState((prev) => ({
				...prev,
				error: handleError(error, "Login failed"),
			}));
		}
	};

	const logout = async () => {
		try {
			setAuthState((prev) => ({
				...prev,
				isLoading: true,
				error: null,
			}));

			const response = await AuthApiService.logout();

			if (!response.success) {
				throw new Error("Logout failed");
			}

			setAuthState({
				isLoading: false,
				isInitialized: true,
				error: null,
				user: null,
			});

			
			window.location.href = "/";
		} catch (error) {
			setAuthState((prev) => ({
				...prev,
				isLoading: false,
				error: handleError(error, "Logout failed"),
			}));
		}
	};

	return (
		<AuthContext.Provider value={{ authState, login, logout, refreshUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};

// Utility type guard
export const isAuthenticated = (
	authState: AuthState
): authState is AuthState & { user: User } => {
	return authState.user !== null;
};
