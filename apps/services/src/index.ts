import { Hono } from "hono";

import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { base } from "./routes/base.route";
const app = new Hono<{ Bindings: CloudflareBindings }>();


app.use("*", logger());
app.use("*", prettyJSON());
app.use(
	"*",
	async (c, next) => {
		const CF_ENV = c.env.CF_ENV || "development";
		console.log("CF_ENV",CF_ENV)
		await cors({
			origin:
				CF_ENV === "production" ?
					["", ""]
				:	"http://localhost:3000",
			credentials: true,
			allowHeaders: [
				"Content-Type",
				"Authorization",
				"X-Requested-With",
				"Accept",
				"Origin",
			],
			exposeHeaders: ["Content-Length", "X-Requested-With"],
			maxAge: 600,
			...(CF_ENV === "production" && {
				credentials: true,
				preflightContinue: false,
				optionsSuccessStatus: 204,
			}),
		})(c, next);
	}
);


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
