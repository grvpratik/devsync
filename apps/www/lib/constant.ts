export const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API_URL;

export const MIN_HEIGHT = 48;
export const MAX_HEIGHT = 164;

export const PROJECT_TYPE = [
	{ name: "Personal Project", description: "Want to learn",disabled:true, },
	{ name: "Business idea", description: "want to build",disabled:false, },
];

export const AI_MODELS_LIST = [
	{ name: "GPT-4", description: "The popular kid", disabled: true },
	{ name: "Gemini", description: "Pretty new", disabled: false },
	{ name: "Claude", description: "Yes, the best for coding", disabled: true },
];

import {  PanelLeft, Settings } from "lucide-react";

export const MAIN_MENU_ITEMS = [
	{ name: "Projects", url: "/ai/projects", icon: PanelLeft},
];

export const FOOTER_MENU_ITEMS = [
	{ name: "Settings", url: "/settings", icon: Settings },
];
