import { Context, Next } from "hono";
import { sign, verify } from "hono/jwt";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { AuthError } from "./../middleware/error";

interface User {
	userId: string;
	email: string;
	name: string;
	image_url?: string;
}

// JWT token expiration time (7 days in seconds)
const TOKEN_EXPIRATION = 7 * 24 * 60 * 60;

export const checkAuth = async (c: Context, next: Next) => {
	const token = getCookie(c, "session_id");

	if (!token) {
		throw new AuthError("No authentication token found");
	}

	try {
		const payload = await verify(token, c.env.JWT_SECRET);

		if (!payload || !payload.userId) {
			deleteCookie(c, "session_id");
			throw new AuthError("Invalid authentication token");
		}

		const now = Math.floor(Date.now() / 1000);
		console.log(payload.exp,now,TOKEN_EXPIRATION)
		if (payload.exp && now > payload.exp) {
			console.log("expired")
		   deleteCookie(c,"session_id")
		   throw new AuthError('session expired')

		}



		c.set("userId", payload.userId);
		await next();
	} catch (error) {
		deleteCookie(c, "session_id");
		throw new AuthError("Session expired or invalid");
	}
};

export const getUserProfile = async (c: Context, next: Next) => {
	const token = getCookie(c, "session_id");

	if (!token) {
		throw new AuthError("No authentication token found");
	}

	try {
		const payload = await verify(token, c.env.JWT_SECRET);

		if (!payload || !payload.userId) {
			deleteCookie(c, "session_id");
			throw new AuthError("Invalid authentication token");
		}

		const userId = payload.userId;
		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });

		const user = await prisma.user.findUnique({
			where: {
				id: userId as string,
			},
		});

		if (!user) {
			deleteCookie(c, "session_id");
			throw new AuthError("User not found");
		}

		c.set("user", {
			userId: user.id,
			email: user.email,
			name: user.name,
			image_url: user.image_url,
		});

		await next();
	} catch (error) {
		deleteCookie(c, "session_id");
		throw new AuthError("Authentication failed");
	}
};

export const userRoutes = {
	handleInitialCallback: async (c: Context) => {
		try {
			const googleUser: any = c.get("user-google");
			const adapter = new PrismaD1(c.env.DB);
			const prisma = new PrismaClient({ adapter });

			// Create or update user in database
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

			// Create JWT payload with user info and expiration
			const now = Math.floor(Date.now() / 1000);
			const payload = {
				userId: user.id,
				email: user.email,
				name: user.name,
				picture: user.image_url,
				exp: now + TOKEN_EXPIRATION,
				iat: now,
			};

			// Sign JWT token
			const token = await sign(payload, c.env.JWT_SECRET);

			return c.redirect(
				`${c.env.FORNTEND_URL!}/auth/callback?token=${token}`,
				301
			);
		} catch (error) {
			console.error("Authentication error:", error);
			return c.json(
				{ success: false, error: { message: "Authentication failed" } },
				500
			);
		}
	},

	logout: async (c: Context) => {
		deleteCookie(c, "session_id");
		return c.json({ success: true });
	},

	validateSession: async (c: Context) => {
		const token = getCookie(c, "session_id");

		if (!token) {
			return c.json({ valid: false, reason: "no-session" });
		}

		try {
			const payload = await verify(token, c.env.JWT_SECRET);

			if (!payload || !payload.userId || !payload.exp) {
				deleteCookie(c, "session_id");
				return c.json({ valid: false, reason: "invalid-token" });
			}

			const now = Math.floor(Date.now() / 1000);

			return c.json({
				valid: true,
				expiresIn: payload.exp - now,
				user: {
					id: payload.userId,
					email: payload.email,
					name: payload.name,
					picture: payload.picture,
				},
			});
		} catch (error) {
			deleteCookie(c, "session_id");
			return c.json({ valid: false, reason: "expired" });
		}
	},

	getUserData: async (c: Context) => {
		const user = c.get("user");

		if (!user) {
			return c.json(
				{
					success: false,
					error: { message: "User not found" },
				},
				401
			);
		}

		return c.json(
			{
				success: true,
				result: {
					user: {
						name: user.name,
						email: user.email,
						picture: user.image_url,
					},
				},
			},
			200
		);
	},
};
