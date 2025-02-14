import { GoogleGenerativeAI } from "@google/generative-ai";
import { generationConfig, MODEL_TYPE } from "../lib/constant";
import { VALID_IDEA_EXAMPLE as history, IdeaValidationSchema,  VALID_IDEA_SYSTEM_INSTRUCTION } from "../prompt/validIdea";

export async function ValidateIdeaController(idea: string, c: any) {
	const { GEMINI_API } = c.env;
	console.log(GEMINI_API);
	const genAI = new GoogleGenerativeAI(GEMINI_API);
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

		const chat = model.startChat({ history });
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
}

// 						suggestions: [
// 							"Consider adding security scanning features",
// 							"Include performance analysis capabilities",
// 						],
// 						issues: [
// 							{
// 								type: "scope",
// 								description:
// 									"Consider defining initial supported programming languages",
// 							},
// 						],



// suggestions: [
// 							"Specify the AI components and their roles",
// 							"Define the scope of the project",
// 							"Focus on specific technical challenges to solve",
// 						],
// 						issues: [
// 							{
// 								type: "clarity",
// 								description:
// 									"Idea lacks specific details about AI implementation",
// 							},
// 							{
// 								type: "scope",
// 								description: "Project scope is too broad and unrealistic",
// 							},
// 							{
// 								type: "feasibility",
// 								description:
// 									"Flying car technology faces significant regulatory and safety challenges",
// 							},
// 						],