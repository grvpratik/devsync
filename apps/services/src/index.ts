import { Hono } from "hono";

import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { base } from "./routes/base.route";
import { errorHandler } from "./middleware/error";
const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use("*", logger());
app.use("*", prettyJSON());
app.options(
	"*",
	cors({
		origin: "http://localhost:3000",
		credentials:true
	})
);
// app.use("*",cors())
app.use("*", async (c, next) => {
	await cors({
		
		origin:
			c.env.CF_ENV === "production" ?
				"https://your-production-domain.com" 
			:	"http://localhost:3000",

		// Enable credentials
		credentials: true,

		// Allow necessary headers
		allowHeaders: [
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"Accept",
			"Origin",
		],

		// Expose headers if needed
		exposeHeaders: ["Content-Length", "X-Requested-With"],

		// Cache preflight requests
		maxAge: 600,

		// Allow specific methods
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	})(c, next);
});
app.route("/", base);

console.log("server is running ✅");

app.onError(errorHandler);

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
