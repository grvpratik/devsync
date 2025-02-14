import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { generationConfig, MODEL_TYPE } from "../lib/constant";
import { FeaturesResponseSchema } from "shared";
import { FEATURE_SYSTEM_INSTRUCTION ,FEATURE_EXAMPLE as history} from "../prompt/feature";


// === System Instruction ===

// === Core Function ===
export async function FeatureController(idea: string, c: any) {
	const { GEMINI_API } = c.env;
	const genAI = new GoogleGenerativeAI(GEMINI_API);

	const model = genAI.getGenerativeModel({
		model: MODEL_TYPE,
		systemInstruction: FEATURE_SYSTEM_INSTRUCTION,
		generationConfig,
	});

	// Example conversation history
	
	try {
		const chat = model.startChat({ history });
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
}
