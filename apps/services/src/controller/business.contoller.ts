import { optional, string, z } from "zod";
import { PhaseController } from "./phases.controller";

const data = [
	{
		success: true,
		result: {
			id: "1739080602",
			prompt:"short for video using ai for youtube",
			timestamp: "2025-02-09T05:56:42.803Z",
			metadata: {
				name: "test",
				image: "here.com/gpg",
				description: "lol this is thr description of the page",
			},
			overview: {
				problem: "Time-consuming manual video editing for short-form content",
				score: {
					feasibility: {
						score: 8,
						overview: "Utilizing existing AI tools and APIs is feasible.",
						considerations: [
							"Integration complexities",
							"Scalability of processing",
						],
					},
					marketfit: {
						score: 9,
						overview:
							"High demand for short-form content from existing long-form creators.",
						considerations: [
							"Monetization strategies for repurposed content",
							"User adoption rates",
						],
					},
					uniqueness: {
						score: 7,
						overview: "Several similar tools exist; differentiation is key.",
						considerations: [
							"AI accuracy in content selection",
							"Speed and efficiency of processing",
						],
					},
					technical: {
						score: 8,
						overview:
							"Relies on readily available AI and cloud infrastructure.",
						considerations: ["AI model selection", "API costs"],
					},
				},
				suggestion: [
					{
						name: "Automated Highlight Detection",
						description:
							"Use AI to identify the most engaging parts of the long-form video.",
					},
					{
						name: "Customizable Templates",
						description:
							"Offer various short-form video templates with different aspect ratios, transitions, and captions.",
					},
				],
				missing: [
					{
						name: "User Interface for Review and Editing",
						description:
							"A user-friendly interface to review the AI-generated shorts and make manual adjustments.",
					},
				],
				indication: [
					{
						name: "Time Saved Per User",
						description:
							"Significant time reduction in creating shorts indicates success.",
						type: "success",
					},
					{
						name: "Content Relevance Accuracy",
						description:
							"Poor highlight selection and irrelevant content leads to user dissatisfaction.",
						type: "failure",
					},
				],
			},
			market: {
				competitors: [
					{
						name: "Opus Clip",
						description:
							"AI-powered tool to repurpose long videos into engaging Shorts.",
						url: "https://www.opus.pro/",
						key_features: [
							"AI-powered scene selection",
							"Automatic captioning",
							"Branding options",
						],
						missing_features: [
							"Advanced editing tools",
							"Direct social media scheduling",
						],
						strengths: ["Ease of use", "Fast processing"],
						weaknesses: ["Limited customization", "Subscription-based pricing"],
						sentiment: "positive",
					},
					{
						name: "Descript",
						description: "All-in-one video and audio editing software.",
						url: "https://www.descript.com/",
						key_features: [
							"Transcription-based editing",
							"AI voice cloning",
							"Multi-track editing",
						],
						missing_features: ["AI-driven short creation"],
						strengths: [
							"Powerful editing capabilities",
							"Collaboration features",
						],
						weaknesses: ["Steeper learning curve", "Higher price point"],
						sentiment: "neutral",
					},
					{
						name: "Pictory AI",
						description: "AI video generator for creating engaging content.",
						url: "https://pictory.ai/",
						key_features: [
							"Text-to-video conversion",
							"Automatic visual selection",
							"Customizable templates",
						],
						missing_features: [
							"Advanced AI short creation",
							"Direct YouTube integration",
						],
						strengths: ["User-friendly interface", "Affordable pricing"],
						weaknesses: ["Limited control over AI", "Stock footage based"],
						sentiment: "positive",
					},
				],
				audience: {
					demographics: {
						age_range: [18, 45],
						gender_ratio: {
							male: 60,
							female: 40,
							other: 0,
						},
						locations: ["Global, with focus on English-speaking countries"],
						income_levels: ["Varies, targets content creators and marketers"],
					},
					psychographics: {
						values: ["Efficiency", "Creativity"],
						interests: [
							"Video editing",
							"Social media marketing",
							"Content creation",
						],
					},
					behavior: {
						needs: [
							"Time-saving video editing solutions",
							"Easy ways to create engaging content",
							"Improved workflow",
						],
						frustrations: [
							"Time-consuming manual editing",
							"Difficulty finding best moments",
							"Lack of resources",
						],
						online_habits: [
							"Frequent YouTube users",
							"Active on social media",
							"Researching video editing tools",
						],
						preferred_channels: [
							"YouTube tutorials",
							"Online forums",
							"Social media groups",
						],
					},
				},
				pain_points: [
					"Time required to manually edit videos",
					"Difficulty identifying engaging moments",
					"Lack of skills in video editing",
				],
				gaps: [
					"AI-powered short creation tailored for specific niches",
					"Integration with advanced editing tools for further customization",
					"More affordable and flexible pricing options",
				],
				trends: {
					market_size: "Estimated at $15 Billion",
					growth_rate: "18% annually",
					emerging_technologies: [
						"Advanced AI algorithms",
						"Cloud-based video editing",
						"Integration with social media platforms",
					],
					regulatory_factors: [
						"Copyright issues",
						"Data privacy regulations",
						"Fair use policies",
					],
				},
			},
			feature: {
				mvp: [
					{
						id: "mvp-001",
						name: "Video Upload and Processing",
						description:
							"Allow users to upload long-form videos to the platform.",
						priority: "P0",
						complexity: 4,
						type: "must-have",
					},
					{
						id: "mvp-002",
						name: "AI Scene Detection and Highlighting",
						description:
							"AI algorithms automatically identify key scenes and highlights within the video.",
						priority: "P0",
						complexity: 7,
						type: "must-have",
					},
					{
						id: "mvp-003",
						name: "Short Clip Generation",
						description:
							"Automatically generate short clips (e.g., <60 seconds) based on detected highlights.",
						priority: "P0",
						complexity: 6,
						type: "must-have",
					},
					{
						id: "mvp-004",
						name: "Basic Editing Tools",
						description:
							"Provide basic editing functionalities such as trimming the clip.",
						priority: "P0",
						complexity: 5,
						type: "must-have",
					},
					{
						id: "mvp-005",
						name: "Download and Export Options",
						description: "Allow users to download the generated short clips.",
						priority: "P0",
						complexity: 3,
						type: "must-have",
					},
				],
				features: [
					{
						id: "feat-001",
						name: "Customizable Clip Length",
						description:
							"Allow users to specify the desired length of the generated short clips.",
						priority: "P1",
						complexity: 4,
						type: "should-have",
					},
					{
						id: "feat-002",
						name: "Manual Scene Selection",
						description:
							"Allow users to manually select scenes for creating short clips.",
						priority: "P1",
						complexity: 5,
						type: "should-have",
					},
					{
						id: "feat-003",
						name: "AI Caption Generation",
						description: "Automatically generate captions for the short clips.",
						priority: "P1",
						complexity: 6,
						type: "should-have",
					},
					{
						id: "feat-004",
						name: "Direct Upload to Social Media",
						description:
							"Allow users to directly upload the generated short clips to social media platforms.",
						priority: "P2",
						complexity: 4,
						type: "nice-to-have",
					},
					{
						id: "feat-005",
						name: "AI Style Transfer",
						description:
							"Apply different visual styles to the generated short clips using AI.",
						priority: "P2",
						complexity: 8,
						type: "nice-to-have",
					},
				],
			},
		},
	},
	{
		success: true,
		result: {
			id: "1739082105",
			prompt:"predicting next top meme coin via ml model on onchaind data and social sementic analysis on solana",
			timestamp: "2025-02-09T06:21:45.278Z",
			metadata: {
				name: "test",
				image: "here.com/gpg",
				description: "lol this is thr description of the page",
			},
			overview: {
				problem:
					"Identifying profitable meme coins is risky and time-consuming",
				score: {
					feasibility: {
						score: 6,
						overview: "Relies on complex data analysis",
						considerations: ["Data accessibility", "Analysis accuracy"],
					},
					marketfit: {
						score: 7,
						overview: "High interest in crypto investments",
						considerations: ["Market volatility", "Regulatory risks"],
					},
					uniqueness: {
						score: 8,
						overview: "Unique data-driven approach",
						considerations: [
							"Algorithm differentiation",
							"Edge against human traders",
						],
					},
					technical: {
						score: 7,
						overview: "Requires blockchain data processing",
						considerations: ["Data infrastructure", "Scalability"],
					},
				},
				suggestion: [
					{
						name: "Risk Assessment",
						description: "Implement risk scores for predicted coins",
					},
					{
						name: "Backtesting Framework",
						description: "Simulate past performance to validate model",
					},
				],
				missing: [
					{
						name: "Real-time Alerts",
						description: "Immediate notifications on potential opportunities",
					},
				],
				indication: [
					{
						name: "Prediction Accuracy",
						description: "Consistent profitability indicates success",
						type: "success",
					},
					{
						name: "Market Volatility",
						description: "Unexpected market crashes lead to model failure",
						type: "failure",
					},
				],
			},
			feature: {
				mvp: [
					{
						id: "mvp-001",
						name: "On-Chain Data Ingestion",
						description:
							"Real-time ingestion of Solana blockchain data (transactions, liquidity pools, token information)",
						priority: "P0",
						complexity: 8,
						type: "must-have",
					},
					{
						id: "mvp-002",
						name: "Social Sentiment Analysis",
						description:
							"Collection and analysis of social media data (Twitter, Reddit) related to Solana meme coins",
						priority: "P0",
						complexity: 7,
						type: "must-have",
					},
					{
						id: "mvp-003",
						name: "Basic Prediction Algorithm",
						description:
							"Initial prediction model combining on-chain and social sentiment data to identify potential trending meme coins",
						priority: "P0",
						complexity: 6,
						type: "must-have",
					},
					{
						id: "mvp-004",
						name: "Alerting System",
						description: "Basic notification system for potential meme coins",
						priority: "P0",
						complexity: 4,
						type: "must-have",
					},
				],
				features: [
					{
						id: "feat-001",
						name: "Advanced Sentiment Analysis",
						description:
							"Advanced analysis of text using NLP to incorporate sarcasm, and other hard to detect nuances.",
						priority: "P1",
						complexity: 8,
						type: "should-have",
					},
					{
						id: "feat-002",
						name: "Backtesting Framework",
						description:
							"Backtesting framework for evaluating the performance of the prediction algorithm",
						priority: "P1",
						complexity: 7,
						type: "should-have",
					},
					{
						id: "feat-003",
						name: "User Dashboard",
						description:
							"Dashboard to visualize prediction results, on-chain data, and social sentiment metrics",
						priority: "P1",
						complexity: 5,
						type: "should-have",
					},
					{
						id: "feat-004",
						name: "Customizable Alert Rules",
						description:
							"Allow users to configure custom alert rules based on specific criteria",
						priority: "P2",
						complexity: 6,
						type: "nice-to-have",
					},
					{
						id: "feat-005",
						name: "Integration with Trading Platforms",
						description:
							"Integration with Solana-based DEXs to allow automated trading based on predictions",
						priority: "P2",
						complexity: 9,
						type: "nice-to-have",
					},
				],
			},
		},
	},
];
const schedule = [
	{
		name: "MVP",
		tasks: [
			{
				title: "Video Upload Implementation",
				desc: "Implement the functionality for users to upload long-form videos to the platform.",
				priority: "high",
			},
			{
				title: "AI Scene Detection Module",
				desc: "Develop and integrate AI algorithms to detect key scenes and highlights in videos.",
				priority: "high",
			},
			{
				title: "Short Clip Generation Logic",
				desc: "Implement the logic for automatically generating short clips based on AI-identified highlights.",
				priority: "high",
			},
			{
				title: "Basic Editing Tools Development",
				desc: "Develop basic video editing tools, including trimming and clip adjustment features.",
				priority: "medium",
			},
			{
				title: "Download and Export Functionality",
				desc: "Implement options for users to download and export the generated short clips in various formats.",
				priority: "medium",
			},
		],
	},
];


//console.log(updatedSchedule);

export async function businessDetails(c: any) {
	const id = c.req.param("id");
	const res = data.find((val) => val.result.id === id)  
	return c.json(res, 200);
}
const BusinessPhaseSchema = z.object({
	name: z.string(),
	description: z.string(),
	start_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: "Invalid date format for start_date",
	}),
	end_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: "Invalid date format for end_date",
	}),
	content: z.array(z.any()),
});

const BusinessPhasesSchema=z.array(BusinessPhaseSchema)


export async function businessSchedule(c:any) {
	
		const body = await c.req.json();
				const parsed = BusinessPhasesSchema.safeParse(body);
				console.log(body);
				if (!parsed.success) {
					return c.json(
						{
							success: false,
							message: parsed.error,
						},
						400
					);
				}
				// const {  } = parsed.data;
				// console.log(parsed.data,"parsed");
				const phasesInfo = parsed.data && parsed.data.map((phase)=>{
					return{
						name:phase.name,
						desc:phase.description
					}
				});
				

		const id = c.req.param("id");
		const res = data.find((val) => val.result.id === id)?.result;  
		const mvp=res?.feature.mvp;
		if (res) {
			const phaseResult = await PhaseController(c, res.prompt, phasesInfo,mvp);
			console.log(phaseResult,"result")
			const updatedSchedule = phaseResult.map((p) => ({
				...p,
				tasks: p.tasks.map((task) => ({
					...task,
					id: Math.floor(Math.random() * 10000),
					completed: false,
				})),
			}));
			return c.json(updatedSchedule,200);
		} else {
			return c.json({ success: false, message: "Resource not found" }, 404);
		}
}