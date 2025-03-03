

import { Hono, Next } from "hono";

import { googleAuth } from "@hono/oauth-providers/google";
import { Context } from "hono";
import { verify } from "hono/jwt";
import {  getUserProfile, userRoutes } from "../middleware/auth";

// Constants for session management

export const user = new Hono();

user.use(
	"/auth/callback",
	async (c: Context, next) => {
		// Check if user is already authenticated
		const authHeader = c.req.header("Authorization");
		if (authHeader && authHeader.startsWith("Bearer ")) {
			try {
				const token = authHeader.split(" ")[1];
				const payload = await verify(token, c.env.JWT_SECRET);
				if (payload) {
					return c.redirect(c.env.FRONTEND_URL);
				}
			} catch (error) {
				// Token invalid, continue to auth flow
			}
		}
		await next();
	},
	async (c: Context, next: Next) => {
		console.log("Starting Google Auth flow");
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
