// import crypto from "node:crypto";
// import { Context, Hono } from "hono";

import { GenerativeModel } from "@google/generative-ai";
import { googleAuth } from "@hono/oauth-providers/google";
import { Hono, Next } from "hono";

// export const user = new Hono();

// function generateJWT(payload, secret, expiresIn) {
// 	const header = { alg: "HS256", typ: "JWT" };
// 	const encodedHeader = base64UrlEncode(JSON.stringify(header));
// 	const encodedPayload = base64UrlEncode(payload);
// 	const signature = sign(`${encodedHeader}.${encodedPayload}`, secret);
// 	return `${encodedHeader}.${encodedPayload}.${signature}`;
// }

// function base64UrlEncode(str) {
// 	const base64 = btoa(str);
// 	return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
// }

// function sign(data, secret) {
// 	const key = parseKey(secret);
// 	const hmac = crypto.createHmac("sha256", key);
// 	hmac.update(data);
// 	const signature = hmac.digest("base64");
// 	return base64UrlEncode(signature);
// }

// function parseKey(key) {
// 	return crypto.createHash("sha256").update(key).digest();
// }

// function parseCookie(cookieHeader, cookieName) {
// 	if (!cookieHeader) return null;
// 	const cookies = cookieHeader.split(";");
// 	for (const cookie of cookies) {
// 		const [name, value] = cookie.split("=");
// 		if (name.trim() === cookieName) {
// 			return value.trim();
// 		}
// 	}
// 	return null;
// }

// function decodeJWT(token) {
// 	const [encodedHeader, encodedPayload] = token.split(".");
// 	const header = JSON.parse(base64UrlDecode(encodedHeader));
// 	const payload = JSON.parse(base64UrlDecode(encodedPayload));
// 	return { header, payload };
// }

// function base64UrlDecode(str) {
// 	const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
// 	const padding = base64.length % 4 === 0 ? 0 : 4 - (base64.length % 4);
// 	const paddedBase64 = base64 + "===".slice(0, padding);
// 	return atob(paddedBase64);
// }

// user.get("/auth/callback/google", async (c: Context) => {
// 	const code = new URL(c.req.raw.url).searchParams.get("code");
// 	if (!code) return;
// 	try {
// 		const tokenEndpoint = new URL("https://accounts.google.com/o/oauth2/token");
// 		tokenEndpoint.searchParams.set("code", code);
// 		tokenEndpoint.searchParams.set("grant_type", "authorization_code");
// 		// Get the Google Client ID from the env
// 		tokenEndpoint.searchParams.set("client_id", c.env.GOOGLE_CLIENT_ID);
// 		// Get the Google Secret from the env
// 		tokenEndpoint.searchParams.set("client_secret", c.env.GOOGLE_CLIENT_SECRET);
// 		// Add your own callback URL
// 		tokenEndpoint.searchParams.set("redirect_uri", c.env.GOOGLE_CALLBACK_URL);
// 		const tokenResponse = await fetch(
// 			tokenEndpoint.origin + tokenEndpoint.pathname,
// 			{
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "userlication/x-www-form-urlencoded",
// 				},
// 				body: tokenEndpoint.searchParams.toString(),
// 			}
// 		);
// 		const tokenData:any = await tokenResponse.json();
// 		// Get the access_token from the Token fetch response
// 		const accessToken = tokenData.access_token;
// 		const userInfoResponse = await fetch(
// 			"https://www.googleapis.com/oauth2/v2/userinfo",
// 			{
// 				headers: {
// 					Authorization: `Bearer ${accessToken}`,
// 				},
// 			}
// 		);
// 		// Get user info via that fetched access_token
// 		const userInfo = await userInfoResponse.json();
// 		// Destructure email, name, picture from the users' Google Account Info
// 		const { email, name, picture } = userInfo;
// 		const tokenPayload = JSON.stringify({ email, name, picture });
// 		// Create a Cookie for the payload, i.e. user info as above
// 		// Set the expiration to say 1 hour
// 		const cookie = generateJWT(tokenPayload, c.env.AUTH_SECRET, "1h");
// 		return new Response(null, {
// 			status: 302,
// 			headers: {
// 				Location: "/",
// 				// This is the key here, place the cookie in the browser
// 				"Set-Cookie": `custom_auth=${cookie}; Path=/; HttpOnly`,
// 			},
// 		});
// 	} catch (error) {
// 		console.error("Error fetching user info:", error);
// 	}
// });

// user.get("/auth/google", (c: Context) => {
// 	const authorizationUrl = new URL(
// 		"https://accounts.google.com/o/oauth2/v2/auth"
// 	);
// 	// Get the Google Client ID from the env
// 	authorizationUrl.searchParams.set("client_id", c.env.GOOGLE_CLIENT_ID);
// 	// Add your own callback URL
// 	authorizationUrl.searchParams.set("redirect_uri", c.env.GOOGLE_CALLBACK_URL);
// 	authorizationUrl.searchParams.set("prompt", "consent");
// 	authorizationUrl.searchParams.set("response_type", "code");
// 	authorizationUrl.searchParams.set("scope", "openid email profile");
// 	authorizationUrl.searchParams.set("access_type", "offline");
// 	// Redirect the user to Google Login
// 	return new Response(null, {
// 		status: 302,
// 		headers: {
// 			Location: authorizationUrl.toString(),
// 		},
// 	});
// });

// user.get("/", async (c: Context) => {
// 	// Get the cookie header in Hono
// 	const cookieHeader = c.req.raw.headers.get("Cookie");
// 	// Parse the custom_auth cookie to get the user auth values (if logged in)
// 	const cookie = parseCookie(cookieHeader, "custom_auth");
// 	if (cookie) {
// 		const decodedToken = decodeJWT(cookie);
// 		// Just for demonstration purposes
// 		if (decodedToken)
// 			return new Response(JSON.stringify(decodedToken), {
// 				headers: { "Content-Type": "userlication/json" },
// 			});
// 	}
// 	return new Response(JSON.stringify({}), {
// 		headers: { "Content-Type": "userlication/json" },
// 	});
// });

export const user = new Hono();

// user.use(
// 	"/auth/callback",
// 	googleAuth({
// 		client_id:
// 			"secret",
// 		client_secret: "s",
// 		scope: ["openid", "email", "profile"],
// 	})
// );

// user.get(
// 	"/auth/callback",
// 	(c) => {
// 		const token = c.get("token");
// 		const grantedScopes = c.get("granted-scopes");
// 		const user = c.get("user-google");
// console.log({
// 	token,
// 	grantedScopes,
// 	user,
// });

// 		return c.json({
// 			token,
// 			grantedScopes,
// 			user,
// 		});
// 	}
// );
import { Context } from "hono";
import { Prisma, PrismaClient } from "@prisma/client";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { PrismaD1 } from "@prisma/adapter-d1";

// Types
interface SessionUser {
	userId: string;
	email: string;
	name: string;
	image_url?: string;
}

// Lightweight middleware to check session without DB query
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

	// Only verify session exists, don't query DB
	await next();
};

// Context middleware to get user profile from DB
export const getUserProfile = async (c: Context, next: () => Promise<void>) => {
	const sessionId = getCookie(c, "session_id");
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
  console.log(sessionId,"sessionid")
	if (!sessionId) {
		return c.json({ status: "unauthenticated", user: null }, 401);
	}

	const user = await prisma.user.findUnique({
		where: {
			id: sessionId,
		},
	});
console.log(user)
	if (!user) {
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
// https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1#migration-workflows
// Route handlers

const checkSessionToken = async (c, next) => {
	const sessionToken = getCookie(c, "session_token");

	if (sessionToken) {
		try {
			// Verify the JWT token

			// Add user data to context
			// c.set("user", payload);
			// Skip OAuth flow if session is valid
			return c.redirect("http://localhost:3000/auth/callback"); // Or wherever you want to redirect authenticated users
		} catch (e) {
			// Token is invalid or expired, clear the cookie
			setCookie(c, "session_token", "", { maxAge: 0 });
		}
	}

	// Continue to OAuth flow if no valid session exists
	await next();
};
export const userRoutes = {
	// Check if user is trying to login again
	checkLoginStatus: async (c: Context, next: Next) => {
		const sessionId = getCookie(c, "session_id");

		if (sessionId) {
			return c.redirect("http://localhost:3000/auth/callback", 301);
		}
		// const adapter = new PrismaD1(c.env.DB);
		// const prisma = new PrismaClient({ adapter });
		// Quick session check without full profile
		// const session = await prisma.user.findUnique({
		// 	where: {
		// 		id: sessionId,
		// 	},
		// });

		// return c.json(
		// 	{
		// 		isLoggedIn: !!session,
		// 		redirectUrl: session ? "/auth/callback" : null,
		// 	},
		// 	200
		// );
		await next();
	},

	// Handle initial OAuth callback and session creation
	handleInitialCallback: async (c: Context) => {
		const googleUser: any = c.get("user-google");
		console.log(googleUser, "user");
		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });
		// Create or update user
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

		// Use user ID as session ID for better tracking
		const sessionId = user.id;
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		// // Create new session
		// await prisma.session.create({
		// 	data: {
		// 		id: sessionId,
		// 		userId: user.id,
		// 		expiresAt,
		// 	},
		// });

		setCookie(c, "session_id", sessionId, {
			httpOnly: true,
			secure: true,
			sameSite: "Lax",
			maxAge: 7 * 24 * 60 * 60,
		});

		return c.redirect("http://localhost:3000/auth/callback", 301);
	},

	// Verify session and return basic status
	verifySession: async (c: Context) => {
		const sessionId = getCookie(c, "session_id");

		if (!sessionId) {
			return c.json({ isValid: false }, 200);
		}
		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });
		const session = await prisma.user.findUnique({
			where: {
				id: sessionId,
			},
		});

		return c.json({ isValid: !!session }, 200);
	},

	// Get user data for authenticated user
	getUserData: async (c: Context) => {
		const user = c.get("user") as SessionUser;
console.log(user,"/data"
)
		if (!user) {
			return c.json({ user: null }, 401);
		}
		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });
		// Get fresh user data from DB
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

		return c.json({user:userData}, 200);
	},

	// Logout handler
	logout: async (c: Context) => {
		const sessionId = getCookie(c, "session_id");
		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });
		if (sessionId) {
			await prisma.user.delete({
				where: {
					id: sessionId,
				},
			});
			deleteCookie(c, "session_id");
		}

		return c.json({ success: true });
	},
};
console.log(process.env.GOOGLE_CLIENT_ID!);
console.log(process.env.GOOGLE_CLIENT_SECRET!);
// OAuth flow
user.use(
	"/auth/callback",
	checkSessionToken, // Check if already logged in
	googleAuth({
		client_id:
			"",
		client_secret: "",
		scope: ["openid", "email", "profile"],
	})
);

// Handle OAuth callback and session creation
user.get("/auth/callback", (c) => userRoutes.handleInitialCallback(c));

// Session verification endpoint
user.get("/auth/session", (c) => userRoutes.verifySession(c));

// Protected user data endpoint
user.get("/auth/data", getUserProfile, (c) => userRoutes.getUserData(c));
