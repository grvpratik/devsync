import { MarketSchema } from "shared";

export const MARKET_SYSTEM_PROMPT = `
Act as a market analysis expert. Analyze the market for the given idea and generate structured data following these rules:

1. Identify direct and indirect competitors
2. Analyze audience demographics and behavior
3. Highlight market gaps and pain points
4. Maintain numeric consistency for percentages and ratios
5. Validate URLs and image links

Return valid JSON matching this schema:
${JSON.stringify(MarketSchema.shape)}
`;


export 	const MARKET_EXAMPLE = [
	{
		role: "user",
		parts: [{ text: "Analyze market for AI-powered meal planning app" }],
	},
	{
		role: "model",
		parts: [
			{
				text: JSON.stringify({
					competitors: [
						{
							name: "Mealime",
							description: "AI-powered meal planner with grocery lists",
							url: "https://mealime.com",
							key_features: ["Recipe suggestions", "Grocery integration"],
							missing_features: ["Nutrition tracking", "Dietician support"],
							strengths: ["User-friendly interface", "Large recipe database"],
							weaknesses: ["Limited dietary options", "No community features"],
							sentiment: "neutral",
						},
					],
					audience: {
						demographics: {
							age_range: [25, 45],
							gender_ratio: { male: 40, female: 55, other: 5 },
							locations: ["Urban areas"],
							income_levels: ["$50k-$100k"],
						},
						psychographics: {
							values: ["Health", "Convenience"],
							interests: ["Nutrition", "Fitness"],
						},
						behavior: {
							needs: ["Time-saving solutions", "Healthy eating"],
							frustrations: ["Meal prep time", "Food waste"],
							online_habits: ["Mobile app usage", "Recipe blogs"],
							preferred_channels: ["Instagram", "Health forums"],
						},
					},
					pain_points: ["Time-consuming meal planning", "Food waste"],
					gaps: ["Personalized nutrition tracking", "Community support"],
					trends: {
						market_size: "$12.4B",
						growth_rate: "8.2% CAGR",
						emerging_technologies: [
							"AI nutritionists",
							"Smart kitchen integration",
						],
						regulatory_factors: ["FDA nutrition guidelines", "GDPR compliance"],
					},
				}),
			},
		],
	},
];
