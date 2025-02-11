import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { generationConfig, MODEL_TYPE } from "../lib/constant";

// === Zod Schema ===
const IdeaValidationSchema = z.object({
	isValid: z.boolean(),
	confidence: z.number().min(0).max(1),
	category: z.enum(["tech", "non-tech", "invalid"]),
	 reasoning: z.string(),
	// suggestions: z.array(z.string()).optional(),
	// issues: z
	// 	.array(
	// 		z.object({
	// 			type: z.enum(["clarity", "scope", "feasibility", "tech-relevance"]),
	// 			description: z.string(),
	// 		})
	// 	)
	// 	.optional(),
});

// === System Instruction ===
const SYSTEM_INSTRUCTION = `
Act as an idea validation expert. Analyze the input and determine if it's a valid, tech-related business idea following these criteria:

1. Check if the idea is clearly articulated and makes logical sense
2. Verify if it has a technological component
3. Assess if it could be implemented as a real product/service
4. Determine if it's specific enough to be actionable
5. Give short responses

Return valid JSON matching this schema:
${JSON.stringify(IdeaValidationSchema.shape)}

Rate confidence between 0-1, where:
- 0.8-1.0: Clear, well-defined tech idea
- 0.5-0.7: Potentially viable but needs clarification
- 0.0-0.4: Unclear, non-tech, or invalid idea
`;

// === Core Function ===
export async function ValidateIdeaController(idea: string, c: any) {
	const { GEMINI_API } = c.env;
	console.log(GEMINI_API);
	const genAI = new GoogleGenerativeAI(GEMINI_API);

	const model = genAI.getGenerativeModel({
		model: MODEL_TYPE,
		systemInstruction: SYSTEM_INSTRUCTION,
		generationConfig,
	});

	
	const history = [
		{
			role: "user",
			parts: [{ text: "flying cars with AI" }],
		},
		{
			role: "model",
			parts: [
				{
					text: JSON.stringify({
						isValid: false,
						confidence: 0.3,
						category: "invalid",
						reasoning:
							"The idea is too vague and lacks specific technological implementation details",
						
					}),
				},
			],
		},
		{
			role: "user",
			parts: [
				{ text: "AI-powered code review tool that integrates with GitHub" },
			],
		},
		{
			role: "model",
			parts: [
				{
					text: JSON.stringify({
						isValid: true,
						confidence: 0.9,
						category: "tech",
						reasoning:
							"Clear tech idea with specific implementation path and existing market",
					}),
				},
			],
		},
	];

	try {
		// Basic input validation
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

		// Validate and parse response
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