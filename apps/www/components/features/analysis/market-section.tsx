import React from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
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
	ArrowRight,
	Sparkles,
	BrainCircuit,
} from "lucide-react";
import { Separator } from "www/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "www/components/ui/tabs";

// Type definitions
interface Competitors {
	name: string;
	description: string;
	key_features: string[];
	strengths: string[];
	weaknesses: string[];
	
}

interface Psychographics {
	interests: string[];
	values?: string[];
	attitudes?: string[];
	pain_points?: string[];
}

interface Demographics {
	age_range?: string;
	gender?: string;
	income?: string;
	education?: string;
	location?: string[];
}

interface Audience {
	psychographics: Psychographics;
	demographics?: Demographics;
	behavior_patterns?: string[];
}

interface MarketTrends {
	market_size: string;
	growth_rate: string;
	emerging_technologies: string[];
	customer_trends?: string[];
}

interface Market {
	competitors: Competitors[];
	audience: Audience;
	trends?: MarketTrends;
	pain_points: string[];
	gaps: string[];
	opportunities?: string[];
}

interface MarketAnalysisProps {
	marketData?: Market;
	id: string;
}

// CompetitorCard Component
const CompetitorCard: React.FC<{ competitor: Competitors }> = ({
	competitor,
}) => {
	

	
	return (
		<Card className="h-full transition-all hover:shadow-md">
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl">{competitor.name}</CardTitle>
						<CardDescription>{competitor.description}</CardDescription>
					</div>
					
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<h3 className="font-medium mb-2 text-sm text-muted-foreground">
						KEY FEATURES
					</h3>
					<div className="flex flex-wrap gap-2">
						{competitor.key_features.map((feature, idx) => (
							<Badge key={idx} variant="secondary">
								{feature}
							</Badge>
						))}
					</div>
				</div>
				<Separator />
				<div className="grid grid-cols-2 gap-4">
					<div>
						<h3 className="font-medium mb-2 text-sm text-muted-foreground">
							STRENGTHS
						</h3>
						<div className="space-y-2">
							{competitor.strengths.map((strength, idx) => (
								<div key={idx} className="flex items-start gap-2 text-sm">
									<Check
										className="text-green-500 mt-0.5 flex-shrink-0"
										size={16}
									/>
									<span>{strength}</span>
								</div>
							))}
						</div>
					</div>
					<div>
						<h3 className="font-medium mb-2 text-sm text-muted-foreground">
							WEAKNESSES
						</h3>
						<div className="space-y-2">
							{competitor.weaknesses.map((weakness, idx) => (
								<div key={idx} className="flex items-start gap-2 text-sm">
									<X className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
									<span>{weakness}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

// AudienceInsights Component
const AudienceInsights: React.FC<{ audience: Audience }> = ({ audience }) => {
	return (
		<Card className="h-full">
			<CardHeader>
				<div className="flex items-center gap-2">
					<div className="rounded-full bg-blue-100 p-2">
						<Users className="text-blue-500" size={20} />
					</div>
					<CardTitle>Target Audience</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="space-y-5">
				{audience.demographics && (
					<div>
						<h3 className="font-medium mb-3 text-sm text-muted-foreground">
							DEMOGRAPHICS
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							{audience.demographics.age_range && (
								<div className="flex items-center gap-2">
									<Badge variant="outline">Age</Badge>
									<span className="text-sm">
										{audience.demographics.age_range}
									</span>
								</div>
							)}
							{audience.demographics.gender && (
								<div className="flex items-center gap-2">
									<Badge variant="outline">Gender</Badge>
									<span className="text-sm">
										{audience.demographics.gender}
									</span>
								</div>
							)}
							{audience.demographics.income && (
								<div className="flex items-center gap-2">
									<Badge variant="outline">Income</Badge>
									<span className="text-sm">
										{audience.demographics.income}
									</span>
								</div>
							)}
						</div>
					</div>
				)}

				<div>
					<h3 className="font-medium mb-3 text-sm text-muted-foreground">
						INTERESTS & VALUES
					</h3>
					<div className="flex flex-wrap gap-2">
						{audience.psychographics.interests.map((interest, idx) => (
							<Badge key={idx} variant="secondary">
								{interest}
							</Badge>
						))}
						{audience.psychographics.values?.map((value, idx) => (
							<Badge key={idx} variant="outline" className="border-blue-200">
								{value}
							</Badge>
						))}
					</div>
				</div>

				{audience.behavior_patterns && (
					<div>
						<h3 className="font-medium mb-3 text-sm text-muted-foreground">
							BEHAVIORS
						</h3>
						<div className="space-y-2">
							{audience.behavior_patterns.map((behavior, idx) => (
								<div key={idx} className="flex items-start gap-2 text-sm">
									<ArrowRight
										className="text-blue-500 mt-0.5 flex-shrink-0"
										size={16}
									/>
									<span>{behavior}</span>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

// MarketTrendsCard Component
const MarketTrendsCard: React.FC<{ trends?: MarketTrends }> = ({ trends }) => {
	if (!trends) return null;

	return (
		<Card className="h-full">
			<CardHeader>
				<div className="flex items-center gap-2">
					<div className="rounded-full bg-green-100 p-2">
						<TrendingUp className="text-green-500" size={20} />
					</div>
					<CardTitle>Market Trends</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-2 gap-6">
					<div className="bg-muted p-4 rounded-lg">
						<h3 className="font-medium text-sm text-muted-foreground mb-1">
							MARKET SIZE
						</h3>
						<p className="text-2xl font-bold text-primary">
							{trends.market_size}
						</p>
					</div>
					<div className="bg-muted p-4 rounded-lg">
						<h3 className="font-medium text-sm text-muted-foreground mb-1">
							GROWTH RATE
						</h3>
						<p className="text-2xl font-bold text-green-500">
							{trends.growth_rate}
						</p>
					</div>
				</div>

				<div>
					<h3 className="font-medium mb-3 text-sm text-muted-foreground">
						EMERGING TECHNOLOGIES
					</h3>
					<div className="flex flex-wrap gap-2">
						{trends.emerging_technologies.map((tech, idx) => (
							<Badge
								key={idx}
								variant="secondary"
								className="bg-green-100 hover:bg-green-200 text-green-800"
							>
								<BrainCircuit className="mr-1" size={14} />
								{tech}
							</Badge>
						))}
					</div>
				</div>

				{trends.customer_trends && (
					<div>
						<h3 className="font-medium mb-3 text-sm text-muted-foreground">
							CUSTOMER TRENDS
						</h3>
						<div className="space-y-2">
							{trends.customer_trends.map((trend, idx) => (
								<div key={idx} className="flex items-start gap-2 text-sm">
									<TrendingUp
										className="text-blue-500 mt-0.5 flex-shrink-0"
										size={16}
									/>
									<span>{trend}</span>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

// OpportunitiesCard Component
const OpportunitiesCard: React.FC<{
	painPoints: string[];
	gaps: string[];
	opportunities?: string[];
}> = ({ painPoints, gaps, opportunities }) => {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<div className="rounded-full  p-2">
						<Target className="text-blue-500" size={20} />
					</div>
					<CardTitle>Market Opportunities</CardTitle>
				</div>
			</CardHeader>

			<CardContent>
				<Tabs defaultValue="pain-points">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="pain-points">Pain Points</TabsTrigger>
						<TabsTrigger value="gaps">Market Gaps</TabsTrigger>
						<TabsTrigger value="opportunities" disabled={!opportunities}>
							Opportunities
						</TabsTrigger>
					</TabsList>

					<TabsContent value="pain-points" className="mt-4 space-y-4">
						{painPoints.map((point, idx) => (
							<div
								key={idx}
								className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
							>
								<X className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
								<div>
									<span className="text-sm">{point}</span>
								</div>
							</div>
						))}
					</TabsContent>

					<TabsContent value="gaps" className="mt-4 space-y-4">
						{gaps.map((gap, idx) => (
							<div
								key={idx}
								className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg"
							>
								<Target
									className="text-blue-500 mt-0.5 flex-shrink-0"
									size={18}
								/>
								<div>
									<span className="text-sm">{gap}</span>
								</div>
							</div>
						))}
					</TabsContent>

					{opportunities && (
						<TabsContent value="opportunities" className="mt-4 space-y-4">
							{opportunities.map((opportunity, idx) => (
								<div
									key={idx}
									className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
								>
									<Sparkles
										className="text-amber-500 mt-0.5 flex-shrink-0"
										size={18}
									/>
									<div>
										<span className="text-sm">{opportunity}</span>
									</div>
								</div>
							))}
						</TabsContent>
					)}
				</Tabs>
			</CardContent>
		</Card>
	);
};

// Main MarketAnalysis Component
const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ marketData, id }) => {
	console.log(marketData)
	if (!marketData) {
		return (
			<Card className="p-6">
				<CardContent className="flex items-center justify-center h-64">
					<p className="text-muted-foreground">
						Market data not available. Please try again.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center gap-4">
						<div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
							<Building2 className="text-blue-500" size={24} />
						</div>
						<div>
							<h1 className="text-2xl font-bold">Market Analysis</h1>
							<p className="text-muted-foreground">
								Competitive landscape and market insights
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Competitors Section */}
			<div className="space-y-3">
				<h2 className="text-xl font-semibold ml-1">Competitors</h2>
				<div className="grid md:grid-cols-2 gap-6">
					{marketData.competitors.map((competitor, index) => (
						<CompetitorCard key={index} competitor={competitor} />
					))}
				</div>
			</div>

			{/* Audience and Market Trends */}
			<div className="grid md:grid-cols-2 gap-6">
				<AudienceInsights audience={marketData.audience} />
				<MarketTrendsCard trends={marketData.trends} />
			</div>

			{/* Opportunities Section */}
			<OpportunitiesCard
				painPoints={marketData.pain_points}
				gaps={marketData.gaps}
				opportunities={marketData.opportunities}
			/>
		</div>
	);
};

export default MarketAnalysis;
