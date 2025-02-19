import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { Context, Next } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

interface SessionUser {
	userId: string;
	email: string;
	name: string;
	image_url?: string;
}

interface SessionData {
	userId: string;
	createdAt: number;
	expiresAt: number;
	lastActivityAt: number;
	deviceInfo: {
		userAgent?: string;
		ip?: string;
	};
}
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds
const SESSION_REFRESH_THRESHOLD = 24 * 60 * 60; // 24 hours in seconds

function uuidValidate(uuid: string): boolean {
	const uuidRegex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return uuidRegex.test(uuid);
}

const SessionManager = {
	create: async (c: Context, userId: string) => {
		const sessionId = crypto.randomUUID();
		const now = Date.now();

		const deviceInfo = {
			userAgent: c.req.header("user-agent"),
			ip:
				c.req.header("x-forwarded-for") ||
				c.req.header("x-real-ip") ||
				c.req.header("cf-connecting-ip") ||
				"unknown",
		};
		// console.log("create ", deviceInfo);
		const sessionData: SessionData = {
			userId,
			createdAt: now,
			expiresAt: now + SESSION_DURATION * 1000,
			lastActivityAt: now,
			deviceInfo,
		};

		await c.env.SESSION_STORE.put(
			`session:${sessionId}`,
			JSON.stringify(sessionData),
			{ expirationTtl: SESSION_DURATION }
		);

		const userSessionsKey = `user_sessions:${userId}`;
		const existingSessions = await c.env.SESSION_STORE.get(userSessionsKey);
		const sessions = existingSessions ? JSON.parse(existingSessions) : [];
		sessions.push(sessionId);
		console.log({ sessions, sessionData, sessionId });
		await c.env.SESSION_STORE.put(userSessionsKey, JSON.stringify(sessions), {
			expirationTtl: SESSION_DURATION,
		});

		return sessionId;
	},

	get: async (c: Context, sessionId: string): Promise<SessionData | null> => {
		const data = await c.env.SESSION_STORE.get(`session:${sessionId}`);
		if (!data) return null;
		// console.log(data);
		const sessionData: SessionData = JSON.parse(data);
		const now = Date.now();

		// Check if session is expired
		if (now > sessionData.expiresAt) {
			await SessionManager.delete(c, sessionId);
			return null;
		}

		// Update last activity and extend session if needed
		if (now - sessionData.lastActivityAt > SESSION_REFRESH_THRESHOLD * 1000) {
			await SessionManager.refreshSession(c, sessionId, sessionData);
		}

		return sessionData;
	},

	refreshSession: async (
		c: Context,
		sessionId: string,
		sessionData: SessionData
	) => {
		const now = Date.now();
		const updatedSessionData: SessionData = {
			...sessionData,
			lastActivityAt: now,
			expiresAt: now + SESSION_DURATION * 1000,
		};

		await c.env.SESSION_STORE.put(
			`session:${sessionId}`,
			JSON.stringify(updatedSessionData),
			{ expirationTtl: SESSION_DURATION }
		);

		return updatedSessionData;
	},

	delete: async (c: Context, sessionId: string) => {
		const sessionData = await SessionManager.get(c, sessionId);
		if (sessionData) {
			await c.env.SESSION_STORE.delete(`session:${sessionId}`);

			const userSessionsKey = `user_sessions:${sessionData.userId}`;
			const sessionsJson = await c.env.SESSION_STORE.get(userSessionsKey);
			if (sessionsJson) {
				const sessions = JSON.parse(sessionsJson);
				const updatedSessions = sessions.filter(
					(id: string) => id !== sessionId
				);

				if (updatedSessions.length > 0) {
					await c.env.SESSION_STORE.put(
						userSessionsKey,
						JSON.stringify(updatedSessions),
						{ expirationTtl: SESSION_DURATION }
					);
				} else {
					await c.env.SESSION_STORE.delete(userSessionsKey);
				}
			}
		}
	},

	cleanupExpiredSessions: async (c: Context, userId: string) => {
		const sessions = await SessionManager.getUserSessions(c, userId);
		const now = Date.now();

		const expiredSessions = sessions.filter(
			(session) => now > session.expiresAt
		);
		await Promise.all(
			expiredSessions.map((session) =>
				SessionManager.delete(c, session.sessionId)
			)
		);

		return expiredSessions.length;
	},

	getUserSessions: async (
		c: Context,
		userId: string
	): Promise<(SessionData & { sessionId: string })[]> => {
		const userSessionsKey = `user_sessions:${userId}`;
		const sessionsJson = await c.env.SESSION_STORE.get(userSessionsKey);
		if (!sessionsJson) return [];

		const sessionIds = JSON.parse(sessionsJson);
		const sessions = await Promise.all(
			sessionIds.map(async (sessionId: string) => {
				const session = await SessionManager.get(c, sessionId);
				return session ? { ...session, sessionId } : null;
			})
		);

		return sessions.filter(
			(session): session is SessionData & { sessionId: string } =>
				session !== null
		);
	},

	deleteAllUserSessions: async (c: Context, userId: string) => {
		// Get the user's sessions list
		const userSessionsKey = `user_sessions:${userId}`;
		const sessionsJson = await c.env.SESSION_STORE.get(userSessionsKey);

		if (!sessionsJson) {
			return; // No sessions to delete
		}

		// Parse the sessions list
		const sessionIds = JSON.parse(sessionsJson);

		// Delete each session entry and the main sessions list
		const deletePromises = [
			// Delete individual session entries
			...sessionIds.map((sessionId: string) =>
				c.env.SESSION_STORE.delete(`session:${sessionId}`)
			),
			// Delete the user's sessions list
			c.env.SESSION_STORE.delete(userSessionsKey),
		];

		// Execute all deletions in parallel
		await Promise.all(deletePromises);
	},

	// Enhanced logout route to use deleteAllUserSessions
	logoutAll: async (c: Context) => {
		const sessionId = getCookie(c, "session_id");

		if (sessionId) {
			const sessionData = await SessionManager.get(c, sessionId);
			if (sessionData) {
				await SessionManager.deleteAllUserSessions(c, sessionData.userId);
			}
			deleteCookie(c, "session_id");
		}

		return c.json({ success: true });
	},
};

// Modified middleware to handle session validation
export const checkSession = async (c: Context, next: Next) => {
	const sessionId = getCookie(c, "session_id");
	console.log(sessionId, "build route");

	if (!sessionId) {
		return c.json(
			{
				status: "unauthenticated a",
				user: null,
			},
			401
		);
	}

	const sessionData = await SessionManager.get(c, sessionId);

	if (!sessionData) {
		deleteCookie(c, "session_id");
		return c.json(
			{
				success: false,
				user: null,
				error: {
					message: "unauthenticated b",
				},
			},
			401
		);
	}
	c.set("userId", sessionData.userId);
	await next();
};

export const getUserProfile = async (c: Context, next: Next) => {
	const sessionId = getCookie(c, "session_id");
	console.log(sessionId, "USER COOKIE");

	if (!sessionId) {
		return c.json({ status: "unauthenticated c", user: null }, 401);
	}

	// Get userId from KV store
	const sessionData = await SessionManager.get(c, sessionId);
	// console.log("getUserProfile()", sessionData);
	if (!sessionData) {
		deleteCookie(c, "session_id");
		return c.json({ status: "unauthenticated d", user: null }, 401);
	}
	const userId = sessionData.userId;
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
		return c.json({ status: "unauthenticated f", user: null }, 401);
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

		// Create new session without deleting existing ones
		const sessionId = await SessionManager.create(c, user.id);
		console.log("google cokkie session_id", sessionId);
		setCookie(c, "session_id", sessionId, {
			httpOnly: true,
			secure: true,
			sameSite: "Lax",
			maxAge: 7 * 24 * 60 * 60,
		});

		return c.redirect("http://localhost:3000/auth/callback", 301);
	},
	// Logout from specific device
	logoutSession: async (c: Context) => {
		const currentUser = c.get("userId");
		if (!currentUser) return c.json({ error: "Unauthorized" }, 401);

		const sessionIdToDelete = c.req.query("sessionId");
		const currentSessionId = getCookie(c, "session_id");

		// Validate sessionId format if provided
		if (sessionIdToDelete && !uuidValidate(sessionIdToDelete)) {
			return c.json({ error: "Invalid session ID" }, 400);
		}

		// Default to current session if none provided
		const targetSessionId = sessionIdToDelete || currentSessionId;
		if (!targetSessionId) return c.json({ error: "Session ID required" }, 400);

		// Verify session belongs to current user
		const sessionData = await SessionManager.get(c, targetSessionId);
		if (!sessionData || sessionData.userId !== currentUser) {
			return c.json({ error: "Forbidden" }, 403);
		}

		await SessionManager.delete(c, targetSessionId);

		// Clear cookie if deleting current session
		if (targetSessionId === currentSessionId) {
			deleteCookie(c, "session_id");
		}

		return c.json({ success: true });
	},
	// // Logout from all devices
	logoutAll: async (c: Context) => {
		const sessionId = getCookie(c, "session_id");
		if (sessionId) {
			const sessionData = await SessionManager.get(c, sessionId);
			if (sessionData) {
				await SessionManager.deleteAllUserSessions(c, sessionData.userId);
			}
			deleteCookie(c, "session_id");
		}
		return c.json({ success: true });
	},
	getSessions: async (c: Context) => {
		const sessionId = getCookie(c, "session_id");
		if (!sessionId) {
			return c.json({ sessions: [] }, 401);
		}

		const sessionData = await SessionManager.get(c, sessionId);
		if (!sessionData) {
			return c.json({ sessions: [] }, 401);
		}

		// Cleanup expired sessions before returning list
		await SessionManager.cleanupExpiredSessions(c, sessionData.userId);

		const sessions = await SessionManager.getUserSessions(
			c,
			sessionData.userId
		);
		return c.json({
			sessions: sessions.map((session) => ({
				deviceInfo: session.deviceInfo,
				createdAt: session.createdAt,
				lastActivityAt: session.lastActivityAt,
				expiresAt: session.expiresAt,
				isCurrentSession: sessionId === session.sessionId,
			})),
		});
	},
	validateSession: async (c: Context) => {
		const sessionId = getCookie(c, "session_id");
		// console.log("middleware validate session id", sessionId);
		if (!sessionId) {
			return c.json({ valid: false, reason: "no-session" });
		}

		const sessionData = await SessionManager.get(c, sessionId);
		// console.log(sessionData, "data validatefn");
		if (!sessionData) {
			deleteCookie(c, "session_id");
			return c.json({ valid: false, reason: "expired" });
		}

		const now = Date.now();
		return c.json(
			{
				valid: true,
				expiresIn: Math.floor((sessionData.expiresAt - now) / 1000),
				lastActivity: sessionData.lastActivityAt,
			},
			200
		);
	},
	getUserData: async (c: Context) => {
		const user = c.get("user");
		console.log(user, "user data");
		if (!user)
			return c.json(
				{
					sucess: false,
					message: "user not found",
				},
				401
			);
		return c.json(
			{
				success: true,
				user: { name: user.name, email: user.email, picture: user.image_url },
			},
			200
		);
	},
};
//for google signin
