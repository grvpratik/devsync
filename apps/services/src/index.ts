import { Hono } from "hono";

import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { base } from "./routes/route";
import "dotenv/config";

const app = new Hono<{ Bindings: CloudflareBindings }>();
const NODE_ENV: string = "development";
app.use("*", logger());
app.use("*", prettyJSON());
app.use(
	"*",
	cors({
		// Allow specific origins in production, or all in development
		origin:
			NODE_ENV === "production" ?
				["https://your-production-domain.com", "https://your-app.vercel.app"]
			:	"http://localhost:3000",

		// Allow credentials (cookies, authorization headers)
		credentials: true,


		// Allowed headers
		allowHeaders: [
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"Accept",
			"Origin",
		],

		
		exposeHeaders: ["Content-Length", "X-Requested-With"],

		// Max age for preflight requests cache (in seconds)
		maxAge: 600,

		// For additional security in production
		...(NODE_ENV === "production" && {
			// Prevent CSRF attacks
			credentials: true,
			// Only allow HTTPS in production
			preflightContinue: false,
			optionsSuccessStatus: 204,
		}),
	})
);
// Add to your Hono app

app.route("/", base);
console.log("server is running ✅");

app.onError((err, c) => {
	console.error(`${err}`);
	return c.json(
		{
			success: false,
			error: {
				message: err.message || "Internal Server Error",
			},
		},
		500
	);
});

// Not found handler
app.notFound((c) => {
	return c.json(
		{
			sucess: false,
			error: {
				message: "Not Found",
			},
		},
		404
	);
});
export default app;

// export default {
// 	async fetch(req, env) {
// 		return app.fetch(req, env);
// 	},
// };
