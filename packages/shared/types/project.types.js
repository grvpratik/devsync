"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturesResponseSchema = exports.FeatureSchema = exports.GithubProjectSchema = exports.MarketSchema = exports.CompetitorSchema = exports.AudienceSchema = exports.AudienceBehaviorSchema = exports.OverviewSchema = exports.ProjectIndicatorsSchema = exports.ProjectTipsSchema = exports.ProjectScoreSchema = exports.ConsiderationSectionSchema = exports.MetadataSchema = exports.PhasesOutputSchema = exports.PhaseSchema = exports.TaskSchema = exports.RefreshField = void 0;
const zod_1 = __importDefault(require("zod"));
// ============================================================================
// Enums
// ============================================================================
var RefreshField;
(function (RefreshField) {
    RefreshField["Market"] = "market";
    RefreshField["Feature"] = "feature";
    RefreshField["Overview"] = "overview";
})(RefreshField || (exports.RefreshField = RefreshField = {}));
// ============================================================================
// Task and Phase Schemas
// ============================================================================
exports.TaskSchema = zod_1.default.object({
    name: zod_1.default.string(),
    desc: zod_1.default.string(),
    priority: zod_1.default.enum(["high", "medium", "low"]),
});
exports.PhaseSchema = zod_1.default.object({
    name: zod_1.default.string(),
    tasks: zod_1.default.array(exports.TaskSchema),
});
exports.PhasesOutputSchema = zod_1.default.array(exports.PhaseSchema);
// ============================================================================
// Metadata Schema
// ============================================================================
exports.MetadataSchema = zod_1.default.object({
    name: zod_1.default.string(),
    iamge: zod_1.default.string().optional(),
    description: zod_1.default.string(),
    category: zod_1.default.string(),
    tags: zod_1.default.array(zod_1.default.string()),
});
// ============================================================================
// Project Overview Related Schemas
// ============================================================================
exports.ConsiderationSectionSchema = zod_1.default.object({
    score: zod_1.default.number().min(0).max(10),
    overview: zod_1.default.string(),
    considerations: zod_1.default.array(zod_1.default.string()),
});
exports.ProjectScoreSchema = zod_1.default.object({
    feasibility: exports.ConsiderationSectionSchema,
    marketfit: exports.ConsiderationSectionSchema,
    uniqueness: exports.ConsiderationSectionSchema,
    technical: exports.ConsiderationSectionSchema,
});
exports.ProjectTipsSchema = zod_1.default.object({
    name: zod_1.default.string(),
    description: zod_1.default.string(),
});
exports.ProjectIndicatorsSchema = zod_1.default.object({
    name: zod_1.default.string(),
    description: zod_1.default.string(),
    type: zod_1.default.enum(["success", "failure"]),
});
exports.OverviewSchema = zod_1.default.object({
    problem: zod_1.default.string(),
    score: exports.ProjectScoreSchema,
    suggestion: zod_1.default.array(exports.ProjectTipsSchema),
    missing: zod_1.default.array(exports.ProjectTipsSchema),
    indication: zod_1.default.array(exports.ProjectIndicatorsSchema),
    risks: zod_1.default.array(zod_1.default.string()),
    validation_status: zod_1.default.enum(["strong", "promising", "weak"]),
});
// ============================================================================
// Market Related Schemas
// ============================================================================
exports.AudienceBehaviorSchema = zod_1.default.object({
    needs: zod_1.default.array(zod_1.default.string()),
    frustrations: zod_1.default.array(zod_1.default.string()),
    online_habits: zod_1.default.array(zod_1.default.string()),
    preferred_channels: zod_1.default.array(zod_1.default.string()),
});
exports.AudienceSchema = zod_1.default.object({
    psychographics: zod_1.default.object({
        values: zod_1.default.array(zod_1.default.string()),
        interests: zod_1.default.array(zod_1.default.string()),
    }),
    behavior: exports.AudienceBehaviorSchema,
});
exports.CompetitorSchema = zod_1.default.object({
    name: zod_1.default.string(),
    description: zod_1.default.string(),
    url: zod_1.default.string().url(),
    key_features: zod_1.default.array(zod_1.default.string()),
    strengths: zod_1.default.array(zod_1.default.string()),
    weaknesses: zod_1.default.array(zod_1.default.string()),
    differentiator: zod_1.default.string(),
    threat_level: zod_1.default.enum(["low", "medium", "high"]),
});
exports.MarketSchema = zod_1.default.object({
    competitors: zod_1.default.array(exports.CompetitorSchema),
    audience: exports.AudienceSchema,
    pain_points: zod_1.default.array(zod_1.default.string()),
    gaps: zod_1.default.array(zod_1.default.string()),
    opportunity_areas: zod_1.default.array(zod_1.default.string()),
    marketing_channels: zod_1.default.array(zod_1.default.string()),
});
// ============================================================================
// Feature Related Schemas
// ============================================================================
exports.GithubProjectSchema = zod_1.default.object({
    name: zod_1.default.string(),
    description: zod_1.default.string(),
    stars: zod_1.default.number(),
    url: zod_1.default.string(),
    langauage: zod_1.default.string().optional(),
});
exports.FeatureSchema = zod_1.default.object({
    id: zod_1.default.string(),
    name: zod_1.default.string(),
    description: zod_1.default.string(),
    priority: zod_1.default.enum(["high", "low", "medium"]),
    complexity: zod_1.default.number().min(1).max(10),
    type: zod_1.default.enum(["must-have", "should-have", "nice-to-have"]),
    github: zod_1.default.array(exports.GithubProjectSchema).optional(),
});
exports.FeaturesResponseSchema = zod_1.default.object({
    mvp: zod_1.default.array(exports.FeatureSchema),
    features: zod_1.default.array(exports.FeatureSchema),
});
