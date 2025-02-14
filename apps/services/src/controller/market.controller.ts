import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generationConfig, MODEL_TYPE } from "../lib/constant";

import { MarketSchema } from "shared";
import { CompetitorSchema } from "shared";
import { MARKET_SYSTEM_PROMPT,MARKET_EXAMPLE as history } from "../prompt/market";
// === System Instruction ===


export async function MarketController(idea: string, c: any) {
	const { GEMINI_API } = c.env;
	const genAI = new GoogleGenerativeAI(GEMINI_API);
	const model = genAI.getGenerativeModel({
		model: MODEL_TYPE,
		systemInstruction: MARKET_SYSTEM_PROMPT,
		generationConfig,
	});

	// Example conversation history

	try {
		const chat = model.startChat({ history });
		const result = await chat.sendMessage(idea);
		const response = result.response.text();

		// Validate and parse response
		const rawData = JSON.parse(response);
		return MarketSchema.parse(rawData);
	} catch (error) {
		console.error("Market Analysis Error:", error);
		throw new Error("Failed to generate valid market analysis");
	}
}

// Type exports

//social_listening: {
// 	reddit: {
// 		popular_threads: ["Meal prep tips", "Budget eating"],
// 		common_complaints: [
// 			"App subscription costs",
// 			"Limited recipes",
// 		],
// 	},
// 	google_trends: {
// 		interest_over_time: { "2023-01": 65, "2023-06": 82 },
// 		related_queries: ["healthy recipes", "meal planning template"],
// 	},
// },
