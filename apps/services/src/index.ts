import { Hono } from "hono";

import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { base } from "./routes/base.route";
import { errorHandler } from "./middleware/error";
import type { JwtVariables } from "hono/jwt";
type Variables = JwtVariables;
const app = new Hono<{ Bindings: CloudflareBindings; Variables: Variables }>();

app.use("*", logger());
app.use("*", prettyJSON());
app.options(
	
	cors({
		origin: ["http://localhost:3000", "https://devsync-gamma.vercel.app"],
		credentials: true,
		allowHeaders: [
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"Accept",
			"Origin",
			"Access-Control-Allow-Credentials",
		],
		exposeHeaders: ["Content-Length", "X-Requested-With"],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	})
);
// app.use("*",cors())
app.use(async (c, next) => {
	await cors({
		origin:
			c.env.CF_ENV === "production" ?
				"https://devsync-gamma.vercel.app"
			:	["http://localhost:3000", "https://devsync-gamma.vercel.app"],

		credentials: true,
		allowHeaders: [
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"Accept",
			"Origin",
		],
		exposeHeaders: ["Content-Length", "X-Requested-With"],
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
