// import { ZodError, z } from "zod";
// import { Context } from "hono";

// // Types for formatted error response
// interface FormattedZodError {
// 	path: string[];
// 	message: string;
// 	code: string;
// }

// interface ZodErrorResponse {
// 	success: false;
// 	error: {
// 		code: string;
// 		message: string;
// 		details: FormattedZodError[];
// 	};
// }

// // Function to format field path
// const formatFieldPath = (path: (string | number)[]): string => {
// 	return path
// 		.map((item) => (typeof item === "number" ? `[${item}]` : item))
// 		.join(".");
// };

// // Main Zod error handler
// export const handleZodError = (error: ZodError): FormattedZodError[] => {
// 	return error.errors.map((err) => ({
// 		path: err.path.map(String),
// 		message: err.message,
// 		code: err.code,
// 	}));
// };

// // Helper function to create error response
// export const createZodErrorResponse = (error: ZodError): ZodErrorResponse => {
// 	const details = handleZodError(error);
// 	return {
// 		success: false,
// 		error: {
// 			code: "VALIDATION_ERROR",
// 			message: "Request validation failed",
// 			details,
// 		},
// 	};
// };

// // Middleware for handling Zod validation
// export const zodValidationMiddleware = (schema: z.ZodSchema) => {
// 	return async (c: Context, next: () => Promise<void>) => {
// 		try {
// 			const body = await c.req.json();
// 			const validated = await schema.parseAsync(body);
// 			c.set("validated", validated);
// 			await next();
// 		} catch (error) {
// 			if (error instanceof ZodError) {
// 				return c.json(createZodErrorResponse(error), 400);
// 			}
// 			throw error;
// 		}
// 	};
// };

// // Custom validation error handler for specific use cases
// export class ValidationError extends Error {
// 	constructor(
// 		public errors: FormattedZodError[],
// 		message: string = "Validation failed"
// 	) {
// 		super(message);
// 		this.name = "ValidationError";
// 	}
// }

// // Enhanced schema validation with custom error messages
// export const createEnhancedSchema = <T extends z.ZodSchema>(
// 	schema: T,
// 	customErrors: Record<string, string> = {}
// ) => {
// 	return schema.superRefine((data, ctx) => {
// 		Object.entries(customErrors).forEach(([path, message]) => {
// 			const value = path.split(".").reduce((obj, key) => obj?.[key], data);
// 			if (value === undefined || value === null) {
// 				ctx.addIssue({
// 					code: "custom",
// 					path: path.split("."),
// 					message,
// 				});
// 			}
// 		});
// 	});
// };
