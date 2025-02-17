import { SidebarProvider, SidebarTrigger } from "www/components/ui/sidebar";

import Nav from "www/components/features/landing/Nav";
import { AppSidebar } from "www/components/sidebar/AppSideBar";
import { getSessionCookie } from "www/hooks/use-server-session";
import { ApiService, isSuccess } from "www/external/api";
export interface SearchHistory {
	id: any;
	title: string;
	url: string;
}


export default async function AiLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSessionCookie();
	const result = await ApiService.getAllProjectsByUser(session!);
	console.log(result, "ALL");
	const response =  await ApiService.getAllProjectsByUser(session!);

	let history: SearchHistory[] = [];
	if (isSuccess(response)) {
		console.log("✅ Data:", response.result);
		history = result.result.map((idx) => {
		return {
			id: idx.id,
			title: idx.metadata.name ?? "Unnamed",
			url: `/build/${idx.id}`,
		};
	});
	} else {
		console.error("❌ Error:", response.error.message);
	}
	
	return (
		<SidebarProvider>
			<AppSidebar history={history} />
			<main className=" w-full h-screen flex flex-col   ">
				<Nav />
				{children}
			</main>
		</SidebarProvider>
	);
}
