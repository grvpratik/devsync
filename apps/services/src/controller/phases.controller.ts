

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { generationConfig, MODEL_TYPE } from "../lib/constant";
import { PHASES_SYSTEM_INSTRUCTION_PHASES } from "../prompt/phase";


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
		systemInstruction: PHASES_SYSTEM_INSTRUCTION_PHASES,
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
