import { Hono } from "hono";

import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
;
import { base } from "./routes/route";


const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use("*", logger());
app.use("*", prettyJSON());
app.use("*", cors());

app.route("/", base);
console.log("server is running ✅")




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
		{sucess:false,
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
