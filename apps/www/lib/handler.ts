import {
	type AxiosError,
	type AxiosInstance,
	type AxiosRequestConfig,
} from "axios";
import { cookies } from "next/headers";
type ErrorResponse = {
	success: false;
	error: {
		message: string;

		code?: string;
	};
};
type ApiResult<T> = SuccessResponse<T> | ErrorResponse;
type SuccessResponse<T> = {
	success: true;
	result: T;
};
// type ApiResult<T> = {
// 	success: boolean;
// 	result?: T;
// 	error?: {
// 		message: string;
// 		code?: string;
// 	};
// };

interface RetryConfig {
	maxRetries: number;
	initialDelay: number;
	maxDelay: number;
	factor: number;
	statusCodesToRetry: number[];
}

export class ApiHandler {
	private instance: AxiosInstance;
	private retryConfig: RetryConfig;

	constructor(axiosInstance: AxiosInstance, config?: Partial<RetryConfig>) {
		this.instance = axiosInstance;
		this.retryConfig = {
			maxRetries: 3,
			initialDelay: 500,
			maxDelay: 5000,
			factor: 2,
			statusCodesToRetry: [408, 429, 500, 502, 503, 504],
			...config,
		};
	}

	private calculateDelay(retryCount: number): number {
		const delay = Math.min(
			this.retryConfig.initialDelay *
				Math.pow(this.retryConfig.factor, retryCount),
			this.retryConfig.maxDelay
		);
		return delay + Math.random() * 100; // Add jitter
	}

	private wait(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	private shouldRetry(error: AxiosError): boolean {
		return (
			error.response !== undefined &&
			this.retryConfig.statusCodesToRetry.includes(error.response.status)
		);
	}

	private async getSessionCookie(session?: string): Promise<string | null> {
		if (session) {
			return session;
		} else return null;

		// try {
		// 	const cookieStore = await cookies();
		// 	return (cookieStore.get("session_id")?.value) || null;
		// } catch (e) {
		// 	// Not running on server
		// 	return null;
		// }
	}

	async request<T>(
		method: string,
		url: string,
		data?: any,
		options?: {
			session?: string;
			headers?: Record<string, string>;
			config?: AxiosRequestConfig;
		}
	): Promise<ApiResult<T>> {
		const { session, headers = {}, config = {} } = options || {};
		let retryCount = 0;

		// Get session cookie from parameter or server component
		const sessionCookie = await this.getSessionCookie(session);
		console.log("getsession inside request", sessionCookie);
		// Set up headers with session if available
		const requestHeaders: Record<string, string> = {
			...headers,
		};

		if (sessionCookie) {
			requestHeaders.Cookie = `session_id=${sessionCookie}`;
		}

		while (true) {
			try {
				const response = await this.instance.request<ApiResult<T>>({
					method,
					url,
					data: method !== "GET" ? data : undefined,
					params: method === "GET" ? data : undefined,
					headers: requestHeaders,
					...config,
				});

				return response.data;
			} catch (error) {
				if (
					axios.isAxiosError(error) &&
					retryCount < this.retryConfig.maxRetries &&
					this.shouldRetry(error)
				) {
					retryCount++;
					const delay = this.calculateDelay(retryCount);
					console.warn(
						`Request failed, retrying (${retryCount}/${this.retryConfig.maxRetries}) after ${delay}ms`
					);
					await this.wait(delay);
					continue;
				}

				if (axios.isAxiosError(error)) {
					const axiosError = error as AxiosError<ErrorResponse>;
					return (
						(axiosError.response?.data as ApiResult<T>) || {
							success: false,
							error: {
								message: error.message || "Network error occurred",
								code: `${error.code || "NETWORK_ERROR"}`,
							},
						}
					);
				}

				return {
					success: false,
					error: {
						message:
							error instanceof Error ? error.message : "Unknown error occurred",
						code: "UNKNOWN_ERROR",
					},
				};
			}
		}
	}

	// Convenience methods
	async get<T>(
		url: string,
		params?: any,
		options?: {
			session?: string;
			headers?: Record<string, string>;
			config?: AxiosRequestConfig;
		}
	): Promise<ApiResult<T>> {
		return this.request<T>("GET", url, params, options);
	}

	async post<T>(
		url: string,
		data?: any,
		options?: {
			session?: string;
			headers?: Record<string, string>;
			config?: AxiosRequestConfig;
		}
	): Promise<ApiResult<T>> {
		return this.request<T>("POST", url, data, options);
	}

	async patch<T>(
		url: string,
		data?: any,
		options?: {
			session?: string;
			headers?: Record<string, string>;
			config?: AxiosRequestConfig;
		}
	): Promise<ApiResult<T>> {
		return this.request<T>("PATCH", url, data, options);
	}

	async delete<T>(
		url: string,
		options?: {
			session?: string;
			headers?: Record<string, string>;
			config?: AxiosRequestConfig;
		}
	): Promise<ApiResult<T>> {
		return this.request<T>("DELETE", url, {}, options);
	}
}

// Usage example:
import axios from "axios";

const instance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API || "http://localhost:8787",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		withCredentials: true,
	},
});

export const api = new ApiHandler(instance);
export function isSuccess<T>(
	response: ApiResult<T>
): response is { success: true; result: T } {
	return response.success === true;
}