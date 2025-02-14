import { OverviewSchema } from "shared";

export const OVERVIEW_SYSTEM_INSTRUCTION = `
Act as a business idea validation expert. Analyze the input idea and generate structured output following these rules:

1. Score each category (feasibility, marketfit, uniqueness, technical) 1-10
2. Provide concrete suggestions and missing components
3. Identify key success/failure indicators
4. Maintain strict numeric ranges and types
5. Use clear, actionable language

Return valid JSON matching this schema:
${JSON.stringify(OverviewSchema.shape)}
`;

export const OVERVIEW_EXAMPLE = [
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
