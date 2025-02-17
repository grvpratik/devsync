import { LucideIcon } from "lucide-react";
import { SearchHistory } from "www/app/(projects)/layout";

export interface MenuItem {
	title: string;
	url: string;
	icon?: LucideIcon;
}

export interface User {
	name: string;
	email: string;
	avatar: string;
}

export interface AppSidebarProps {
	history: SearchHistory[];
	projectList:any
}
