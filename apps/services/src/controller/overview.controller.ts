import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { generationConfig, MODEL_TYPE } from "../lib/constant";
import { OverviewSchema } from "shared";
import { OVERVIEW_SYSTEM_INSTRUCTION,OVERVIEW_EXAMPLE as history } from "../prompt/overview";




// === Core Function ===
export async function OverviewController(idea: string, c: any) {
	
	const { GEMINI_API } = c.env;
	const genAI = new GoogleGenerativeAI(GEMINI_API);

	const model = genAI.getGenerativeModel({
		model: MODEL_TYPE,
		systemInstruction: OVERVIEW_SYSTEM_INSTRUCTION,
		generationConfig,
	});

	
	try {
		const chat = model.startChat({ history });
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
}
