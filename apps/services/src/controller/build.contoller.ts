import { Context } from "hono";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Prisma, PrismaClient } from "@prisma/client";

import {
	IdeaValidationResponse,
	RefreshField,
	PhasesOutputSchema,
	Phases,
} from "shared";

import { SearchRequestSchema } from "../types";
import { GenerativeAI } from "../prompt";
import { AppError, AuthError, ValidationError } from "../error";
import { safeExecutePrismaOperation } from "../middleware/prisma";

import { z } from "zod";

export const BuildController = {
	getSearch: async (c: Context) => {
		const userId :string= c.get("userId") ??"";
		if (!userId) {
			throw new AuthError("authentication required");
		}

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
		const { GEMINI_API } = c.env;
		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });

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
		console.log(await prisma.projectReport.findMany());
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
				// if (error instanceof Prisma.PrismaClientKnownRequestError) {
				// 	if (error.code === "P2002") {
				// 		throw new AppError(
				// 			"A report for this user already exists",
				// 			400,
				// 			"DUPLICATE_REPORT",error
				// 		);
				// 	}
				// }
				throw new AppError(
					"Failed to create project report",
					500,
					"DATABASE_ERROR"
				);
			}
		};
		const report = await createProjectReport(userId, result);
		console.log("PROJECT REPORT", report);
		return c.json(
			{
				success: true,
				url: report.id,
			},
			200
		);
	},
	getReportById: async (c: Context) => {
		const userId = c.get("userId") ?? ""
		if (!userId) {
			throw new AuthError("authentication required");
		}
		try {
			const projectId = (await c.req.param("id")) || "";
			//console.log("🔍 Project:", projectId);
			const adapter = new PrismaD1(c.env.DB);
			const prisma = new PrismaClient({ adapter });
			const result = await safeExecutePrismaOperation(
				async () =>
					await prisma.projectReport.findUnique({
						where: {
							id: projectId,
							userId
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
		const userId = c.get("userId") ??"";
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
		if (project && project[field as RefreshField]) {
			throw new AppError("result already present", 404, "NOT_FOUND");
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
	getPhases: async (c: Context) => {
		const PhaseTamplete = z.object({
			name: z.string(),
			description: z.string(),
			start_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
				message: "Invalid date format for start_date",
			}),
			end_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
				message: "Invalid date format for end_date",
			}),
			content: z.array(z.any()).optional(),
		});

		const PhaseTampleteArray = z.array(PhaseTamplete);

		const { GEMINI_API } = c.env;
		const userId = c.get("userId") || "cm73x26p80000yf0cekb44sro";
		if (!userId) {
			throw new AuthError("Forbidden");
		}
		const { id } = await c.req.param();
		if (!id) {
			throw new AppError(
				"Missing id or field parameter",
				400,
				"VALIDATION_ERROR"
			);
		}
		const body = await c.req.json();
		console.log(body);
		const parsed = PhaseTampleteArray.safeParse(body);

		console.log(body);
		if (!parsed.success) {
			throw new ValidationError("invalid phase details", parsed.error);
		}
		// const {  } = parsed.data;
		// console.log(parsed.data,"parsed");
		const phasesInfo =
			parsed.data &&
			parsed.data.map((phase) => {
				return {
					name: phase.name,
					desc: phase.description,
				};
			});
		console.log("parsed info", phasesInfo);

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
		if (!project.phases) {
			throw new AppError("Project phases have already been created", 402, "ALREADY_EXIST");
		}
		const prompt = project.prompt;
		const features: any = project.feature;
		const mvp = features.mvp;

		const phasesResult = await GenerativeAI.phases(
			prompt,
			GEMINI_API,
			mvp,
			phasesInfo
		);
		const insertedPhase: Phases = phasesResult!;

		const phaseWithDate = insertedPhase.map((item, index) => {
			const phaseInfo = parsed.data[index];
			return {
				name:item.name,
				start_date: phaseInfo.start_date,
				end_date: phaseInfo.end_date,
				tasks: item.tasks.map((val) => ({ ...val, done: false })),
			};
		});
		const updatedSchedule = await safeExecutePrismaOperation(
			async () =>
				await prisma.projectReport.update({
					where: {
						id,
						userId,
					},
					data: {
						phases: phaseWithDate as Prisma.InputJsonValue,
					},
				})
		);
		console.log(updatedSchedule)
		
		return c.json({ success: true, result: updatedSchedule.phases }, 200);
	},
	getAllUserReport:async(c:Context)=>{
		
		const userId = c.get("userId") ?? "";
		if (!userId) {
			throw new AuthError("authentication required");
		}
		

		try {
			
			const adapter = new PrismaD1(c.env.DB);
			const prisma = new PrismaClient({ adapter });
			const result = await safeExecutePrismaOperation(
				async () =>
					await prisma.projectReport.findMany({
						where: {
							userId,
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
	}
};
