import { FeaturesResponseSchema } from "shared";

export const FEATURE_SYSTEM_INSTRUCTION = `
Act as a product manager. Analyze the project idea and generate a structured list of features following these rules:

1. Identify must-have, should-have, and nice-to-have features
2. Provide a unique ID, name, and description for each feature
3. Assign a priority level (high, medium, low).(MUST BE LOWERCASE)
4. Estimate the complexity of each feature on a scale of 1 to 10
5. Categorize features into MVP (Minimum Viable Product) and additional features

Return valid JSON matching this schema:
${JSON.stringify(FeaturesResponseSchema.shape)}
`;
export const FEATURE_EXAMPLE = [
	{
		role: "user",
		parts: [
			{ text: "Generate a feature list for an AI-powered meal planning app" },
		],
	},
	{
		role: "model",
		parts: [
			{
				text: JSON.stringify({
					mvp: [
						{
							id: "f1",
							name: "AI-Driven Meal Suggestions",
							description:
								"Provide personalized meal suggestions based on user preferences and dietary restrictions",
							priority: "high",
							complexity: 8,
							type: "must-have",
						},
						{
							id: "f2",
							name: "Grocery List Generation",
							description: "Generate a grocery list based on selected meals",
							priority: "high",
							complexity: 6,
							type: "must-have",
						},
						{
							id: "f3",
							name: "User Profile Management",
							description:
								"Allow users to create and manage their profiles, including dietary preferences and allergies",
							priority: "medium",
							complexity: 5,
							type: "must-have",
						},
					],
					features: [
						{
							id: "f4",
							name: "Nutrition Tracking",
							description: "Track nutritional intake based on selected meals",
							priority: "medium",
							complexity: 7,
							type: "should-have",
						},
						{
							id: "f5",
							name: "Recipe Sharing",
							description:
								"Allow users to share their favorite recipes with friends",
							priority: "low",
							complexity: 4,
							type: "nice-to-have",
						},
						{
							id: "f6",
							name: "Integration with Fitness Apps",
							description:
								"Integrate with popular fitness apps to sync meal plans with workout routines",
							priority: "low",
							complexity: 6,
							type: "nice-to-have",
						},
					],
				}),
			},
		],
	},
];
