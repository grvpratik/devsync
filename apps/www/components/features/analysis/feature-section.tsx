import type React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "www/components/ui/card";
import { Badge } from "www/components/ui/badge";
import { Shield, Settings, Star } from "lucide-react";
import RefetchAnalysis from "./refetech-analysis";

interface Feature {
	id: string;
	name: string;
	description: string;
	priority: string;
	complexity: number;
	type: string;
}

interface FeatureListProps {
	id: string;
	mvp: Feature[] | null;
	features: Feature[] | null;
}

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
	const getTypeIcon = (type: string) => {
		switch (type) {
			case "must-have":
				return <Shield className="w-4 h-4 mr-2" />;
			case "should-have":
				return <Settings className="w-4 h-4 mr-2" />;
			case "nice-to-have":
				return <Star className="w-4 h-4 mr-2" />;
			default:
				return null;
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority.toLowerCase()) {
			case "high":
				return "bg-red-100 text-red-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "low":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<Card className="mb-4">
			<CardHeader>
				<CardTitle className="flex items-center">
					{getTypeIcon(feature.type)}
					{feature.name}
				</CardTitle>
				<CardDescription>{feature.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex justify-between items-center">
					<Badge className={getPriorityColor(feature.priority)}>
						{feature.priority}
					</Badge>
					<div className="flex items-center">
						<div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
							<div
								className="bg-blue-600 h-2.5 rounded-full"
								style={{ width: `${feature.complexity * 10}%` }}
							></div>
						</div>
						<span className="text-xs text-gray-500">
							{feature.complexity}/10
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

const FeatureList: React.FC<FeatureListProps> = ({id, mvp, features }) => {
	console.log(features)
	if(!mvp ||!features)return <RefetchAnalysis id={id} section="feature"/>
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">Feature List</h1>
			<div className="grid grid-cols-1 md:grid-cols-2  gap-6">
				<div>
					<h2 className="text-2xl font-semibold mb-4">MVP Features</h2>
					{mvp.map((feature) => (
						<FeatureCard key={feature.id} feature={feature} />
					))}
				</div>
				<div>
					<h2 className="text-2xl font-semibold mb-4">Additional Features</h2>
					{features.map((feature) => (
						<FeatureCard key={feature.id} feature={feature} />
					))}
				</div>
			</div>
		</div>
	);
};

export default FeatureList