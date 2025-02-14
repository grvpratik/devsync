import { Context } from "hono";
import { SearchRequestSchema } from "../types";

import { GenerativeAI } from "../prompt";

import { IdeaValidationResponse } from "shared";
import { AppError, AuthError } from "../error";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Prisma, PrismaClient } from "@prisma/client";

export const BuildController = {
	getSearch: async (c: Context) => {
		const userId = c.get("userId") || "cm73x26p80000yf0cekb44sro";
		if (!userId) {
			throw new AuthError("authentication required");
		}

		const { GEMINI_API } = c.env;
		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });

		const body = await c.req.json();
		const parsed = SearchRequestSchema.safeParse(body);
		console.log(body);
		if (!parsed.success) {
			throw new AppError(
				"Invalid request format",
				400,
				"VALIDATION_ERROR",
				parsed.error
			);
		}
		const { value, project, model } = parsed.data;

		console.log("Processing search request:", {
			project,
			model,
			valueLength: value.length,
		});

		// Get metadata information
		const metadata = await GenerativeAI.metadata(value, GEMINI_API);
		console.log(metadata);
		if (!metadata) {
			throw new AppError("Failed to retrieve metadata", 500, "METADATA_ERROR");
		}

		const validationResult = await GenerativeAI.validateIdea(value, GEMINI_API);
		if (!validationResult?.isValid) {
			throw new AppError(
				validationResult?.reasoning ?? "Invalid prompt",
				400,
				"INVALID_IDEA"
			);
		}

		// Parallel processing for better performance
		const [overviewResult, marketResult, featureResult] = await Promise.all([
			GenerativeAI.overview(value, GEMINI_API).catch((error) => {
				console.error("Overview processing failed:", error);
				return null;
			}),
			GenerativeAI.market(value, GEMINI_API).catch((error) => {
				console.error("Market processing failed:", error);
				return null;
			}),
			GenerativeAI.feature(value, GEMINI_API).catch((error) => {
				console.error("Market processing failed:", error);
				return null;
			}),
		]);
		// if (!featureResult || !overviewResult || !marketResult) {
		// 	throw new AppError(
		// 		"Failed to generate complete analysis",
		// 		500,
		// 		"ANALYSIS_ERROR"
		// 	);
		// }

		const result: IdeaValidationResponse = {
			prompt: value,
			timestamp: new Date(),
			metadata,
			overview: overviewResult!,
			...(marketResult && { market: marketResult }),
			...(featureResult && { feature: featureResult }),
		};
		const createProjectReport = async (
			userId: string,
			result: IdeaValidationResponse
		) => {
			try {
				const report = await prisma.projectReport.create({
					data: {
						prompt: result.prompt,
						timestamp: result.timestamp,
						metadata: result.metadata as Prisma.InputJsonValue,
						overview:
							result.overview ?
								(result.overview as Prisma.InputJsonValue)
							:	Prisma.JsonNull,
						market:
							result.market ?
								(result.market as Prisma.InputJsonValue)
							:	Prisma.JsonNull,
						feature:
							result.feature ?
								(result.feature as Prisma.InputJsonValue)
							:	Prisma.JsonNull,
						user: {
							connect: {
								id: userId,
							},
						},
					},
				});

				return report;
			} catch (error) {
				if (error instanceof Prisma.PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new AppError(
							"A report for this user already exists",
							400,
							"DUPLICATE_REPORT"
						);
					}
				}
				throw new AppError(
					"Failed to create project report",
					500,
					"DATABASE_ERROR"
				);
			}
		};
		const report = await createProjectReport(userId, result);

		return c.json(
			{
				success: true,
				url: report.id,
			},
			200
		);
	},
	getReportById: async (c: Context) => {
		const userId = c.get("userId") || "cm73x26p80000yf0cekb44sro";
		if (!userId) {
			throw new AuthError("authentication required");
		}
		const id = c.req.param("id") || "";
		console.log("🔍 Project:",id)
		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });

		const createProjectReportById = async (
			userId: string,
			projectId: string
		) => {
			try {
				const report = await prisma.projectReport.findUnique({
					where:{
						userId
					}
				});

				return report;
			} catch (error) {
				if (error instanceof Prisma.PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new AppError(
							"A report for this user already exists",
							400,
							"DUPLICATE_REPORT"
						);
					}
				}
				throw new AppError(
					"Failed to create project report",
					500,
					"DATABASE_ERROR"
				);
			}
		};
		const result;
	},
};
