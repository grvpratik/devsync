"use client";
import { Bird, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "../ui/sidebar";
import { SidebarItem } from "./SidebarItem";
import SideBarSearch from "../ui/search";
import { NavUser } from "../NavUser";
import { AppSidebarProps } from "www/types/sidebar.types";
import { FOOTER_MENU_ITEMS } from "www/lib/constant";
import { useAuth } from "www/wrapper/auth-provider";
import CollapsibleSidebar from "./CollapsableSidebar";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "www/components/ui/alert-dialog";
import { toast } from "www/hooks/use-toast";
import { api, isSuccess } from "www/lib/handler";

export function AppSidebar({ history, projectList }: AppSidebarProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [isDeleting, setIsDeleting] = useState<string | null>(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<{
		id: string;
		title: string;
		type: "project" | "history";
	} | null>(null);

	const { authState } = useAuth();
	const router = useRouter();

	const filteredItems = useMemo(
		() =>
			history?.filter((item) =>
				item.title.toLowerCase().includes(searchQuery.toLowerCase())
			),
		[history, searchQuery]
	);

	const handleEdit = (projectId: string) => {
		router.push(`/build/${projectId}`);
	};

	const handleDeleteClick = (
		item: { id: string; title: string },
		type: "project" | "history"
	) => {
		setItemToDelete({ ...item, type });
		setShowDeleteDialog(true);
	};

	const handleDeleteConfirm = async () => {
		if (!itemToDelete) return;

		try {
			setIsDeleting(itemToDelete.id);

			const endpoint =
				itemToDelete.type === "project" ?
					`/build/project/${itemToDelete.id}`
				:	`/build/project/${itemToDelete.id}`;

			const response = await api.delete(endpoint);
			if (isSuccess(response)) {
				toast({
					title: `${itemToDelete.type === "project" ? "Project" : "History item"} deleted`,
					description: `${itemToDelete.title} has been successfully deleted.`,
					variant: "default",
				});
				router.refresh();
			}
		} catch (error) {
			toast({
				title: "Error",
				description: `Failed to delete ${itemToDelete.type}. Please try again.`,
				variant: "destructive",
			});
			console.error("Delete error:", error);
		} finally {
			setIsDeleting(null);
			setShowDeleteDialog(false);
			setItemToDelete(null);
		}
	};

	return (
		<Sidebar variant="floating" className="overflow-hidden font-sans">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<div className="flex gap-2 items-center p-2">
							<div className="flex py-2 aspect-square size-5 items-center justify-center rounded-md">
								<Bird className="size-4" />
							</div>
							<span className="truncate font-semibold">BuildAi</span>
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SideBarSearch
								onSearchChange={setSearchQuery}
								value={searchQuery}
							/>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<CollapsibleSidebar
					activeProjects={projectList}
					onEdit={handleEdit}
					onDelete={(project) => handleDeleteClick(project, "project")}
					isDeleting={isDeleting}
				/>

				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarGroupLabel>Previous</SidebarGroupLabel>
							{filteredItems.length === 0 ?
								<div className="px-4 py-2 text-sm text-muted-foreground">
									No items found
								</div>
							:	filteredItems.map((item) => (
									<SidebarItem
										key={item.id}
										item={item}
										onDelete={() => handleDeleteClick(item, "history")}
										isDeleting={isDeleting === item.id}
									/>
								))
							}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarGroup>
				<SidebarGroupContent>
					<SidebarMenu>
						{FOOTER_MENU_ITEMS.map((item) => (
							<SidebarMenuItem key={item.name}>
								<SidebarMenuButton asChild>
									<a href={item.url}>
										<item.icon />
										<span>{item.name}</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>

			<NavUser user={authState.user} />

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete{" "}
							{itemToDelete?.type === "project" ?
								"the project"
							:	"the history item"}{" "}
							"{itemToDelete?.title}". This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							className="bg-red-500 hover:bg-red-600"
						>
							{isDeleting ?
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							:	"Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Sidebar>
	);
}
