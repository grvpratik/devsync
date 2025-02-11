import { Hono } from "hono";

import { searchController } from "../controller/search.controller";

import { personal } from "./personalRoute";

import { business } from "./buisnessRoute";
import { user } from "./userRoute";

export const base = new Hono();

base.all("/", (c) => {
	return c.json({ status: "ok", message: "server is OK ✅" });
});
base.post("/search", searchController);

	
base.route("/business", business);
base.route("/personal", personal);
base.route('/user',user)
