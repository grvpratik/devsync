import { Hono } from "hono";
import { checkSession } from "../middleware/auth";
import { BuildController } from "../controller/build.contoller";

export const buildRoute = new Hono();

// buildRoute.use("*", checkSession);

buildRoute.post("/search", BuildController.getSearch);


buildRoute.post("/:id", async (c) => {
	return c.text("ok");
});


buildRoute.post("/:id/edit/market", BuildController.getReportById);

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
