import { Hono } from "hono";
import { checkSession } from "../middleware/auth";
import { BuildController } from "../controller/build.contoller";

export const buildRoute = new Hono();

buildRoute.use("*", checkSession);

buildRoute.post("/search", BuildController.getSearch);

buildRoute.post("/project/:id", BuildController.getReportById);

buildRoute.post("/project", BuildController.getAllUserReport);

// buildRoute.post("/:id/edit/market", );

// buildRoute.post("/:id/edit/feature", async (c) => {
// 	return c.text("ok");
// });

buildRoute.post("/project/:id/refresh/:field", BuildController.refreshField);

buildRoute.post("/project/:id/phases", BuildController.getPhases);

buildRoute.post("/phase/test", async (c) => {
	const body = await c.req.json();
	console.log(body);
	return c.text("ok");
});
// buildRoute.post("/:id/phase/edit", async (c) => {
// 	return c.text("ok");
// });
