import { z } from "zod";

export type ApiResponse<T> = {
	success: true;
	result: T;
	message?: string;
};

export type ApiError = {
	success: false;
	error: {
		message: string;
		code?: string;
		details?: Record<string, any>;
	};
};

export type ApiResult<T> = ApiResponse<T> | ApiError;

export interface User {
	id: number;
	name: string;
	email: string;
}
export const SearchRequestSchema = z.object({
	value: z
		.string()
		.min(10, "Search value must be at least 10 characters")
		.max(1000, "Search value must not exceed 1000 characters"),
	project: z
		.string()
		.min(1, "Project is required")
		.max(100, "Project name too long"),
	model: z.string().min(1, "Model is required"),
	// .refine((val) => ["gpt-4", "gpt-3.5-turbo", "claude"].includes(val), {
	// 	message: "Invalid model specified",
	// }),
});