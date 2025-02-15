import z from "zod";

	export enum RefreshField {
		Market = "market",
		Feature = "feature",
	}

export interface IdeaValidationResponse {
	
	prompt: string;
	timestamp: Date;
	metadata: MetaData;
	overview?: Overview;
	market?: Market;
	feature?: Feature;
	resource?: any;
}
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

export const MetadataSchema = z.object({
	name: z.string(),
	iamge: z.string().optional(),
	description: z.string(),
	category: z.string(),
	tags: z.array(z.string()),
});
export type MetaData = z.infer<typeof MetadataSchema>;

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

export interface BusinessIdeaResult extends IdeaValidationResponse {}


export const AudienceBehaviorSchema = z.object({
	needs: z.array(z.string()),
	frustrations: z.array(z.string()),
	online_habits: z.array(z.string()),
	preferred_channels: z.array(z.string()),
});

export const MarketTrendsSchema = z.object({
	market_size: z.string(),
	growth_rate: z.string(),
	emerging_technologies: z.array(z.string()),
	regulatory_factors: z.array(z.string()),
});












//market

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
	// image: z.string().url().optional(),
	key_features: z.array(z.string()),
	strengths: z.array(z.string()),
	weaknesses: z.array(z.string()),
	differentiator: z.string(), // What makes your idea different
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










export const FeatureSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	priority: z.enum(["high", "low", "medium"]),
	complexity: z.number().min(1).max(10),
	type: z.enum(["must-have", "should-have", "nice-to-have"]),
});
export const FeaturesResponseSchema = z.object({
	mvp: z.array(FeatureSchema),
	features: z.array(FeatureSchema),
});
export type Feature = z.infer<typeof FeaturesResponseSchema>;
export type Competitors = z.infer<typeof CompetitorSchema>;
export type Audience = z.infer<typeof AudienceSchema>;
export type Market = z.infer<typeof MarketSchema>;
export type MarketTrends = z.infer<typeof MarketTrendsSchema>;
export type Overview = z.infer<typeof OverviewSchema>;
export type FeatureItem=z.infer<typeof FeatureSchema>
