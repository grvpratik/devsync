
import { googleAuth } from "@hono/oauth-providers/google";
import { Hono, Next , Context} from "hono";

import {  PrismaClient } from "@prisma/client";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { PrismaD1 } from "@prisma/adapter-d1";


export const user = new Hono();

interface SessionUser {
	userId: string;
	email: string;
	name: string;
	image_url?: string;
}


export const checkSession = async (c: Context, next: () => Promise<void>) => {
	const sessionId = getCookie(c, "session_id");

	if (!sessionId) {
		return c.json(
			{
				status: "unauthenticated",
				user: null,
			},
			401
		);
	}


	const userId = await c.env.SESSION_STORE.get(sessionId);
	if (!userId) {
		deleteCookie(c, "session_id");
		return c.json(
			{
				status: "unauthenticated",
				user: null,
			},
			401
		);
	}

	await next();
};


export const getUserProfile = async (c: Context, next: () => Promise<void>) => {
	const sessionId = getCookie(c, "session_id");

	if (!sessionId) {
		return c.json({ status: "unauthenticated", user: null }, 401);
	}

	// Get userId from KV store
	const userId = await c.env.SESSION_STORE.get(sessionId);
	if (!userId) {
		deleteCookie(c, "session_id");
		return c.json({ status: "unauthenticated", user: null }, 401);
	}

	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });

	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		
		await c.env.SESSION_STORE.delete(sessionId);
		deleteCookie(c, "session_id");
		return c.json({ status: "unauthenticated", user: null }, 401);
	}

	c.set("user", {
		userId: user.id,
		email: user.email,
		name: user.name,
		image_url: user.image_url,
	});

	await next();
};

export const userRoutes = {
	checkLoginStatus: async (c: Context, next: Next) => {
		const sessionId = getCookie(c, "session_id");

		if (sessionId) {
			const userId = await c.env.SESSION_STORE.get(sessionId);
			if (userId) {
				return c.redirect("http://localhost:3000/auth/callback", 301);
			}
			
			deleteCookie(c, "session_id");
		}

		await next();
	},

	handleInitialCallback: async (c: Context) => {
		const googleUser: any = c.get("user-google");
		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });

		const user = await prisma.user.upsert({
			where: {
				email: googleUser.email,
			},
			update: {
				name: googleUser.name,
				image_url: googleUser.picture,
			},
			create: {
				email: googleUser.email,
				name: googleUser.name,
				image_url: googleUser.picture,
			},
		});

	
		const sessionId = crypto.randomUUID();

	
		await c.env.SESSION_STORE.put(sessionId, user.id, {
			expirationTtl: 7 * 24 * 60 * 60, // 7 days 
		});

		setCookie(c, "session_id", sessionId, {
			httpOnly: true,
			secure: true,
			sameSite: "Lax",
			maxAge: 7 * 24 * 60 * 60,
		});

		return c.redirect("http://localhost:3000/auth/callback", 301);
	},

	verifySession: async (c: Context) => {
		const sessionId = getCookie(c, "session_id");

		if (!sessionId) {
			return c.json({ isValid: false }, 200);
		}

		const userId = await c.env.SESSION_STORE.get(sessionId);
		return c.json({ isValid: !!userId }, 200);
	},

	getUserData: async (c: Context) => {
		const user = c.get("user") as SessionUser;

		if (!user) {
			return c.json({ user: null }, 401);
		}

		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });

		const userData = await prisma.user.findUnique({
			where: {
				id: user.userId,
			},
			select: {
				id: true,
				email: true,
				name: true,
				image_url: true,
			},
		});

		return c.json({ user: userData }, 200);
	},

	logout: async (c: Context) => {
		const sessionId = getCookie(c, "session_id");

		if (sessionId) {
			
			await c.env.SESSION_STORE.delete(sessionId);
			deleteCookie(c, "session_id");
		}

		return c.json({ success: true });
	},
};


user.use(
	"/auth/callback",
	async (c:Context, next) => {
		const sessionId = getCookie(c, "session_id");
		if (sessionId) {
			const userId = await c.env.SESSION_STORE.get(sessionId);
			if (userId) {
				return c.redirect("http://localhost:3000/auth/callback");
			}
			deleteCookie(c, "session_id");
		}
		await next();
	},
	googleAuth({
		client_id: '',
		client_secret:'' ,
		scope: ["openid", "email", "profile"],
	})
);

user.get("/auth/callback", (c) => userRoutes.handleInitialCallback(c));
user.get("/auth/session", (c) => userRoutes.verifySession(c));
user.get("/auth/data", getUserProfile, (c) => userRoutes.getUserData(c));
