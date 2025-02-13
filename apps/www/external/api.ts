import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API || "http://localhost:8787";

const instance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true, // Important for sending cookies
});

export const AuthApiService = {
	// Check if user is already authenticated
	checkLoginStatus: async () => {
		try {
			const response = await instance.get("/user/auth/session");
			return response.data;
		} catch (error) {
			console.error("Failed to check login status:", error);
			return { isValid: false };
		}
	},

	// Get authenticated user data
	getUserData: async () => {
		try {
			const response = await instance.get("/user/auth/data");
			return response.data;
		} catch (error) {
			console.error("Failed to get user data:", error);
			return { user: null };
		}
	},

	// Initiate Google OAuth login
	loginWithGoogle: () => {
		window.location.href = `${BASE_URL}/user/auth/callback`;
	},

	// Verify session status
	verifySession: async () => {
		try {
			const response = await instance.get("/user/auth/session");
			return response.data.is_valid;
		} catch (error) {
			console.error("Failed to verify session:", error);
			return { isValid: false };
		}
	},

	// Logout user
	logout: async () => {
		try {
			const response = await instance.get("/user/auth/logout");
			return response.data;
		} catch (error) {
			console.error("Failed to logout:", error);
			return { success: false };
		}
	},

	// Helper method to handle API errors
	handleApiError: (error: any) => {
		if (error.response) {
			// Server responded with error
			console.error("API Error:", error.response.data);
			if (error.response.status === 401) {
				// Handle unauthorized access
				return { status: "unauthenticated", user: null };
			}
			return error.response.data;
		} else if (error.request) {
			// Request made but no response
			console.error("Network Error:", error.request);
			return { error: "Network error occurred" };
		} else {
			// Other errors
			console.error("Error:", error.message);
			return { error: "An error occurred" };
		}
	},
};

// // React hook for managing auth state
// export const useAuth = () => {
// 	const [user, setUser] = useState(null);
// 	const [loading, setLoading] = useState(true);

// 	useEffect(() => {
// 		const initAuth = async () => {
// 			try {
// 				const { user } = await AuthApiService.getUserData();
// 				setUser(user);
// 			} catch (error) {
// 				console.error("Auth initialization failed:", error);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		initAuth();
// 	}, []);

// 	const login = async () => {
// 		AuthApiService.loginWithGoogle();
// 	};

// 	const logout = async () => {
// 		try {
// 			await AuthApiService.logout();
// 			setUser(null);
// 		} catch (error) {
// 			console.error("Logout failed:", error);
// 		}
// 	};

// 	return {
// 		user,
// 		loading,
// 		login,
// 		logout,
// 		isAuthenticated: !!user,
// 	};
// };

// Example usage of interceptors for handling auth
// instance.interceptors.response.use(
// 	(response) => response,
// 	async (error) => {
// 		if (error.response?.status === 401) {
// 			// Clear local auth state if needed
// 			window.location.href = "/login"; // Redirect to login page
// 		}
// 		return Promise.reject(error);
// 	}
// );
