import { z } from "zod";

// === Zod Schemas ===


// const SocialListeningSchema = z.object({
// 	reddit: z.object({
// 		popular_threads: z.array(z.string()),
// 		common_complaints: z.array(z.string()),
// 	}),
// 	google_trends: z.object({
// 		interest_over_time: z.record(z.number()),
// 		related_queries: z.array(z.string()),
// 	}),
// });




// === Zod Schemas ===
export const ConsiderationSectionSchema = z.object({
    score: z.number().min(0).max(10),
    overview: z.string(),
    considerations: z.array(z.string()),
});

export const ProjectScoreSchema = z.object({
    feasibility: ConsiderationSectionSchema,
    marketfit: ConsiderationSectionSchema,
    uniqueness: ConsiderationSectionSchema,
    technical: ConsiderationSectionSchema,
});

export const ProjectTipsSchema = z.object({
    name: z.string(),
    description: z.string(),
});

export const ProjectIndicatorsSchema = z.object({
    name: z.string(),
    description: z.string(),
    type: z.enum(["success", "failure"]),
});

export const OverviewSchema = z.object({
    problem: z.string(),
    score: ProjectScoreSchema,
    suggestion: z.array(ProjectTipsSchema),
    missing: z.array(ProjectTipsSchema),
    indication: z.array(ProjectIndicatorsSchema),
});


export const SearchRequestSchema = z.object({
    value: z
        .string()
        .min(10, "Search value must be at least 10 characters")
        .max(1000, "Search value must not exceed 1000 characters"),
    project: z
        .string()
        .min(1, "Project is required")
        .max(100, "Project name too long"),
    model: z.string().min(1, "Model is required"),
    // .refine((val) => ["gpt-4", "gpt-3.5-turbo", "claude"].includes(val), {
    // 	message: "Invalid model specified",
    // }),
});

// Define interfaces for type safety
export interface SearchRequest {
    value: string;
    project: string;
    model: string;
}



// === Zod Schemas ===

//f
