// auth-actions.ts
"use server";
import { cookies } from "next/headers";
export async function createSessionCookie(token: string) {
	"use server";
	console.log(token);
	(await cookies()).set("session_id", token);
	console.log((await cookies()).get("session"));
	return true;
}
