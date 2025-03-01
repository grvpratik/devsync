import { z } from "zod";
import { Phase, Tasks } from "./project.types";

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

export interface TaskResponse extends Tasks{
	phaseId:string;
	id:string;
	isCompleted:boolean;

}

export interface PhasesResponse extends Phase{
	id:string;
	startDate:string;
	endDate:string;
	tasks:TaskResponse[]
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