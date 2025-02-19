import { SidebarProvider } from "www/components/ui/sidebar";
import Nav from "www/components/features/landing/Nav";
import { AppSidebar } from "www/components/sidebar/AppSideBar";
import { getSessionCookie } from "www/hooks/use-server-session";

import { api } from "www/lib/handler";
import { IdeaValidationResponse, Phases } from "shared";

export interface SearchHistory {
	id: string;
	title: string;
	url: string;
}

interface ProjectReportResponse extends IdeaValidationResponse {
	id: string;
	phases?: Phases;
}
async function fetchProjects(session: string) {
	const result = await api.post<ProjectReportResponse[]>(
		"/build/project",
		{},
		{ session }
	);
	console.log(result);
	if (result.success) {
		return result.result || [];
	}

	console.error("Failed to fetch projects:", result.error?.message);
	return [];
}

export default async function AiLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSessionCookie();
	console.log(session, "layout");
	if (!session) {
		return (
			<SidebarProvider>
				<main className="w-full h-screen flex flex-col">
					<Nav sidebar={false} />
					{children}
				</main>
			</SidebarProvider>
		);
	}

	let history: SearchHistory[] = [];
	let projectSidebar: { id: string; name: string; url: string }[] = [];

	try {
		const projects = await fetchProjects(session);

		history = projects
			.filter((project: ProjectReportResponse) => project.phases === null)
			.map((project: ProjectReportResponse) => ({
				id: project.id,
				title: project.metadata.name ?? "Unnamed",
				url: `/build/${project.id}`,
			}));

		projectSidebar = projects
			.filter((project: ProjectReportResponse) => project.phases !== null)
			.map((project: ProjectReportResponse) => ({
				id: project.id,
				name: project.metadata.name ?? "Unnamed",
				url: `/build/${project.id}/schedule`,
			}));
	} catch (error) {
		console.error("Error fetching projects:", error);
		
	}

	return (
		<SidebarProvider>
			<AppSidebar history={history} projectList={projectSidebar} />
			<main className="w-full h-screen flex flex-col">
				<Nav sidebar={true} />
				{children}
			</main>
		</SidebarProvider>
	);
}
