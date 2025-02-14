import { Hono } from "hono";
import { checkSession } from "../middleware/auth";
import { BuildController } from "../controller/build.contoller";

export const buildRoute = new Hono();

// buildRoute.use("*", checkSession);

buildRoute.post("/search", BuildController.getSearch);


buildRoute.post("/:id",BuildController.getReportById);


// buildRoute.post("/:id/edit/market", );

// buildRoute.post("/:id/edit/feature", async (c) => {
// 	return c.text("ok");
// });

buildRoute.post("/:id/refresh/:field",BuildController.refreshField);

buildRoute.post("/:id/phase",BuildController.getPhases);

// buildRoute.post("/:id/phase/edit", async (c) => {
// 	return c.text("ok");
// });
