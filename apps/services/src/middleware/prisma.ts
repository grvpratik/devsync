import { Prisma } from "@prisma/client";

// Enum for Prisma Error Codes
export enum PrismaErrorCode {
	// Query Engine Errors
	RecordNotFound = "P2001",
	UniqueConstraintViolation = "P2002",
	ForeignKeyConstraintViolation = "P2003",
	ConstraintViolation = "P2004",
	RecordNotFoundForWhere = "P2005",
	ValueTooLongForColumn = "P2006",
	RecordAlreadyExists = "P2007",
	// Migration Engine Errors
	MigrationFailed = "P3000",
	// Client Errors
	InvalidInput = "P4000",
	ConnectionError = "P5000",
}

// Custom error class for Prisma errors
export class PrismaError extends Error {
	constructor(
		public code: string,
		public message: string,
		public status: number,
		public meta?: Record<string, any>
	) {
		super(message);
		this.name = "PrismaError";
	}
}

// Main error handler function
export const handlePrismaError = (error: any): PrismaError => {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		// Handle known request errors
		switch (error.code) {
			case PrismaErrorCode.RecordNotFound:
				return new PrismaError(
					error.code,
					"The requested record was not found.",
					404,
					error.meta
				);

			case PrismaErrorCode.UniqueConstraintViolation:
				const field = error.meta?.target as string[];
				return new PrismaError(
					error.code,
					`Unique constraint violated on ${field?.join(", ")}`,
					409,
					error.meta
				);

			case PrismaErrorCode.ForeignKeyConstraintViolation:
				return new PrismaError(
					error.code,
					"Foreign key constraint violation",
					409,
					error.meta
				);

			case PrismaErrorCode.ValueTooLongForColumn:
				return new PrismaError(
					error.code,
					"Input value is too long for the field",
					400,
					error.meta
				);

			default:
				return new PrismaError(
					error.code,
					"Database operation failed",
					500,
					error.meta
				);
		}
	} else if (error instanceof Prisma.PrismaClientValidationError) {
		// Handle validation errors
		return new PrismaError(
			"P4000",
			"Invalid data provided to Prisma client",
			400
		);
	} else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
		// Handle unknown request errors
		return new PrismaError("P5000", "Unknown database error occurred", 500);
	} else if (error instanceof Prisma.PrismaClientRustPanicError) {
		// Handle Rust panic errors
		return new PrismaError("P5001", "Critical database error occurred", 500);
	} else if (error instanceof Prisma.PrismaClientInitializationError) {
		// Handle initialization errors
		return new PrismaError("P5002", "Database connection failed", 503);
	}

	// Handle any other errors
	return new PrismaError("UNKNOWN", "An unexpected error occurred", 500);
};

// Usage example with try-catch
export const safeExecutePrismaOperation = async <T>(
	operation: () => Promise<T>
): Promise<T> => {
	try {
		return await operation();
	} catch (error) {
		throw handlePrismaError(error);
	}
};


// const [report, stats] = await Promise.all([
// 	safeExecutePrismaOperation(() =>
// 		prisma.projectReport.update({
// 			where: { id },
// 			data,
// 		})
// 	),
// 	safeExecutePrismaOperation(() =>
// 		prisma.reportStats.upsert({
// 			where: { reportId: id },
// 			create: { reportId: id, updates: 1 },
// 			update: { updates: { increment: 1 } },
// 		})
// 	),
// ]);
