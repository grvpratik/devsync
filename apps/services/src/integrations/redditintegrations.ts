import axios from "axios";

interface SearchPostsParams {
	token: string;
	query: string;
	subreddit?: string;
	sort?: "relevance" | "hot" | "top" | "new" | "comments";
	time?: "hour" | "day" | "week" | "month" | "year" | "all";
	limit?: number;
}

interface RedditPost {
	title: string;
	author: string;
	subreddit: string;
	score: number;
	upvote_ratio: number;
	num_comments: number;
	created_utc: number;
	url: string;
	is_self: boolean;
	selftext: string;
	link_url: string;
	is_video: boolean;
	media: any;
	thumbnail: string;
	awards: number;
	post_hint?: string;
	distinguished: string | null;
	stickied: boolean;
	locked: boolean;
	over_18: boolean;
}

interface Subreddit {
	name: string;
	subscribers: number;
	description: string;
}
export async function generateRedditToken(c: any) {
	const { REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET } = c.env;
	const clientId = REDDIT_CLIENT_ID;
	const clientSecret = REDDIT_CLIENT_SECRET;
	const tokenResponse = await axios.post(
		"https://www.reddit.com/api/v1/access_token",
		new URLSearchParams({
			grant_type: "client_credentials",
		}),
		{
			auth: {
				username: clientId!,
				password: clientSecret!,
			},
			headers: {
				"User-Agent":
					"app/1.0 ",
			},
		}
	);

	const accessToken = tokenResponse.data.access_token;
	return accessToken;
}
export async function searchSubreddits(
	query: string,
	token: any
): Promise<Subreddit[]> {
	

	const accessToken =token;

	const searchResponse = await axios.get(
		"https://oauth.reddit.com/subreddits/search",
		{
			params: {
				q: query,
				limit: 10,
			},
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"User-Agent": "app/1.0",
			},
		}
	);

	return searchResponse.data.data.children.map((sub: any) => ({
		name: sub.data.display_name,
		subscribers: sub.data.subscribers,
		description: sub.data.public_description,
	}));
}

export async function searchRedditPosts({
	token,
	query,
	subreddit = "",
	sort = "relevance",
	time = "all",
	limit = 25,
}: SearchPostsParams): Promise<RedditPost[]> {
	// Build search URL
	let searchUrl = "https://oauth.reddit.com/search";
	if (subreddit) {
		searchUrl = `https://oauth.reddit.com/r/${subreddit}/search`;
	}

	// Search posts
	const searchResponse = await axios.get(searchUrl, {
		params: {
			q: query,
			sort,
			t: time,
			limit,
			restrict_sr: !!subreddit, // Restrict to subreddit if specified
			type: "link", // Search for posts
		},
		headers: {
			Authorization: `Bearer ${token}`,
			"User-Agent": "YourAppName/1.0",
		},
	});

	// Process and return post results
	return searchResponse.data.data.children.map((post: any) => ({
		title: post.data.title,
		author: post.data.author,
		subreddit: post.data.subreddit,
		score: post.data.score,
		upvote_ratio: post.data.upvote_ratio,
		num_comments: post.data.num_comments,
		created_utc: post.data.created_utc,
		url: `https://reddit.com${post.data.permalink}`,
		is_self: post.data.is_self,
		selftext: post.data.selftext,
		link_url: post.data.url,
		is_video: post.data.is_video,
		media: post.data.media,
		thumbnail: post.data.thumbnail,
		awards: post.data.all_awardings?.length || 0,
		post_hint: post.data.post_hint,
		distinguished: post.data.distinguished,
		stickied: post.data.stickied,
		locked: post.data.locked,
		over_18: post.data.over_18,
	}));
}

