interface SearchOptions {
	language?: string;
	minStars?: number;
}

interface RepositoryListOptions {
	type?: "all" | "owner" | "public" | "private" | "member";
	sort?: "created" | "updated" | "pushed" | "full_name";
	direction?: "asc" | "desc";
}

interface Repository {
	name: string;
	description: string | null;
	stars: number;
	forks: number;
	url: string;
	language: string | null;
}


interface RepositoryDetails extends Repository {
	openIssues: number;
	createdAt: Date;
	lastUpdated: Date;
	defaultBranch: string;
	visibility: string;
}



interface GitHubRepoResponse {
	full_name: string;
	description: string | null;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	open_issues_count: number;
	created_at: string;
	updated_at: string;
	default_branch: string;
	visibility: string;
	html_url: string;
}

const baseUrl = "https://api.github.com";

function createHeaders(accessToken: string): Record<string, string> {
	return {
		Accept: "application/vnd.github.v3+json",
		'User-Agent': 'request',
		...(accessToken && { Authorization: `token ${accessToken}` }),
	};
}

export async function searchRepositories(
	query: string,
	options: SearchOptions = {},
	accessToken: string = ""
): Promise<Repository[]> {
	const { language, minStars } = options;
	let searchQuery = query;

	if (language) {
		searchQuery += ` language:${language}`;
	}
	if (minStars) {
		searchQuery += ` stars:>${minStars}`;
	}

	try {
		const response = await fetch(
			`${baseUrl}/search/repositories?q=${encodeURIComponent(searchQuery)}`,
			{
				method: "GET",
				
				headers: createHeaders(accessToken),
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json() as { items: any[] };
		return data.items.slice(0, 10).map((repo: any) => ({
			name: repo.full_name,
			description: repo.description,
			stars: repo.stargazers_count,
			forks: repo.forks_count,
			url: repo.html_url,
			language: repo.language,
		}));
	} catch (error) {
		console.error("Error searching repositories:", error);
		return [];
	}
}


async function getRepositoryDetails(
	owner: string,
	repo: string,
	accessToken: string = ""
): Promise<RepositoryDetails | null> {
	try {
		const response = await fetch(`${baseUrl}/repos/${owner}/${repo}`, {
			method: "GET",
			headers: createHeaders(accessToken),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const repoDetails = await response.json() as GitHubRepoResponse;
		return {
			name: repoDetails.full_name,
			description: repoDetails.description,
			language: repoDetails.language,
			stars: repoDetails.stargazers_count,
			forks: repoDetails.forks_count,
			openIssues: repoDetails.open_issues_count,
			createdAt: new Date(repoDetails.created_at),
			lastUpdated: new Date(repoDetails.updated_at),
			defaultBranch: repoDetails.default_branch,
			visibility: repoDetails.visibility,
			url: repoDetails.html_url,
		};
	} catch (error) {
		console.error("Error fetching repository details:", error);
		return null;
	}
}



// async function demonstrateGitHubAPI(): Promise<void> {
// 	const accessToken = ""; // Add your GitHub personal access token here if needed

// 	try {
// 		console.log("Searching for JavaScript machine learning repositories:");
// 		const mlRepos = await searchRepositories("machine learning", {
// 			language: "javascript",
// 			minStars: 100,
// 		}, accessToken);
// 		mlRepos.forEach((repo) =>
// 			console.log(`- ${repo.name}: ${repo.description}`)
// 		);

// 		console.log("\nRepository Details:");
// 		const repoDetails = await getRepositoryDetails(
// 			"octocat",
// 			"Hello-World",
// 			accessToken
// 		);
// 		console.log(repoDetails);
// 	} catch (error) {
// 		console.error("Error in GitHub API demonstration:", error);
// 	}
// }

// demonstrateGitHubAPI();
