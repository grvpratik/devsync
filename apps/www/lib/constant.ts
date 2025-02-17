export const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

export const MIN_HEIGHT = 48;
export const MAX_HEIGHT = 164;

export const PROJECT_TYPE = [
	{ name: "Personal Project", description: "Want to learn" },
	{ name: "Business idea", description: "want to build" },
];

export const AI_MODELS_LIST = [
	{ name: "GPT-4", description: "The popular kid" },
	{ name: "Gemini", description: "Pretty new" },
	{ name: "Claude", description: "Yes, the best for coding" },
];

export const RANDOM_COLORS = [
	"red",
	"yellow",
	"green",
	"blue",
	"indigo",
	"purple",
	"pink",
	"gray",
	"trueGray",
	"warmGray",
	"coolGray",
	"blueGray",
	"orange",
	"amber",
	"lime",
	"emerald",
	"teal",
	"cyan",
	"lightBlue",
	"violet",
	"fuchsia",
	"rose",
];

export const RANDOM_BG_COLORS = RANDOM_COLORS.map((color) => `bg-${color}-500`);

import { Folder, FolderOpen, PanelLeft, Settings } from "lucide-react";

export const MAIN_MENU_ITEMS = [
	{ name: "Projects", url: "/ai/projects", icon: PanelLeft},
];

export const FOOTER_MENU_ITEMS = [
	{ name: "Settings", url: "/settings", icon: Settings },
];
