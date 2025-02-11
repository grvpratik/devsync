import z from "zod";
export interface MetaData {
	name: string;
	image: string;
	description: string;
}

export interface IdeaValidationResponse {
	id: string;
	prompt:string;
	timestamp: Date;
	metadata: MetaData;
	overview?: any;
	market?: Market;
	feature?: any;
}

export interface BusinessIdeaResult extends IdeaValidationResponse {}
export const CompetitorSchema = z.object({
	name: z.string(),
	description: z.string(),
	url: z.string().url(),
	image: z.string().url().optional(),
	key_features: z.array(z.string()),
	missing_features: z.array(z.string()),
	strengths: z.array(z.string()),
	weaknesses: z.array(z.string()),
	sentiment: z.enum(["positive", "neutral", "negative"]),
});

export const AudienceDemographicsSchema = z.object({
	age_range: z.tuple([z.number(), z.number()]),
	gender_ratio: z.object({
		male: z.number(),
		female: z.number(),
		other: z.number(),
	}),
	locations: z.array(z.string()),
	income_levels: z.array(z.string()),
});

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

export const AudienceSchema = z.object({
	demographics: AudienceDemographicsSchema,
	psychographics: z.object({
		values: z.array(z.string()),
		interests: z.array(z.string()),
	}),
	behavior: AudienceBehaviorSchema,
});
export const MarketSchema = z.object({
	competitors: z.array(CompetitorSchema),
	audience: AudienceSchema,
	pain_points: z.array(z.string()),
	gaps: z.array(z.string()),
	trends: MarketTrendsSchema,
	// social_listening: SocialListeningSchema,
});
export const FeatureSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	priority: z.string(),
	complexity: z.number().min(1).max(10),
	type: z.enum(["must-have", "should-have", "nice-to-have"]),
});
export const FeaturesResponseSchema = z.object({
	mvp: z.array(FeatureSchema),
	features: z.array(FeatureSchema),
});

export type Competitors = z.infer<typeof CompetitorSchema>;
export type Audience = z.infer<typeof AudienceSchema>;
export type Market = z.infer<typeof MarketSchema>;
export type MarketTrends=z.infer<typeof MarketTrendsSchema>
