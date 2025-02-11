import React from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "www/components/ui/card";
import { Badge } from "www/components/ui/badge";
import {
	Building2,
	Users,
	TrendingUp,
	Check,
	X,
	Target,
	ThumbsUp,
	ThumbsDown,
	Globe,
	DollarSign,
} from "lucide-react";
import {
	Market,
	Competitors,
	MarketTrends,
	Audience,
} from "shared/types/api.types";
interface MarketAnalysisProps {
	marketData?: Market;
}
const CompetitorCard = ({ competitor }: { competitor: Competitors }) => (
	<Card className="h-full">
		<CardHeader>
			<div className="flex items-center justify-between">
				<div>
					<CardTitle className="text-xl">{competitor.name}</CardTitle>
					<CardDescription>{competitor.description}</CardDescription>
				</div>
				{competitor.sentiment === "positive" ?
					<ThumbsUp className="text-green-500" size={20} />
				:	<ThumbsDown className="text-red-500" size={20} />}
			</div>
		</CardHeader>
		<CardContent className="space-y-4">
			<div>
				<h3 className="font-medium mb-2">Key Features</h3>
				<div className="flex flex-wrap gap-2">
					{competitor.key_features.map((feature, idx) => (
						<Badge key={idx} variant="secondary">
							{feature}
						</Badge>
					))}
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<h3 className="font-medium mb-2">Strengths</h3>
					<div className="space-y-1">
						{competitor.strengths.map((strength, idx) => (
							<div key={idx} className="flex items-center gap-2 text-sm">
								<Check className="text-green-500" size={16} />
								<span>{strength}</span>
							</div>
						))}
					</div>
				</div>
				<div>
					<h3 className="font-medium mb-2">Weaknesses</h3>
					<div className="space-y-1">
						{competitor.weaknesses.map((weakness, idx) => (
							<div key={idx} className="flex items-center gap-2 text-sm">
								<X className="text-red-500" size={16} />
								<span>{weakness}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
);

const AudienceInsights = ({ audience }: { audience: Audience }) => (
	<Card className="h-full">
		<CardHeader>
			<div className="flex items-center gap-2">
				<Users className="text-blue-500" size={24} />
				<CardTitle>Target Audience</CardTitle>
			</div>
		</CardHeader>
		<CardContent className="space-y-4">
			<div className="grid md:grid-cols-2 gap-4">
				<div>
					<h3 className="font-medium mb-2">Demographics</h3>
					<div className="space-y-2 text-sm">
						<div className="flex items-center gap-2">
							<Globe size={16} />
							<span>{audience.demographics.locations}</span>
						</div>
						<div className="flex items-center gap-2">
							<DollarSign size={16} />
							<span>{audience.demographics.income_levels}</span>
						</div>
					</div>
				</div>
				<div>
					<h3 className="font-medium mb-2">Interests</h3>
					<div className="flex flex-wrap gap-2">
						{audience.psychographics.interests.map((interest, idx) => (
							<Badge key={idx} variant="outline">
								{interest}
							</Badge>
						))}
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
);

const MarketTrendsCard = ({ trends }: { trends: MarketTrends }) => (
	<Card className="h-full">
		<CardHeader>
			<div className="flex items-center gap-2">
				<TrendingUp className="text-green-500" size={24} />
				<CardTitle>Market Trends</CardTitle>
			</div>
		</CardHeader>
		<CardContent className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div>
					<h3 className="font-medium">Market Size</h3>
					<p className="text-2xl font-bold text-blue-500">
						{trends.market_size}
					</p>
				</div>
				<div>
					<h3 className="font-medium">Growth Rate</h3>
					<p className="text-2xl font-bold text-green-500">
						{trends.growth_rate}
					</p>
				</div>
			</div>
			<div>
				<h3 className="font-medium mb-2">Emerging Technologies</h3>
				<div className="flex flex-wrap gap-2">
					{trends.emerging_technologies.map((tech, idx) => (
						<Badge key={idx} variant="secondary">
							{tech}
						</Badge>
					))}
				</div>
			</div>
		</CardContent>
	</Card>
);

const MarketAnalysis = ({ marketData }: MarketAnalysisProps) => {
	if (!marketData) return null;

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center gap-4 mb-6">
				<Building2 className="text-blue-500" size={32} />
				<div>
					<h1 className="text-2xl font-bold">Market Analysis</h1>
					<p className="text-muted-foreground">
						Competitive landscape and market insights
					</p>
				</div>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				{marketData.competitors.map((competitor, index) => (
					<CompetitorCard key={index} competitor={competitor} />
				))}
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				<AudienceInsights audience={marketData.audience} />
				<MarketTrendsCard trends={marketData.trends} />
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<Target className="text-blue-500" size={24} />
						<CardTitle>Market Opportunities</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h3 className="font-medium mb-2">Pain Points</h3>
							<div className="space-y-2">
								{marketData.pain_points.map((point, idx) => (
									<div key={idx} className="flex items-center gap-2 text-sm">
										<X className="text-red-500" size={16} />
										<span>{point}</span>
									</div>
								))}
							</div>
						</div>
						<div>
							<h3 className="font-medium mb-2">Market Gaps</h3>
							<div className="space-y-2">
								{marketData.gaps.map((gap, idx) => (
									<div key={idx} className="flex items-center gap-2 text-sm">
										<Target className="text-blue-500" size={16} />
										<span>{gap}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default MarketAnalysis;
