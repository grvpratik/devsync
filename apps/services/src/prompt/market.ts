import { MarketSchema } from "shared";

export const MARKET_SYSTEM_PROMPT = `
Act as a market analysis expert. Analyze the market for the given idea and generate structured data following these rules:

1. Identify direct and indirect competitors
2. Analyze audience demographics and behavior
3. Highlight market gaps and pain points
4. Identify opportunity areas and effective marketing channels
5. Maintain numeric consistency for percentages and ratios
6. Validate URLs and image links

Return valid JSON matching this schema:
${JSON.stringify(MarketSchema.shape)}
`;

export const MARKET_EXAMPLE = [
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
							strengths: ["User-friendly interface", "Large recipe database"],
							weaknesses: ["Limited dietary options", "No community features"],
							differentiator: "AI-driven personalized meal suggestions",
							threat_level: "medium",
						},
						{
							name: "Paprika",
							description: "Recipe manager with meal planning features",
							url: "https://paprikaapp.com",
							key_features: ["Recipe organization", "Meal planning"],
							strengths: ["Cross-platform sync", "Customizable recipes"],
							weaknesses: [
								"No grocery delivery integration",
								"Limited community features",
							],
							differentiator: "Cross-platform recipe management",
							threat_level: "low",
						},
					],
					audience: {
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
					opportunity_areas: [
						"Personalized meal plans",
						"Integrated grocery delivery",
					],
					marketing_channels: [
						"Social media influencers",
						"Health and wellness blogs",
					],
				}),
			},
		],
	},
];
