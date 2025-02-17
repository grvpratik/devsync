import axios, { AxiosError, AxiosInstance } from "axios";
import { headers } from "next/headers";

import { ApiResult } from "shared";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

interface User {
	email: string;
	name: string;
	picture?: string;
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

type SuccessResponse<T> = {
	success: true;
	result: T;
};

type ErrorResponse = {
	success: false;
	error: {
		message: string;

		code?: string;
	};
};

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
export function isSuccess<T>(
	response: ApiResponse<T>
): response is SuccessResponse<T> {
	return response.success === true;
}

export interface Phase {
	name: string;
	description: string;
	start_date: Date;
	end_date: Date;
	content?: any[];
}
class ApiError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ApiError";
	}
}
// Create axios instance with default config
const instance: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// const handleApiError = (error: unknown) => {
// 	if (axios.isAxiosError(error)) {
// 		const axiosError = error as AxiosError<any>;
// 		if (axiosError.response) {
// 			// Server responded with error
// 			return {
// 				error: axiosError.response.data?.message || "Server error",
// 				status: axiosError.response.status,
// 			};
// 		}
// 		if (axiosError.request) {
// 			// No response received
// 			return {
// 				error: "Network error - no response received",
// 				status: 0,
// 			};
// 		}
// 	}
// 	// Something else went wrong
// 	return {
// 		error: "An unexpected error occurred",
// 		status: 500,
// 	};
// };

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

export const AuthApiService = {
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
	serverCheck: async (): Promise<boolean> => {
		try {
			const response = await instance.get("");
			return response.status === 200;
		} catch (error) {
			console.error("Server check failed:", error);
			return false;
		}
	},

	validateSession: async (cookie?: string): Promise<SessionValidation> => {
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
			console.log(error);
			return { valid: false, reason: "error" };
		}
	},

	// Get all active sessions
	getSessions: async (): Promise<{ sessions: SessionInfo[] }> => {
		try {
			const response = await instance.post("/user/auth/sessions");
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
			const response = await instance.post("/user/auth/data");
			console.log(response.data);
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

export const ApiService = {
	getAllProjectsByUser: async (session: string): Promise<ApiResponse<any>> => {
		try {
			const response = await instance.post(
				`/build/project`,
				{},
				{
					headers: {
						Cookie: `session_id=${session || ""}`,
					},
				}
			);
			console.log(response.data);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>;
				return (
					axiosError.response?.data || {
						success: false,
						error: { message: "Unknown error occurred" },
					}
				);
			}
			return { success: false, error: { message: "Network error" } };
		}
	},
	getProjectById: async (
		id: string,
		session: string
	): Promise<ApiResult<any>> => {
		try {
			const response = await instance.post(
				`/build/project/${id}`,
				{}, // Request body (empty in this case)
				{
					headers: {
						Cookie: `session_id=${session || ""}`,
					},
				}
			);
			console.log(response.data);
			return response.data;
		} catch (error) {
			console.error("error fetching project report", error);
			return {
				success: false,
				error: {
					message:
						error instanceof Error ?
							error.message
						:	"Unable to fetch project report",
				},
			};
		}
	},
	getPhases: async (id, range) => {
		try {
			const response = await instance.post(
				`/build/project/${id}/phases`,
				range
			);
			return response.data;
		} catch (error) {
			console.error("error fetching project report");
			return {
				success: false,
				error: {
					message:
						error instanceof Error ?
							error.message
						:	"Unable to fetch project report",
				},
			};
		}
	},
	getSearch: async () => {
		try {
			const response = await instance.post(`/build/search`);
			return response.data;
		} catch (error) {
			console.error("error fetching project report");
			return {
				success: false,
				error: {
					message:
						error instanceof Error ?
							error.message
						:	"Unable to fetch project report",
				},
			};
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
// static async getPhases(id: string, phases: Phase[]): Promise<Phase[]> {
//     try {
//       const response = await instance.post<ApiResponse<Phase[]>>(
//         `/build/project/${id}/phases`,
//         phases
//       );

//       if (!response.data.success) {
//         throw new ApiError(response.data.error?.message || 'Failed to save phases');
//       }

//       return response.data.data || [];
//     } catch (error) {
//       if (error instanceof ApiError) {
//         throw error;
//       }

//       if (error instanceof Error) {
//         throw new ApiError(error.message);
//       }

//       throw new ApiError('Unable to save project phases');
//     }
//   }
// }

// // MultiDateRangeSelector.tsx
// // Updated submit handler in the component
// const handleSubmit = async () => {
//   try {
//     setLoading(true);
//     setError(null);

//     const savedPhases = await ApiService.getPhases(id, dateRanges);

//     // Update local state with saved phases if needed
//     setDateRanges(savedPhases);

//     onSubmitSuccess?.();
//     router.push(`${pathname}/schedule`);
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
//     setError(errorMessage);
//     onSubmitError?.(errorMessage);
//   } finally {
//     setLoading(false);
//   }
// };
