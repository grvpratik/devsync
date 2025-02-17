import { Hono, Next } from "hono";

import { Context } from "hono";
import { Prisma, PrismaClient } from "@prisma/client";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { PrismaD1 } from "@prisma/adapter-d1";
import { googleAuth } from "@hono/oauth-providers/google";
import { checkSession, getUserProfile, userRoutes } from "../middleware/auth";

// Constants for session management



export const user = new Hono();







user.use(
	"/auth/callback",
	async (c: Context, next) => {
		const sessionId = getCookie(c, "session_id");
		console.log("STEP 1 ->");
		console.log("session callback", sessionId);
		if (sessionId) {
			const userId = await c.env.SESSION_STORE.get(sessionId);
			console.log("userid", userId);
			if (userId) {
				return c.redirect("http://localhost:3000/");
			}
			deleteCookie(c, "session_id");
		}
		await next();
	},
	async (c: Context, next: Next) => {
		console.log("GOOGLE AUTH");
		return await googleAuth({
			client_id: c.env.GOOGLE_CLIENT_ID,
			client_secret: c.env.GOOGLE_CLIENT_SECRET,
			scope: ["openid", "email", "profile"],
		})(c, next);
	}
);
//for next js middleware to check user validitation
user.get("/auth/validate", userRoutes.validateSession);
//after success google auth it create db and session to set cookies
user.get("/auth/callback", userRoutes.handleInitialCallback);
//for context for frontent to get profile to show ui and hook
user.post("/auth/data", getUserProfile, userRoutes.getUserData);
//
user.get("/auth/sessions", checkSession, userRoutes.getSessions);
user.post("/auth/logout/session", checkSession, userRoutes.logoutSession);
user.post("/auth/logout/all", checkSession, userRoutes.logoutAll);
