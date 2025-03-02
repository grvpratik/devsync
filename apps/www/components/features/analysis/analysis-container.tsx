"use client";

import { Calendar, Feather, LucideIcon, Store } from "lucide-react";
import React from "react";

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "www/components/ui/tabs";
import MarketAnalysis from "./market-section";
import OverviewAnalysis from "./overview-section";

import { BusinessIdeaResult, ProjectReportResponse } from "shared";
import { Button } from "www/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "www/components/ui/dialog";
import { MultiDateRangeSelector } from "../../form/phase-selector";
import FeatureList from "./feature-section";
import { SuccessResponse } from "www/lib/handler";

// Types and Interfaces
interface AnalysisProps {
	res: SuccessResponse<ProjectReportResponse>;
	id: string;
}

interface TabConfig {
	value: AnalysisTabs;
	label: string;
	icon: LucideIcon;
	content: React.ReactNode;
}

enum AnalysisTabs {
	Overview = "overview",
	Features = "features",
	Market = "market",
}

const ANALYSIS_TABS: TabConfig[] = [
	{
		value: AnalysisTabs.Overview,
		label: "Overview",
		icon: Calendar,
		content: null,
	},
	{
		value: AnalysisTabs.Features,
		label: "Features",
		icon: Feather,
		content: null,
	},
	{
		value: AnalysisTabs.Market,
		label: "Market",
		icon: Store,
		content: null,
	},
];

const Analysis: React.FC<AnalysisProps> = ({ res, id }) => {
	const [activeTab, setActiveTab] = React.useState<AnalysisTabs>(
		AnalysisTabs.Overview
	);

	const tabs = React.useMemo(() => {
		return ANALYSIS_TABS.map((tab) => ({
			...tab,
			content: getTabContent(tab.value, res.result),
		}));
	}, [res.result]);
	console.log(res.result.phases);
	return (
		<div className="flex flex-col w-full h-full overflow-hidden relative">
			<main className="flex-1 flex flex-col">
				<Tabs
					value={activeTab}
					onValueChange={(value) => setActiveTab(value as AnalysisTabs)}
					className="lg:flex w-full h-full"
					orientation="vertical"
				>
					<TabsList className="lg:h-fit bg-transparent m-2 lg:flex-col lg:gap-2 lg:items-start lg:justify-start lg:*:w-48 gap-2">
						{renderTabTriggers(tabs)}
					</TabsList>

					{renderTabContents(tabs)}
				</Tabs>
				{res.result.phases && !!res.result.phases.length ? null : (
					<div className="fixed bottom-4 left-0 right-0 flex justify-center">
						<Dialog>
							<DialogTrigger asChild>
								<Button className="px-8 py-2 rounded-full shadow-md">
									Schedule
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-md">
								<DialogHeader>
									<DialogTitle>Create Schedule</DialogTitle>
									<DialogDescription>
										Set up dates for your project phases
									</DialogDescription>
								</DialogHeader>
								<MultiDateRangeSelector id={id} />
							</DialogContent>
						</Dialog>
					</div>
				)}
			</main>
		</div>
	);
};

// Helper Functions
function getTabContent(
	tabValue: AnalysisTabs,
	data?: BusinessIdeaResult
): React.ReactNode {
	if (!data) return null;
	const mvp = data.feature ? data.feature.mvp : null;
	const featuresList = data.feature ? data.feature?.features : null;
	switch (tabValue) {
		case AnalysisTabs.Overview:
			return (
				<OverviewAnalysis
					metadata={data.metadata}
					overview={data.overview!}
					id={data.id}
				/>
			);
		case AnalysisTabs.Features:
			return <FeatureList mvp={mvp} features={featuresList} id={data.id} />;
		case AnalysisTabs.Market:
			return <MarketAnalysis marketData={data.market} id={data.id} />;
		default:
			return null;
	}
}

function renderTabTriggers(tabs: TabConfig[]): React.ReactNode {
	return tabs.map(({ value, label, icon: Icon }) => (
		<TabsTrigger
			key={value}
			value={value}
			className="items-center justify-start flex p-1 gap-2 text-sm pr-2 min-w-28"
		>
			<Icon className="lg:size-8 size-6 text-primary-foreground bg-blue-400 p-1.5 rounded-md" />
			<span>{label.toLowerCase()}</span>
		</TabsTrigger>
	));
}

function renderTabContents(tabs: TabConfig[]): React.ReactNode {
	return tabs.map(({ value, content }) => (
		<TabsContent key={value} value={value} className="flex-1 m-2 rounded-lg">
			{content}
		</TabsContent>
	));
}

export default Analysis;
