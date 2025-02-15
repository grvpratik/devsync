import { PhasesOutputSchema } from "shared";

const phases = [
	{
		name: "core",
		tasks: [
			{
				title: "Market Research",
				desc: "Conduct initial market research to understand trends, target audience, and competitors.",
				priority: "high",
			},
			{
				title: "Tools Research",
				desc: "Evaluate and select development tools and frameworks for the project.",
				priority: "medium",
			},
			{
				title: "Initial Implementation",
				desc: "Set up project scaffolding and implement core functionalities.",
				priority: "high",
			},
		],
	},
	{
		name: "MVP",
		tasks: [
			{
				title: "Simple UI Development",
				desc: "Design and develop a minimal user interface for basic interactions.",
				priority: "high",
			},
			{
				title: "Core Functionality Implementation",
				desc: "Implement essential features required to make the MVP functional.",
				priority: "high",
			},
		],
	},
	{
		name: "auth",
		tasks: [
			{
				title: "Authentication Flow Design",
				desc: "Design secure authentication flows for user login and registration.",
				priority: "high",
			},
			{
				title: "Token-Based Authentication",
				desc: "Implement session management with token-based authentication.",
				priority: "high",
			},
			{
				title: "OAuth Integration",
				desc: "Integrate third-party authentication providers for alternative sign-in options.",
				priority: "medium",
			},
		],
	},
	{
		name: "database",
		tasks: [
			{
				title: "Database Schema Design",
				desc: "Design the database schema and data models for the application.",
				priority: "high",
			},
			{
				title: "Database Integration",
				desc: "Integrate and configure the chosen database system (SQL/NoSQL).",
				priority: "medium",
			},
			{
				title: "Data Migration Setup",
				desc: "Plan and implement data migration strategies for future scalability.",
				priority: "medium",
			},
		],
	},
	{
		name: "UI",
		tasks: [
			{
				title: "UI Enhancements",
				desc: "Refine and improve the user interface based on initial feedback.",
				priority: "medium",
			},
			{
				title: "Responsive Design",
				desc: "Ensure the interface is responsive and functions well on various devices.",
				priority: "high",
			},
			{
				title: "Accessibility Improvements",
				desc: "Implement accessibility best practices for an inclusive user experience.",
				priority: "medium",
			},
		],
	},
	{
		name: "refactor and deployment",
		tasks: [
			{
				title: "Code Refactoring",
				desc: "Refactor the codebase to improve maintainability and performance.",
				priority: "medium",
			},
			{
				title: "Deployment Pipeline Setup",
				desc: "Configure CI/CD pipelines for automated testing and deployment.",
				priority: "high",
			},
			{
				title: "Performance Optimization",
				desc: "Optimize code and infrastructure to ensure efficient production performance.",
				priority: "medium",
			},
		],
	},
	{
		name: "market",
		tasks: [
			{
				title: "Marketing Strategy Development",
				desc: "Develop a targeted marketing strategy leveraging social media and content marketing.",
				priority: "medium",
			},
			{
				title: "Community Engagement",
				desc: "Engage with potential users and communities to build awareness and gather feedback.",
				priority: "medium",
			},
			{
				title: "Analytics Integration",
				desc: "Set up analytics tools to monitor user behavior and measure marketing effectiveness.",
				priority: "low",
			},
		],
	},
];

export const PHASES_SYSTEM_INSTRUCTION = `
Act as a project phase planning assistant. Analyze the input business idea, MVP features, and project phases to generate detailed task breakdowns for each phase. Follow these criteria:

1. Each phase should have relevant tasks that align with the phase's purpose
2. Tasks should be concrete and actionable
3. Task priorities should reflect their importance to project success
4. Task descriptions should be clear and specific
5. Consider dependencies between phases when suggesting tasks
6. Ensure tasks align with MVP features and overall project goals

Return valid JSON matching this schema:
${JSON.stringify(PhasesOutputSchema)}
`;



export const PHASES_EXAMPLES = [
	{
		role: "user",
		parts: [
			{
				text: `Business Idea: A platform for freelancers to find jobs
Project MVP: ${JSON.stringify([
					{
						id: "auth",
						name: "User Authentication",
						description: "Basic email/password authentication",
						priority: "high",
						complexity: 7,
						type: "must-have",
					},
					{
						id: "profile",
						name: "User Profiles",
						description: "Create and edit professional profiles",
						priority: "high",
						complexity: 6,
						type: "must-have",
					},
				])}
Project Development Phases: ${JSON.stringify([
					{ name: "core", desc: "Setup core infrastructure" },
					{ name: "auth", desc: "Implement authentication" },
				])}`,
			},
		],
	},
	{
		role: "model",
		parts: [
			{
				text: JSON.stringify([
					{
						name: "core",
						tasks: [
							{
								title: "Project Setup",
								desc: "Initialize project structure and development environment",
								priority: "high",
							},
							{
								title: "Database Design",
								desc: "Design database schema for users and jobs",
								priority: "high",
							},
						],
					},
					{
						name: "auth",
						tasks: [
							{
								title: "Authentication Flow",
								desc: "Implement email/password authentication system",
								priority: "high",
							},
							{
								title: "User Session Management",
								desc: "Implement secure session handling and token management",
								priority: "medium",
							},
						],
					},
				]),
			},
		],
	},
	{
		role: "user",
		parts: [
			{
				text: `Business Idea: Fitness tracking mobile app
Project MVP: ${JSON.stringify([
					{
						id: "tracking",
						name: "Activity Tracking",
						description: "Track steps, distance, and calories",
						priority: "high",
						complexity: 8,
						type: "must-have",
					},
					{
						id: "goals",
						name: "Fitness Goals",
						description: "Set and monitor fitness goals",
						priority: "medium",
						complexity: 5,
						type: "should-have",
					},
				])}
Project Development Phases: ${JSON.stringify([
					{ name: "core", desc: "Basic app setup" },
					{ name: "tracking", desc: "Implement activity tracking" },
				])}`,
			},
		],
	},
	{
		role: "model",
		parts: [
			{
				text: JSON.stringify([
					{
						name: "core",
						tasks: [
							{
								title: "Mobile App Setup",
								desc: "Initialize mobile app project with required dependencies",
								priority: "high",
							},
							{
								title: "UI Framework",
								desc: "Set up UI framework and basic navigation",
								priority: "medium",
							},
						],
					},
					{
						name: "tracking",
						tasks: [
							{
								title: "Sensor Integration",
								desc: "Implement integration with device sensors for activity tracking",
								priority: "high",
							},
							{
								title: "Data Storage",
								desc: "Implement local storage for tracking data",
								priority: "medium",
							},
						],
					},
				]),
			},
		],
	},
];

