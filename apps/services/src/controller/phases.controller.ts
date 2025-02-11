const phases = [
	{
		name: "core",
		tasks: [
			{
				title: "Market Research",
				desc: "Conduct initial market research to understand trends, target audience, and competitors.",
				priority: "high",
			},
			{
				title: "Tools Research",
				desc: "Evaluate and select development tools and frameworks for the project.",
				priority: "medium",
			},
			{
				title: "Initial Implementation",
				desc: "Set up project scaffolding and implement core functionalities.",
				priority: "high",
			},
		],
	},
	{
		name: "MVP",
		tasks: [
			{
				title: "Simple UI Development",
				desc: "Design and develop a minimal user interface for basic interactions.",
				priority: "high",
			},
			{
				title: "Core Functionality Implementation",
				desc: "Implement essential features required to make the MVP functional.",
				priority: "high",
			},
		],
	},
	{
		name: "auth",
		tasks: [
			{
				title: "Authentication Flow Design",
				desc: "Design secure authentication flows for user login and registration.",
				priority: "high",
			},
			{
				title: "Token-Based Authentication",
				desc: "Implement session management with token-based authentication.",
				priority: "high",
			},
			{
				title: "OAuth Integration",
				desc: "Integrate third-party authentication providers for alternative sign-in options.",
				priority: "medium",
			},
		],
	},
	{
		name: "database",
		tasks: [
			{
				title: "Database Schema Design",
				desc: "Design the database schema and data models for the application.",
				priority: "high",
			},
			{
				title: "Database Integration",
				desc: "Integrate and configure the chosen database system (SQL/NoSQL).",
				priority: "medium",
			},
			{
				title: "Data Migration Setup",
				desc: "Plan and implement data migration strategies for future scalability.",
				priority: "medium",
			},
		],
	},
	{
		name: "UI",
		tasks: [
			{
				title: "UI Enhancements",
				desc: "Refine and improve the user interface based on initial feedback.",
				priority: "medium",
			},
			{
				title: "Responsive Design",
				desc: "Ensure the interface is responsive and functions well on various devices.",
				priority: "high",
			},
			{
				title: "Accessibility Improvements",
				desc: "Implement accessibility best practices for an inclusive user experience.",
				priority: "medium",
			},
		],
	},
	{
		name: "refactor and deployment",
		tasks: [
			{
				title: "Code Refactoring",
				desc: "Refactor the codebase to improve maintainability and performance.",
				priority: "medium",
			},
			{
				title: "Deployment Pipeline Setup",
				desc: "Configure CI/CD pipelines for automated testing and deployment.",
				priority: "high",
			},
			{
				title: "Performance Optimization",
				desc: "Optimize code and infrastructure to ensure efficient production performance.",
				priority: "medium",
			},
		],
	},
	{
		name: "market",
		tasks: [
			{
				title: "Marketing Strategy Development",
				desc: "Develop a targeted marketing strategy leveraging social media and content marketing.",
				priority: "medium",
			},
			{
				title: "Community Engagement",
				desc: "Engage with potential users and communities to build awareness and gather feedback.",
				priority: "medium",
			},
			{
				title: "Analytics Integration",
				desc: "Set up analytics tools to monitor user behavior and measure marketing effectiveness.",
				priority: "low",
			},
		],
	},
];

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { generationConfig, MODEL_TYPE } from "../lib/constant";


const TaskSchema = z.object({
	title: z.string(),
	desc: z.string(),
	priority: z.enum(["high", "medium", "low"]),
});

const PhaseSchema = z.object({
	name: z.string(),
	tasks: z.array(TaskSchema),
});

const PhasesOutputSchema = z.array(PhaseSchema);

const SYSTEM_INSTRUCTION_PHASES = `
Act as a project planning expert. Given a business idea and a list of project phases and project mvp, generate a detailed project plan for each phase provided by user(no additional). Each phase should have a "name" and a list of "tasks". Each task must include a "title", "desc" (description), and a "priority" (which can be "high", "medium", or "low") also NO extra other than provided names. Return the result as a valid JSON array matching the following format:

${JSON.stringify(phases)}
Do not include any additional text or explanation.
`;

export async function PhaseController(
	c: any,
	idea: string,
	phases: { name: string; desc: string }[],
	mvp: any
) {
	const { GEMINI_API } = c.env;
	const genAI = new GoogleGenerativeAI(GEMINI_API);

	const model = genAI.getGenerativeModel({
		model: MODEL_TYPE,
		systemInstruction: SYSTEM_INSTRUCTION_PHASES,
		generationConfig,
	});
	const listPhases = phases.map((item) => `${item.name}: ${item.desc}`);
	try {
		if (!idea || typeof idea !== "string") {
			throw new Error("Invalid input: Idea must be a non-empty string");
		}
		if (!Array.isArray(phases) || phases.length === 0) {
			throw new Error("Invalid input: phases must be a non-empty array");
		}

		const promptMessage = `Business Idea: ${idea}\n Project MVP: ${JSON.stringify(mvp)}\n Project Phases: ${JSON.stringify(phases)}`;

		const chat = model.startChat();
		const result = await chat.sendMessage(promptMessage);
		const response = result.response.text();

		const rawData = JSON.parse(response);
		const validated = PhasesOutputSchema.parse(rawData);
		console.dir(validated);
		console.log("Validated Plan:", validated);
		return validated;
	} catch (error) {
		console.error("Phase Generation Error:", error);
		throw new Error("Failed to generate project phases");
	}
}
