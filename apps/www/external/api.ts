import { NEXT_PUBLIC_API } from "www/lib/constant";

export const api = {
	async get(url: string) {
		const res = await fetch(`${NEXT_PUBLIC_API}${url}`);
		return res.json();
	},
	
};
