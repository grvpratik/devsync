import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { generationConfig, MODEL_TYPE } from "../lib/constant";
import { FeaturesResponseSchema } from "shared";


// === System Instruction ===
const SYSTEM_INSTRUCTION = `
Act as a product feature strategist. Analyze the input idea and generate a comprehensive feature list following these rules:

1. Identify core MVP features essential for launch
2. List additional features for future development
3. Prioritize features based on business value
4. Rate complexity from 1-10
5. Categorize as must-have, should-have, or nice-to-have
6. Provide clear, specific feature descriptions
7. Generate unique IDs for each feature

Return valid JSON matching this schema:
${JSON.stringify(FeaturesResponseSchema.shape)}
`;

// === Core Function ===
export async function FeatureController(idea: string, c: any) {
	const { GEMINI_API } = c.env;
	const genAI = new GoogleGenerativeAI(GEMINI_API);

	const model = genAI.getGenerativeModel({
		model: MODEL_TYPE,
		systemInstruction: SYSTEM_INSTRUCTION,
		generationConfig,
	});

	// Example conversation history
	const history = [
		{
			role: "user",
			parts: [
				{
					text: "Social media platform for pet owners with AI-generated content",
				},
			],
		},
		{
			role: "model",
			parts: [
				{
					text: JSON.stringify({
						mvp: [
							{
								id: "mvp-001",
								name: "User Authentication",
								description:
									"Basic email and social login functionality for pet owners",
								priority: "P0",
								complexity: 3,
								type: "must-have",
							},
							{
								id: "mvp-002",
								name: "Pet Profile Creation",
								description:
									"Allow users to create and customize pet profiles with photos and basic info",
								priority: "P0",
								complexity: 4,
								type: "must-have",
							},
							{
								id: "mvp-003",
								name: "Basic AI Content Generator",
								description:
									"Simple AI tool to generate pet-related posts and captions",
								priority: "P0",
								complexity: 7,
								type: "must-have",
							},
						],
						features: [
							{
								id: "feat-001",
								name: "Advanced AI Content Templates",
								description:
									"Customizable templates for different types of pet content",
								priority: "P1",
								complexity: 6,
								type: "should-have",
							},
							{
								id: "feat-002",
								name: "Pet Community Groups",
								description: "Create and join breed-specific community groups",
								priority: "P2",
								complexity: 5,
								type: "nice-to-have",
							},
						],
					}),
				},
			],
		},
	];

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
