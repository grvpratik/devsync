import {
	AlertTriangle,
	ArrowDown,
	ArrowUp,
	Clock,
	Code,
	Target,
	Zap,
} from "lucide-react";
import React from "react";
import ScoreIndicator from "www/components/ScoreIndicator";
import { Badge } from "www/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "www/components/ui/card";
import RefetchAnalysis from "./refetech-analysis";

// Type definitions
interface MetaData {
	name: string;
	description: string;
	category: string;
	tags: string[];
}

interface ScoreDetail {
	score: number;
	overview: string;
	considerations: string[];
}

interface ScoreData {
	feasibility: ScoreDetail;
	marketfit: ScoreDetail;
	uniqueness: ScoreDetail;
	technical: ScoreDetail;
}

interface Feature {
	name: string;
	description: string;
}

interface Indicator {
	name: string;
	description: string;
	type: "success" | "failure";
}

interface Overview {
	problem: string;
	score: ScoreData;
	suggestion: Feature[];
	missing: Feature[];
	indication: Indicator[];
	risks: string[];
	validation_status: string;
}

interface OverviewAnalysisProps {
	metadata: MetaData;
	overview: Overview;
	id: string;
}

// Score Card Component
const ScoreCard: React.FC<{
	title: string;
	icon: React.ElementType;
	score: number;
	overview: string;
	considerations: string[];
}> = ({ title, icon: Icon, score, overview, considerations }) => (
	<Card className="h-full">
		<CardHeader className="pb-2">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Icon className="h-5 w-5 text-primary" />
					<CardTitle className="text-lg font-semibold">{title}</CardTitle>
				</div>
				<div className="flex items-center gap-1">
					<span className="text-2xl font-bold">{score}</span>
					<span className="text-sm text-muted-foreground">/10</span>
				</div>
			</div>
		</CardHeader>
		<CardContent>
			<p className="text-sm text-muted-foreground mb-3">{overview}</p>
			<div className="space-y-2">
				{considerations.map((item, index) => (
					<div key={index} className="flex items-center gap-2 text-sm">
						<div className="w-1.5 h-1.5 rounded-full bg-primary" />
						<span>{item}</span>
					</div>
				))}
			</div>
		</CardContent>
	</Card>
);

// Feature Section Component
const FeatureSection: React.FC<{
	title: string;
	description?: string;
	items: Feature[];
}> = ({ title, description, items }) => (
	<Card className="h-full">
		<CardHeader>
			<CardTitle className="text-lg">{title}</CardTitle>
			{description && <CardDescription>{description}</CardDescription>}
		</CardHeader>
		<CardContent>
			<div className="space-y-4">
				{items.map((item, index) => (
					<div key={index} className="space-y-1">
						<h3 className="font-medium">{item.name}</h3>
						<p className="text-sm text-muted-foreground">{item.description}</p>
					</div>
				))}
			</div>
		</CardContent>
	</Card>
);

// Indicator Card Component
const IndicatorCard: React.FC<{
	indicators: Indicator[];
}> = ({ indicators }) => (
	<Card className="h-full">
		<CardHeader>
			<CardTitle className="text-lg">Success Indicators</CardTitle>
			<CardDescription>Key metrics for measuring success</CardDescription>
		</CardHeader>
		<CardContent>
			<div className="space-y-4">
				{indicators.map((indicator, index) => (
					<div key={index} className="flex items-start gap-3">
						{indicator.type === "success" ?
							<ArrowUp className="text-green-500 mt-1" size={16} />
						:	<ArrowDown className="text-red-500 mt-1" size={16} />}
						<div>
							<h4 className="font-medium">{indicator.name}</h4>
							<p className="text-sm text-muted-foreground">
								{indicator.description}
							</p>
						</div>
					</div>
				))}
			</div>
		</CardContent>
	</Card>
);

// Risks Card Component
const RisksCard: React.FC<{
	risks: string[];
}> = ({ risks }) => (
	<Card className="h-full">
		<CardHeader>
			<CardTitle className="text-lg">Potential Risks</CardTitle>
			<CardDescription>Issues to be aware of</CardDescription>
		</CardHeader>
		<CardContent>
			<div className="space-y-3">
				{risks.map((risk, index) => (
					<div key={index} className="flex items-start gap-3">
						<AlertTriangle className="text-amber-500 mt-1" size={16} />
						<p className="text-sm">{risk}</p>
					</div>
				))}
			</div>
		</CardContent>
	</Card>
);

// Main Component
const OverviewAnalysis: React.FC<OverviewAnalysisProps> = ({
	metadata,
	overview,
	id,
}) => {
	if (!metadata || !overview) {
		return (
			<Card className="p-6">
				<CardContent className="flex items-center justify-center h-64">
					<p className="text-muted-foreground">
						<RefetchAnalysis section="overview" id={id!}/>
					</p>
				</CardContent>
			</Card>
		);
	}

	const scoreCategories = [
		{ icon: Target, key: "feasibility" as const, title: "Feasibility" },
		{ icon: Zap, key: "marketfit" as const, title: "Market Fit" },
		{ icon: Code, key: "technical" as const, title: "Technical" },
		{ icon: Clock, key: "uniqueness" as const, title: "Uniqueness" },
	];

	const averageScore = Math.round(
		Object.values(overview.score).reduce((acc, curr) => acc + curr.score, 0) /
			Object.keys(overview.score).length
	);

	return (
		<div className="w-full space-y-6">
			{/* Header Section */}
			<Card>
				<CardContent className="p-6">
					<div className="flex items-start gap-6">
						<div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
							<span className="text-2xl font-bold text-white">
								{metadata.name.charAt(0).toUpperCase()}
							</span>
						</div>
						<div className="space-y-2 flex-1">
							<div className="flex items-start justify-between">
								<div>
									<h1 className="text-2xl font-bold">{metadata.name}</h1>
									<p className="text-muted-foreground">
										{metadata.description}
									</p>
								</div>
								<Badge variant="outline" className="text-sm">
									{metadata.category.toUpperCase()}
								</Badge>
							</div>
							<div className="flex flex-wrap gap-2 mt-2">
								{metadata.tags.map((tag) => (
									<Badge key={tag} variant="secondary">
										{tag}
									</Badge>
								))}
								<Badge variant="default" className="ml-auto">
									Score: {averageScore}/10
								</Badge>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Problem Statement & Overall Score */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Problem Statement</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">{overview.problem}</p>
					</CardContent>
					<CardFooter>
						<Badge
							variant={
								overview.validation_status === "promising" ?
									"secondary"
								:	"outline"
							}
							className="capitalize"
						>
							{overview.validation_status}
						</Badge>
					</CardFooter>
				</Card>

				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>Project Score</CardTitle>
					</CardHeader>
					<CardContent>
						<ScoreIndicator score={averageScore * 10} />
					</CardContent>
				</Card>
			</div>

			{/* Scores Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{scoreCategories.map(({ key, title, icon }) => (
					<ScoreCard
						key={key}
						title={title}
						icon={icon}
						score={overview.score[key].score}
						overview={overview.score[key].overview}
						considerations={overview.score[key].considerations}
					/>
				))}
			</div>

			{/* Features and Risks */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<FeatureSection
					title="Suggested Features"
					description="Recommended functionality"
					items={overview.suggestion}
				/>
				<FeatureSection
					title="Missing Components"
					description="Features to consider adding"
					items={overview.missing}
				/>
			</div>

			{/* Indicators and Risks */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<IndicatorCard indicators={overview.indication} />
				<RisksCard risks={overview.risks} />
			</div>
		</div>
	);
};

export default OverviewAnalysis;
