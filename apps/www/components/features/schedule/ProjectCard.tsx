import React from "react";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "www/components/ui/card";
import { Badge } from "www/components/ui/badge";
import { Sparkles } from "lucide-react";

const ProjectCard = () => {
	return (
		<Card className="w-full max-w-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
			<CardHeader className="space-y-1">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Sparkles className="h-5 w-5 text-purple-500" />
						<h3 className="font-semibold text-xl">LogoAI</h3>
					</div>
					<Badge
						variant="secondary"
						className="bg-blue-100 text-blue-700 hover:bg-blue-200"
					>
						Tech
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-gray-600">
					An AI-powered platform that generates unique logo designs based on
					user input and preferences.
				</p>
				<div className="flex flex-wrap gap-2">
					{["AI", "logo design", "branding", "machine learning"].map((tag) => (
						<Badge
							key={tag}
							variant="outline"
							className="text-xs bg-gray-50 hover:bg-gray-100"
						>
							{tag}
						</Badge>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default ProjectCard;
