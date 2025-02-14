import { Hono } from "hono";
import { checkSession } from "../middleware/auth";

export const buildRoute = new Hono();

buildRoute.use("*", checkSession);

buildRoute.post("/search", async (c) => {
	return c.text("ok");
});


buildRoute.post("/:id", async (c) => {
	return c.text("ok");
});


buildRoute.post("/:id/edit/market", async (c) => {
	return c.text("ok");
});

buildRoute.post("/:id/edit/feature", async (c) => {
	return c.text("ok");
});

buildRoute.post("/:id/refresh", async (c) => {
	return c.text("ok");
});

buildRoute.post("/:id/phase", async (c) => {
	return c.text("ok");
});

buildRoute.post("/:id/phase/edit", async (c) => {
	return c.text("ok");
});
