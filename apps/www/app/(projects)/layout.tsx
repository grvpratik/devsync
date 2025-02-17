import { SidebarProvider } from "www/components/ui/sidebar";
import Nav from "www/components/features/landing/Nav";
import { AppSidebar } from "www/components/sidebar/AppSideBar";
import { getSessionCookie } from "www/hooks/use-server-session";
import { ApiService, isSuccess } from "www/lib/api";
import { projectEntrypointsSubscribe } from "next/dist/build/swc/generated-native";

export interface SearchHistory {
	id: any;
	title: string;
	url: string;
}

async function fetchProjects(session: string) {
	const result = await ApiService.getAllProjectsByUser(session);
	if (isSuccess(result)) {
		return result.result;
	}
	return [];
}

export default async function AiLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSessionCookie();

	let history: SearchHistory[] = [];
	let projects: any[] = [];

	const result = await fetchProjects(session!);
	history = result.map((project: any) => ({
		id: project.id,
		title: project.metadata.name ?? "Unnamed",
		url: `/build/${project.id}`,
	}));
	projects = result.filter((project: any) => project.phases !== null);
	const projectSidebar = projects.map((val) => {
		return {
			id: val.id,
			name: val.metadata.name ?? "Unnamed",
			url: `/build/${val.id}/schedule`,
		};
	});
	return (
		<SidebarProvider>
			{session && <AppSidebar history={history} projectList={projectSidebar} />}
			<main className="w-full h-screen flex flex-col">
				<Nav sidebar={true} />
				{children}
			</main>
		</SidebarProvider>
	);
}
