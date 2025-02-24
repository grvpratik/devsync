"use client";

import React from "react";
import {
	Calendar,
	ChevronRight,
	Feather,
	Store,
	LucideIcon,
} from "lucide-react";

import OverviewAnalysis from "./overview-section";
import FeaturesAnalysis from "./feature-section";
import MarketAnalysis from "./market-section";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "www/components/ui/tabs";

import { BusinessIdeaResult } from "shared";
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

// Types and Interfaces
interface AnalysisProps {
	res: any;
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
	console.log(res.result?.metadata, "metadata");

	const tabs = React.useMemo(() => {
		return ANALYSIS_TABS.map((tab) => ({
			...tab,
			content: getTabContent(tab.value, res.result),
		}));
	}, [res.result]);

	return (
		<div className="flex flex-col w-full h-full  overflow-hidden">
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
				<div>
					<Dialog>
						<DialogTrigger className=" fixed bottom-0 w-full flex  justify-center ">
							{" "}
							Schedule
						</DialogTrigger>
						<DialogContent className="  ">
							<DialogHeader>
								<DialogTitle>Create schedule</DialogTitle>
								<DialogDescription></DialogDescription>
							</DialogHeader>

							<MultiDateRangeSelector id={id} />
						</DialogContent>
					</Dialog>
				</div>
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

	switch (tabValue) {
		case AnalysisTabs.Overview:
			return (
				<OverviewAnalysis metadata={data.metadata} overview={data.overview!} />
			);
		case AnalysisTabs.Features:
			return <FeaturesAnalysis featureslist={data.feature!} />;
		case AnalysisTabs.Market:
			return <MarketAnalysis marketData={data.market} />;
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
		<TabsContent key={value} value={value} className="flex-1 m-2 rounded-lg ">
			{content}
		</TabsContent>
	));
}

export default Analysis;
