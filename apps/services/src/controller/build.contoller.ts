import { Context } from "hono";
import { SearchRequestSchema } from "../types";

import { GenerativeAI } from "../prompt";

import { IdeaValidationResponse } from "shared";
import { AppError } from "../error";

export const BuildController = {
	getSearch: async (c: Context) => {
		const { GEMINI_API } = c.env;
		
			const body = await c.req.json();
			const parsed = SearchRequestSchema.safeParse(body);
			console.log(body);
			if (!parsed.success) {
				throw new AppError("Invalid request format", 400, "VALIDATION_ERROR",parsed.error);
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
				throw new AppError(
					"Failed to retrieve metadata",
					500,
					"METADATA_ERROR"
				);
			}

			const validationResult = await GenerativeAI.validateIdea(
				value,
				GEMINI_API
			);
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

			const response: IdeaValidationResponse = {
				prompt: value,
				timestamp: new Date(),
				metadata,
				overview: overviewResult!,
				...(marketResult && { market: marketResult }),
				...(featureResult && { feature: featureResult }),
			};

			return c.json(
				{
					success: true,
					result: response,
				},
				200
			);
		
	},
};
