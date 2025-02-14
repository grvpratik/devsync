import { Hono } from "hono";


import { user } from "./../middleware/auth";
import { buildRoute } from "./build.route";

export const base = new Hono();

base.all("/", (c) => {
	return c.json({ success: true, message: "server is OK ✅" });
});

base.route("/build", buildRoute);

base.route("/user", user);

//open site->server session->root layout check->null->contect null->login button show->on click->redirected to google->set session->redirect home->server session check->ok->context user ->profil show->choice->again login route ->middleware check->session present->redirect home->choice 2 ->protect route->server check ->sesiion aval->ok
