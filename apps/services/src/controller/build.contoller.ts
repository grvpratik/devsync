import { Context } from "hono";
import { SearchRequestSchema } from "../types";

import { GenerativeAI } from "../prompt";

import { IdeaValidationResponse, RefreshField } from "shared";
import { AppError, AuthError } from "../error";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Prisma, PrismaClient } from "@prisma/client";
import { safeExecutePrismaOperation } from "../middleware/prisma";
import { FEATURE_EXAMPLE } from "../prompt/feature";

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
		try {
			const projectId = (await c.req.param("id")) || "";
			console.log("🔍 Project:", projectId);
			const adapter = new PrismaD1(c.env.DB);
			const prisma = new PrismaClient({ adapter });
			const result = await safeExecutePrismaOperation(
				async () =>
					await prisma.projectReport.findUnique({
						where: {
							id: projectId,
						},
					})
			);
			console.log(result);
			return c.json(
				{
					success: true,
					result,
				},
				200
			);
		} catch (error) {
			throw new AppError("Server error");
		}
	},
	refreshField: async (c: Context) => {
		const { GEMINI_API } = c.env;
		const userId = c.get("userId") || "cm73x26p80000yf0cekb44sro";
		if (!userId) {
			throw new AuthError("Forbidden");
		}
		const { id, field } = await c.req.param();
		console.log(Object.values(RefreshField));
		if (!id || !field) {
			throw new AppError(
				"Missing id or field parameter",
				400,
				"VALIDATION_ERROR"
			);
		}

		const validFields = Object.values(RefreshField);
		if (!validFields.includes(field as RefreshField)) {
			throw new AppError(
				`Invalid field. Must be one of: ${validFields.join(", ")}`,
				400,
				"VALIDATION_ERROR"
			);
		}
		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });
		const project = await safeExecutePrismaOperation(
			async () =>
				await prisma.projectReport.findUnique({
					where: {
						id,
						userId,
					},
				})
		);

		if (!project) {
			throw new AppError("Project not found", 404, "NOT_FOUND");
		}

		let generatedResult;
		const prompt = project.prompt;

		switch (field) {
			case RefreshField.Feature:
				generatedResult = await GenerativeAI.feature(prompt, GEMINI_API);
				break;
			case RefreshField.Market:
				generatedResult = await GenerativeAI.market(prompt, GEMINI_API);
				break;
			// case RefreshField.Overview:
			// 	generatedResult = await GenerativeAI.overview(prompt, GEMINI_API);
			// 	break;
			default:
				throw new AppError("Invalid field type", 400, "VALIDATION_ERROR");
		}

		if (!generatedResult) {
			throw new AppError("Failed to generate content", 500, "GENERATION_ERROR");
		}

		const updateReport = await safeExecutePrismaOperation(
			async () =>
				await prisma.projectReport.update({
					where: {
						id,
						userId,
					},
					data: {
						[field.toLowerCase()]: generatedResult as Prisma.InputJsonValue,
					},
				})
		);

		const fieldKey = field.toLowerCase() as keyof typeof updateReport;
		return c.json(
			{
				success: true,
				result: updateReport[fieldKey],
			},
			200
		);
	},
};
