'use server'
import { cookies } from "next/headers";

export  const getSessionCookie = async () => {
	const cookieStore = cookies();
	return (await cookieStore).get("session_id")?.value;
};
