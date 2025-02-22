import { NEXT_PUBLIC_API } from "./constant";

export const getGoogleUrl = () => {
	// const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

	// const options = {
	// 	redirect_uri: `${process.env.NEXT_PUBLIC_API}/user/auth/callback`,
	// 	client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
	// 	access_type: "offline",
	// 	response_type: "code",
	// 	prompt: "consent",
	// 	scope: [
	// 		"https://www.googleapis.com/auth/userinfo.profile",
	// 		"https://www.googleapis.com/auth/userinfo.email",
	// 	].join(" "),
	// };

	//  return `${rootUrl}?${new URLSearchParams(options)}`;
    return `${NEXT_PUBLIC_API}/user/auth/callback`
};
