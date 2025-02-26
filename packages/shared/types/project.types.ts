import z from "zod";
// ============================================================================
// Api Response
// ============================================================================
export interface ProjectReportResponse extends IdeaValidationResponse {
	id: string;
	phases?: Phases;
}
// ============================================================================
// Enums
// ============================================================================
export enum RefreshField {
	Market = "market",
	Feature = "feature",
	Overview = "overview",
}

// ============================================================================
// Base Types and Interfaces
// ============================================================================
export interface IdeaValidationResponse {
	prompt: string;
	timestamp: Date;
	metadata: MetaData;
	overview?: Overview;
	market?: Market;
	feature?: Feature;
	resource?: any;
}

export interface BusinessIdeaResult extends IdeaValidationResponse {
	id:string
}

// ============================================================================
// Task and Phase Schemas
// ============================================================================
export const TaskSchema = z.object({
	title: z.string(),
	desc: z.string(),
	priority: z.enum(["high", "medium", "low"]),
});

export const PhaseSchema = z.object({
	name: z.string(),
	tasks: z.array(TaskSchema),
});

export const PhasesOutputSchema = z.array(PhaseSchema);
export type Phases = z.infer<typeof PhasesOutputSchema>;

// ============================================================================
// Metadata Schema
// ============================================================================
export const MetadataSchema = z.object({
	name: z.string(),
	iamge: z.string().optional(),
	description: z.string(),
	category: z.string(),
	tags: z.array(z.string()),
});

export type MetaData = z.infer<typeof MetadataSchema>;

// ============================================================================
// Project Overview Related Schemas
// ============================================================================
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
	risks: z.array(z.string()),
	validation_status: z.enum(["strong", "promising", "weak"]),
});

export type Overview = z.infer<typeof OverviewSchema>;

// ============================================================================
// Market Related Schemas
// ============================================================================
export const AudienceBehaviorSchema = z.object({
	needs: z.array(z.string()),
	frustrations: z.array(z.string()),
	online_habits: z.array(z.string()),
	preferred_channels: z.array(z.string()),
});



export const AudienceSchema = z.object({
	psychographics: z.object({
		values: z.array(z.string()),
		interests: z.array(z.string()),
	}),
	behavior: AudienceBehaviorSchema,
});

export const CompetitorSchema = z.object({
	name: z.string(),
	description: z.string(),
	url: z.string().url(),
	key_features: z.array(z.string()),
	strengths: z.array(z.string()),
	weaknesses: z.array(z.string()),
	differentiator: z.string(),
	threat_level: z.enum(["low", "medium", "high"]),
});

export const MarketSchema = z.object({
	competitors: z.array(CompetitorSchema),
	audience: AudienceSchema,
	pain_points: z.array(z.string()),
	gaps: z.array(z.string()),
	opportunity_areas: z.array(z.string()),
	marketing_channels: z.array(z.string()),
});

export type Market = z.infer<typeof MarketSchema>;

export type Audience = z.infer<typeof AudienceSchema>;
export type Competitors = z.infer<typeof CompetitorSchema>;

// ============================================================================
// Feature Related Schemas
// ============================================================================
export const GithubProjectSchema = z.object({
	name: z.string(),
	description: z.string(),
	stars: z.number(),
	url: z.string(),
	langauage: z.string().optional(),
});

export const FeatureSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	priority: z.enum(["high", "low", "medium"]),
	complexity: z.number().min(1).max(10),
	type: z.enum(["must-have", "should-have", "nice-to-have"]),
	github: z.array(GithubProjectSchema).optional(),
});

export const FeaturesResponseSchema = z.object({
	mvp: z.array(FeatureSchema),
	features: z.array(FeatureSchema),
});

export type Feature = z.infer<typeof FeaturesResponseSchema>;
export type FeatureItem = z.infer<typeof FeatureSchema>;
export type GithubProject = z.infer<typeof GithubProjectSchema>;

