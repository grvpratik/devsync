
export interface Metadata {
	id: string;
	timestamp: string;
	version: string;
}

export interface MarketAnalysis {
	marketFit: string;
	potentialScore: number;
}

export interface Complexity {
	implementation: number;
	technical: number;
}

export interface Feature {
	id: string;
	name: string;
	description: string;
	priority: string;
	status: string;
	complexity: number;
	estimatedDevelopmentTime: string;
}

