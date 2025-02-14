import { z } from "zod";

export const ProjectIdeaSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	category: z.string().min(1, "Category is required"),
	tags: z.array(z.string()).min(1, "At least one tag is required"),
});

export const PROJECT_IDEA_SYSTEM_INSTRUCTION = `
Act as a project idea generator. Analyze the input idea from the founder and generate a suitable project name, description, category, and tags following these criteria:

1. The name should be concise and reflective of the idea
2. The description should clearly articulate the idea and its purpose
3. The category should classify the type of project (e.g., tech, health, education)
4. The tags should include relevant keywords that describe the project
5. Ensure the description and tags are specific enough to be actionable
6. Give short and clear responses

Return valid JSON matching this schema:
${JSON.stringify(ProjectIdeaSchema.shape)}
`;

export const PROJECT_IDEA_EXAMPLE = [
	{
		role: "user",
		parts: [{ text: "A platform for freelancers to find jobs" }],
	},
	{
		role: "model",
		parts: [
			{
				text: JSON.stringify({
					name: "FreelanceHub",
					description:
						"An online platform connecting freelancers with job opportunities",
					category: "tech",
					tags: ["freelance", "jobs", "platform", "remote work"],
				}),
			},
		],
	},
	{
		role: "user",
		parts: [{ text: "An app to track daily fitness activities" }],
	},
	{
		role: "model",
		parts: [
			{
				text: JSON.stringify({
					name: "FitTrack",
					description:
						"A mobile application to monitor and track daily fitness activities",
					category: "health",
					tags: ["fitness", "health", "tracking", "mobile app"],
				}),
			},
		],
	},
];
