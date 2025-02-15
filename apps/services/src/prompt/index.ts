import { GoogleGenerativeAI } from "@google/generative-ai";
import { generationConfig, MODEL_TYPE } from "../lib/constant";

import {
	FeaturesResponseSchema,
	MarketSchema,
	MetaData,
	MetadataSchema,
	OverviewSchema,
	PhasesOutputSchema,
} from "shared";
import { PROJECT_IDEA_SYSTEM_INSTRUCTION, PROJECT_IDEA_EXAMPLE } from "./info";
import {
	IdeaValidationSchema,
	VALID_IDEA_EXAMPLE,
	VALID_IDEA_SYSTEM_INSTRUCTION,
} from "./validIdea";
import { OVERVIEW_SYSTEM_INSTRUCTION, OVERVIEW_EXAMPLE } from "./overview";
import { MARKET_EXAMPLE, MARKET_SYSTEM_PROMPT } from "./market";
import { FEATURE_EXAMPLE, FEATURE_SYSTEM_INSTRUCTION } from "./feature";
import { AppError, ValidationError } from "../error";
import { ZodError } from "zod";
import { PHASES_EXAMPLES, PHASES_SYSTEM_INSTRUCTION } from "./phase";

export const 
GenerativeAI = {
	metadata: async (idea: string, key: string): Promise<MetaData> => {
		const genAI = new GoogleGenerativeAI(key);

		const model = genAI.getGenerativeModel({
			model: MODEL_TYPE,
			systemInstruction: PROJECT_IDEA_SYSTEM_INSTRUCTION,
			generationConfig,
		});

		try {
			const chat = model.startChat({ history: PROJECT_IDEA_EXAMPLE });
			const result = await chat.sendMessage(idea);
			const response = result.response.text();

			// Validate and parse response
			const rawData = JSON.parse(response);
			const validated = MetadataSchema.parse(rawData);

			return validated;
		} catch (error) {
			console.error("Validation Error:", error);
			throw new Error("Failed to generate valid overview analysis");
		}
	},
	validateIdea: async (idea: string, key: string) => {
		const genAI = new GoogleGenerativeAI(key);
		const model = genAI.getGenerativeModel({
			model: MODEL_TYPE,
			systemInstruction: VALID_IDEA_SYSTEM_INSTRUCTION,
			generationConfig,
		});
		try {
			if (!idea || typeof idea !== "string") {
				throw new Error("Invalid input: Idea must be a non-empty string");
			}

			if (idea.trim().length < 5) {
				return {
					isValid: false,
					confidence: 0,
					category: "invalid",
					reasoning: "Input is too short to be a valid idea",
				};
			}

			const chat = model.startChat({ history: VALID_IDEA_EXAMPLE });
			const result = await chat.sendMessage(idea);
			const response = result.response.text();

			const rawData = JSON.parse(response);
			const validated = IdeaValidationSchema.parse(rawData);
			console.log(validated);
			return validated;
		} catch (error) {
			console.error("Idea Validation Error:", error);
			throw new Error("Failed to validate idea");
		}
	},
	overview: async (idea: string, key: string) => {
		const genAI = new GoogleGenerativeAI(key);

		const model = genAI.getGenerativeModel({
			model: MODEL_TYPE,
			systemInstruction: OVERVIEW_SYSTEM_INSTRUCTION,
			generationConfig,
		});

		try {
			const chat = model.startChat({ history: OVERVIEW_EXAMPLE });
			const result = await chat.sendMessage(idea);
			const response = result.response.text();

			// Validate and parse response
			const rawData = JSON.parse(response);
			const validated = OverviewSchema.parse(rawData);

			return validated;
		} catch (error) {
			console.error("Validation Error:", error);
			throw new Error("Failed to generate valid overview analysis");
		}
	},
	feature: async (idea: string, key: string) => {
		const genAI = new GoogleGenerativeAI(key);

		const model = genAI.getGenerativeModel({
			model: MODEL_TYPE,
			systemInstruction: FEATURE_SYSTEM_INSTRUCTION,
			generationConfig,
		});

		try {
			const chat = model.startChat({ history: FEATURE_EXAMPLE });
			const result = await chat.sendMessage(idea);
			const response = result.response.text();

			// Validate and parse response
			const rawData = JSON.parse(response);
			const validated = FeaturesResponseSchema.parse(rawData);

			return validated;
		} catch (error) {
			console.error("Feature Generation Error:", error);
			throw new Error("Failed to generate valid feature list");
		}
	},
	market: async (idea: string, key: string) => {
		const genAI = new GoogleGenerativeAI(key);
		const model = genAI.getGenerativeModel({
			model: MODEL_TYPE,
			systemInstruction: MARKET_SYSTEM_PROMPT,
			generationConfig,
		});

		try {
			const chat = model.startChat({ history: MARKET_EXAMPLE });
			const result = await chat.sendMessage(idea);
			const response = result.response.text();

			// Validate and parse response
			const rawData = JSON.parse(response);
			console.log(rawData);
			return MarketSchema.parse(rawData);
		} catch (error) {
			console.error("Market Analysis Error:", error);
			if (error instanceof ZodError) {
				throw new ValidationError(
					"Failed to generate valid market analysis",
					error.errors
				);
			}
		}
	},
	phases: async (idea: string, key: string,mvp:any,blueprint:any) => {
		const genAI = new GoogleGenerativeAI(key);
		const model = genAI.getGenerativeModel({
			model: MODEL_TYPE,
			systemInstruction: PHASES_SYSTEM_INSTRUCTION,
			generationConfig,
		});
		try {
			const promptMessage = `Business Idea: ${idea}\n Project MVP: ${JSON.stringify(mvp)}\n Project Development Phases: ${JSON.stringify(blueprint)}`;

			const chat = model.startChat({history:PHASES_EXAMPLES});
			const result = await chat.sendMessage(promptMessage);
			const response = result.response.text();

			// Validate and parse response
			const rawData = JSON.parse(response);
			console.log(rawData);
			return PhasesOutputSchema.parse(rawData);
		} catch (error) {
			console.error("Market Analysis Error:", error);
			if (error instanceof ZodError) {
				throw new ValidationError(
					"Failed to generate vaild phases",
					error.errors
				);
			}
		}
	},
};
