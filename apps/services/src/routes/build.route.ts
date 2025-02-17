import { Hono } from "hono";
import { checkSession } from "../middleware/auth";
import { BuildController } from "../controller/build.contoller";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { Context } from "hono";

export const buildRoute = new Hono();

//buildRoute.use("*", checkSession);

buildRoute.post("/search", BuildController.getSearch);

buildRoute.post("/project/:id", BuildController.getReportById);

buildRoute.delete("/project/:id", BuildController.getReportById);

buildRoute.post("/project", BuildController.getAllUserReport);



// buildRoute.post("/:id/edit/market", );

// buildRoute.post("/:id/edit/feature", async (c) => {
// 	return c.text("ok");
// });

buildRoute.post("/project/:id/refresh/:field", BuildController.refreshField);

buildRoute.post("/project/:id/phases", BuildController.getPhases);

buildRoute.post("/project/:id/phases/batch", BuildController.batchCreateTasks);

buildRoute.patch("/project/:id/phases/batch", BuildController.batchUpdateTasks);

buildRoute.delete("/project/:id/phases/batch", BuildController.batchDeleteTasks);

buildRoute.post("/phase/test", async (c:Context) => {
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });

	// const body = await c.req.json();
	const result = await prisma.phases.findMany();
	// console.log(body);
	console.log(result);
	return c.json({ result });
});
// buildRoute.post("/:id/phase/edit", async (c) => {
// 	return c.text("ok");
// });
