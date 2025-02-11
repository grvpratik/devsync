import { Context, Hono, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { NODE_ENV } from "./lib/constant";

// 1. Custom Error Classes
export class AppError extends Error {
	constructor(
		public message: string,
		public statusCode: number = 500,
		public errorCode?: string,
		public details?: Record<string, any>
	) {
		super(message);
		this.name = "AppError";
	}
}

export class ValidationError extends AppError {
	constructor(message: string, details?: Record<string, any>) {
		super(message, 400, "VALIDATION_ERROR", details);
		this.name = "ValidationError";
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = "Resource not found") {
		super(message, 404, "NOT_FOUND");
		this.name = "NotFoundError";
	}
}

// 2. Error Response Interface
interface ErrorResponse {
	success: false;
	error: {
		message: string;
		code?: string;
		details?: Record<string, any>;
		stack?: string;
	};
}

export const errorHandler = async (c: Context, next:Next) => {
	try {
        console.log("middleware")
		await next();
	} catch (error) {
		console.error("Error caught in global handler:", error);

		// Assert error as Error type
		const err = error as Error;

		// Handle different types of errors
		if (error instanceof AppError) {
			// Handle custom application errors
			return c.json(
				{
					success: false,
					error: {
						message: error.message,
						code: error.errorCode,
						details: error.details,
					},
				},
				error.statusCode 
			);
		}

		if (error instanceof z.ZodError) {
			// Handle Zod validation errors
			return c.json(
				{
					success: false,
					error: {
						message: "Validation failed",
						code: "VALIDATION_ERROR",
						details: error.errors.map((e) => ({
							path: e.path.join("."),
							message: e.message,
						})),
					},
				},
				400
			);
		}

		if (error instanceof HTTPException) {
			// Handle Hono HTTP exceptions
			return c.json(
				{
					success: false,
					error: {
						message: error.message,
						code: `HTTP_${error.status}`,
					},
				},
				error.status
			);
		}

		// Handle unknown errors
		const isDev = NODE_ENV === "development";
		return c.json(
			{
				success: false,
				error: {
					message: isDev ? error.message : "Internal server error",
					...(isDev && { stack: error.stack }),
				},
			},
			500
		);
	}
};
