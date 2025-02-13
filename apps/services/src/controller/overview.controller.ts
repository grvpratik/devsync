import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { generationConfig, MODEL_TYPE } from "../lib/constant";
import { OverviewSchema } from "shared";



// === System Instruction ===
const SYSTEM_INSTRUCTION = `
Act as a business idea validation expert. Analyze the input idea and generate structured output following these rules:

1. Score each category (feasibility, marketfit, uniqueness, technical) 1-10
2. Provide concrete suggestions and missing components
3. Identify key success/failure indicators
4. Maintain strict numeric ranges and types
5. Use clear, actionable language

Return valid JSON matching this schema:
${JSON.stringify(OverviewSchema.shape)}
`;

// === Core Function ===
export async function OverviewController(idea: string, c: any) {
	
	const { GEMINI_API } = c.env;
	const genAI = new GoogleGenerativeAI(GEMINI_API);

	const model = genAI.getGenerativeModel({
		model: MODEL_TYPE,
		systemInstruction: SYSTEM_INSTRUCTION,
		generationConfig,
	});

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
						problem: "Pet owners struggle to create engaging content regularly",
						score: {
							feasibility: {
								score: 7,
								overview: "Moderate technical requirements",
								considerations: [
									"Content generation AI complexity",
									"Community moderation",
								],
							},
							marketfit: {
								score: 8,
								overview: "Strong pet industry growth",
								considerations: [
									"Niche audience focus",
									"Monetization challenges",
								],
							},
							uniqueness: {
								score: 6,
								overview: "Similar platforms exist",
								considerations: [
									"AI content differentiation",
									"Community features",
								],
							},
							technical: {
								score: 7,
								overview: "Requires AI integration",
								considerations: [
									"Content moderation systems",
									"Mobile-first approach",
								],
							},
						},
						suggestion: [
							{
								name: "AI Content Templates",
								description: "Pre-built templates for common pet content",
							},
							{
								name: "Breed-Specific Communities",
								description: "Dedicated spaces for different pet types",
							},
						],
						missing: [
							{
								name: "Moderation System",
								description: "Automated content filtering for pet safety",
							},
						],
						indication: [
							{
								name: "User Engagement",
								description: "Daily active users above 10k indicates success",
								type: "success",
							},
							{
								name: "Content Quality",
								description: "Low-quality AI content leads to user churn",
								type: "failure",
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
		const validated = OverviewSchema.parse(rawData);

		return validated;
	} catch (error) {
		console.error("Validation Error:", error);
		throw new Error("Failed to generate valid overview analysis");
	}
}
