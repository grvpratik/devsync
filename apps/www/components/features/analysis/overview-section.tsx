import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "www/components/ui/card";
import { Badge } from "www/components/ui/badge";
import { ArrowUp, ArrowDown, Clock, Target, Zap, Code } from "lucide-react";
import ScoreIndicator from "www/components/ScoreIndicator";
import { Overview } from "shared";
const ScoreCard = ({ title, score, overview, considerations }) => (
	<Card className="h-full">
		<CardHeader className="pb-2">
			<div className="flex items-center justify-between">
				<CardTitle className="text-lg font-semibold">{title}</CardTitle>
				<div className="flex items-center gap-2">
					<span className="text-2xl font-bold">{score}</span>
					<span className="text-sm text-muted-foreground">/10</span>
				</div>
			</div>
		</CardHeader>
		<CardContent>
			<p className="text-sm text-muted-foreground mb-2">{overview}</p>
			<div className="space-y-1">
				{considerations.map((item, index) => (
					<div key={index} className="flex items-center gap-2 text-sm">
						<div className="w-1 h-1 rounded-full bg-blue-500" />
						<span>{item}</span>
					</div>
				))}
			</div>
		</CardContent>
	</Card>
);

const FeatureSection = ({ title, items }) => (
	<Card className="h-full">
		<CardHeader>
			<CardTitle className="text-lg">{title}</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="space-y-3">
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

const IndicatorCard = ({ indicators }) => (
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

interface Score {
	score: number;
	overview: string;
	considerations: string[];
}

const OverviewAnalysis = ({
	metadata,
	overview,
}: {
	metadata: any;
	overview: Overview;
}) => {
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
	if (!metadata || !overview) return <div>failed to generate</div>;
	return (
		<div className="w-full space-y-6 p-6">
			{/* Header Section */}
			<div className="flex items-start gap-6">
				<div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
					<span className="text-2xl font-bold text-white">
						{metadata.name.charAt(0).toUpperCase()}
					</span>
				</div>
				<div className="space-y-1">
					<h1 className="text-2xl font-bold">{metadata.name}</h1>
					<p className="text-muted-foreground">{metadata.description}</p>
					<div className="flex gap-2 mt-2">
						<Badge variant="secondary">Score: {averageScore}/10</Badge>
					</div>
				</div>
				{/* <ScoreIndicator score={87}/> */}
			</div>

			{/* Problem Statement */}
			<Card>
				<CardHeader>
					<CardTitle>Problem Statement</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">{overview.problem}</p>
				</CardContent>
			</Card>

			{/* Scores Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{scoreCategories.map(({ key, title }) => (
					<ScoreCard key={key} title={title} {...overview.score[key]} />
				))}
			</div>

			{/* Features and Suggestions */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<FeatureSection
					title="Suggested Features"
					items={overview.suggestion}
				/>
				<FeatureSection title="Missing Components" items={overview.missing} />
			</div>

			{/* Indicators */}
			<IndicatorCard indicators={overview.indication} />
		</div>
	);
};

export default OverviewAnalysis;

// import React from "react";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardFooter,
// 	CardHeader,
// 	CardTitle,
// } from "www/components/ui/card";
// import ScoreIndicator from "../../ScoreIndicator";

// const OverviewAnalysis: React.FC<{ metadata: any; data: any }> = ({
// 	metadata,
// 	data,
// }) => {
// 	if (!data) {
// 		return <main>error extracting data</main>;
// 	}
// 	// const chart = Object.keys(data).map((key) => {
// 	//     const typedKey = key as keyof OverviewAnalysisProps;
// 	//     return {
// 	//         aspect: key,
// 	//         score: data[typedKey].score,
// 	//     };
// 	// });
// 	console.log(data, "overvuew");
// 	console.log(metadata);
// 	return (
// 		<main className="flex flex-col w-full  h-full ">
// 			{/* <div className="w-full bg-gray-200 h-full grid grid-cols-1">
//                 <div className="grid grid-cols-3">
//                     <div className=" col-span-2">overview</div>
//                     <div className=" col-span-1">rating</div>
//                 </div>
//                 <div className="grid grid-cols-3">
//                     <div className=" col-span-1">mvp</div>
//                     <div className=" col-span-1">competetiors</div>
//                     <div className=" col-span-1">rating</div>

//                 </div>
//             </div> */}
// 			<div className="  h-full  grid gap-2 lg:grid-cols-3 lg:grid-rows-2 grid-rows- grid-cols-1">
// 				<div className="flex flex-col gap-1 p-4">
// 					<div className="size-12 bg-blue-500 rounded-lg"></div>
// 					<h1 className=" font-bold text-lg">{metadata.name}</h1>
// 					<span className="  font-semibold text-sm ">Overview</span>
// 					<span className=" text-sm opacity-90">{metadata.description}</span>
// 				</div>
// 				<div className=" col-span-1 lg:col-span-2 row-span-1 gap-2 grid grid-cols-2 grid-rows-1">
// 					<div>
// 						<ScoreIndicator score={54} />
// 					</div>
// 					<div>suggestion/missing</div>
// 				</div>

// 				<div>mvp/core features</div>
// 				<div>competetiors</div>
// 				<div>
// 					i{" "}
// 					<Card className="w-[350px]">
// 						<CardHeader>
// 							<CardTitle>Incdication for success</CardTitle>
// 							<CardDescription>
// 								Deploy your new project in one-click.
// 							</CardDescription>
// 						</CardHeader>
// 						<CardContent>
// 							<div className="grid w-full items-center gap-4">
// 								Lorem ipsum dolor sit amet consectetur adipisicing elit.
// 								Laudantium illum nam animi, unde vero consectetur suscipit quam
// 								ab eaque numquam ut culpa corporis iste praesentium quia autem!
// 								Nulla, asperiores neque?
// 							</div>
// 						</CardContent>
// 						<CardFooter className="flex justify-between">
// 							{/* <Button variant="outline">Cancel</Button>
//                             <Button>Deploy</Button> */}
// 						</CardFooter>
// 					</Card>
// 				</div>
// 			</div>
// 		</main>
// 	);
// };

// export default OverviewAnalysis;
