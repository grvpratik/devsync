import { SidebarProvider, SidebarTrigger } from "www/components/ui/sidebar";

import Nav from "www/components/features/landing/Nav";
import MainResponse from "shared/db/temp";
import { AppSidebar } from "www/components/sidebar/AppSideBar";
export interface SearchHistory {
	id: any;
	title: string;
	url: string;
}
const data = {
	user: {
		name: "pratik",
		email: "pratikgaurav37@gmail.com",
		avatar: "/profile/pratikgrv.jpg",
	},
};
const history: SearchHistory[] = MainResponse.map((data) => {
	return {
		id: data.id,
		title: data.title,
		url: `/build/${data.id}`,
	};
});
export const response = MainResponse;
export default function AiLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar user={data.user} history={history} />
			<main className=" w-full h-screen flex flex-col   ">
				<Nav />
				{children}
			</main>
		</SidebarProvider>
	);
}
