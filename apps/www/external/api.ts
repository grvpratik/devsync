import axios, { AxiosError, AxiosInstance } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

interface User {
	id: string;
	email: string;
	name: string;
	image_url?: string;
}

interface SessionInfo {
	deviceInfo: {
		userAgent?: string;
		ip?: string;
	};
	createdAt: number;
	lastActivityAt: number;
	expiresAt: number;
	isCurrentSession: boolean;
}

interface SessionValidation {
	valid: boolean;
	reason?: "no-session" | "expired" | "error";
	expiresIn?: number;
	lastActivity?: number;
}

// Create axios instance with default config
const instance: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true, 
	headers: {
		"Content-Type": "application/json",
	},
});

// Error handler utility
const handleApiError = (error: unknown) => {
	if (axios.isAxiosError(error)) {
		const axiosError = error as AxiosError<any>;
		if (axiosError.response) {
			// Server responded with error
			return {
				error: axiosError.response.data?.message || "Server error",
				status: axiosError.response.status,
			};
		}
		if (axiosError.request) {
			// No response received
			return {
				error: "Network error - no response received",
				status: 0,
			};
		}
	}
	// Something else went wrong
	return {
		error: "An unexpected error occurred",
		status: 500,
	};
};

// Response interceptor for handling auth errors
// instance.interceptors.response.use(
// 	(response) => response,
// 	async (error) => {
// 		if (error.response?.status === 401) {
// 			// Clear any local auth state
// 			if (typeof window !== "undefined") {
// 				window.dispatchEvent(new CustomEvent("auth:required"));
// 				window.location.href = "/login";
// 			}
// 		}
// 		return Promise.reject(error);
// 	}
// );

export const AuthApiService :any= {
	// Authentication Status
	// checkLoginStatus: async () => {
	// 	try {
	// 		const response = await instance.get("/user/auth/session");
	// 		return response.data;
	// 	} catch (error) {
	// 		return handleApiError(error);
	// 	}
	// },

	// Session Management
	validateSession: async (cookie:string): Promise<SessionValidation> => {
		try {
			const response = await instance.get("/user/auth/validate", {
				headers:
					cookie ?
						{
							Cookie: `session_id=${cookie}`,
						}
					:	undefined,
			});
			return response.data;
		} catch (error) {
			console.log(error)
			return { valid: false, reason: "error" };
		}
	},

	// Get all active sessions
	getSessions: async (): Promise<{ sessions: SessionInfo[] }> => {
		try {
			const response = await instance.get("/user/auth/sessions");
			return response.data;
		} catch (error) {
			console.error("Failed to get sessions:", error);
			return { sessions: [] };
		}
	},

	// Authentication Flow
	loginWithGoogle: () => {
		if (typeof window !== "undefined") {
			window.location.href = `${BASE_URL}/user/auth/callback`;
		}
	},

	// User Data
	getUserData: async (): Promise<{ user: User | null }> => {
		try {
			const response = await instance.get("/user/auth/data");
			return response.data;
		} catch (error) {
			console.error("Failed to get user data:", error);
			return { user: null };
		}
	},

	// Session Management
	logout: async (sessionId?: string) => {
		try {
			if (sessionId) {
				// Logout specific session
				const response = await instance.post("/user/auth/logout/session", {
					sessionId,
				});
				return response.data;
			} else {
				// Logout current session
				const response = await instance.post("/user/auth/logout/session");
				return response.data;
			}
			
		} catch (error) {
			console.error("Logout failed:", error);
			return { success: false };
		}
	},

	logoutAll: async () => {
		try {
			const response = await instance.post("/user/auth/logout/all");
			return response.data;
		} catch (error) {
			console.error("Logout all sessions failed:", error);
			return { success: false };
		}
	},
};

// export const useAuth = () => {
// 	const [user, setUser] = useState<User | null>(null);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState<string | null>(null);

// 	useEffect(() => {
// 		const initAuth = async () => {
// 			try {
// 				// Check session validity first
// 				const { valid } = await AuthApiService.validateSession();
// 				if (!valid) {
// 					setUser(null);
// 					setLoading(false);
// 					return;
// 				}

// 				// Get user data if session is valid
// 				const { user } = await AuthApiService.getUserData();
// 				setUser(user);
// 			} catch (error) {
// 				setError("Failed to initialize auth");
// 				console.error("Auth initialization failed:", error);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		initAuth();

// 		// Listen for auth required events
// 		const handleAuthRequired = () => {
// 			setUser(null);
// 		};

// 		window.addEventListener("auth:required", handleAuthRequired);
// 		return () => {
// 			window.removeEventListener("auth:required", handleAuthRequired);
// 		};
// 	}, []);

// 	const login = () => {
// 		AuthApiService.loginWithGoogle();
// 	};

// 	const logout = async (sessionId?: string) => {
// 		try {
// 			const result = await AuthApiService.logout(sessionId);
// 			if (result.success && !sessionId) {
// 				setUser(null);
// 			}
// 			return result;
// 		} catch (error) {
// 			console.error("Logout failed:", error);
// 			return { success: false };
// 		}
// 	};

// 	const logoutAll = async () => {
// 		try {
// 			const result = await AuthApiService.logoutAll();
// 			if (result.success) {
// 				setUser(null);
// 			}
// 			return result;
// 		} catch (error) {
// 			console.error("Logout all failed:", error);
// 			return { success: false };
// 		}
// 	};

// 	return {
// 		user,
// 		loading,
// 		error,
// 		login,
// 		logout,
// 		logoutAll,
// 		isAuthenticated: !!user,
// 	};
// };