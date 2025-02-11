 const MainResponse = [
	{
		id: 1,
		title: "AI Writer",
		desc: "AI writer is a tool that helps you write content faster and more efficiently. It uses artificial intelligence to generate text based on your input, saving you time and effort.",

		analysis: {
			feasibility: {
				score: 85,
				overview: "Technical implementation capability using current resources",
				description:
					"Evaluates whether the idea can be built with existing technologies, skills, and resources within reasonable constraints.",
				considerations: [
					"Technical complexity",
					"Resource availability",
					"Implementation timeline",
				],
			},
			marketFit: {
				score: 92,
				overview: "Problem-solution alignment with market needs",
				description:
					"Measures how well the idea addresses a significant market need or pain point.",
				considerations: [
					"Target market size",
					"Problem urgency",
					"Solution effectiveness",
				],
			},
			scalability: {
				score: 78,
				overview: "Growth potential and adaptation capability",
				description:
					"Assesses the ability to handle increased demand and market expansion.",
				considerations: [
					"Technical architecture",
					"Operational efficiency",
					"Resource requirements",
				],
			},
			differentiation: {
				score: 88,
				overview: "Unique value proposition versus competitors",
				description:
					"Evaluates distinctive features and competitive advantages.",
				considerations: [
					"Competitor analysis",
					"Unique features",
					"Market positioning",
				],
			},
			roiPotential: {
				score: 82,
				overview: "Financial and strategic return prospects",
				description:
					"Projects potential returns on investment and strategic value.",
				considerations: [
					"Revenue potential",
					"Cost structure",
					"Strategic benefits",
				],
			},
		},

		phases: [
			{
				name: "core",
				start_date: "2025-01-01T00:00:00.000Z",
				end_date: "2025-01-30T00:00:00.000Z",
				tasks: [
					{
						id: "1",
						title: "Market Research",
						desc: "Conduct market research to identify target audience and competitors.",
						completed: true,
						priority: "high",
					},
					{
						id: "2",
						title: "Competitor Analysis",
						desc: "Conduct market research to identify target audience and competitors.",
						completed: true,
						priority: "medium",
					},
				],
			},
			{
				name: "features",
				start_date: "2027-01-01T00:00:00.000Z",
				end_date: "2025-12-31T00:00:00.000Z",
				tasks: [],
			},
			// Add other phases similarly
		],
	},
	
];
export default MainResponse;
