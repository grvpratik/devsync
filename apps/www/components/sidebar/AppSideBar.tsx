"use client";
import { Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
import { FOOTER_MENU_ITEMS } from "www/lib/constant";
import { api, isSuccess } from "www/lib/handler";
import { AppSidebarProps } from "www/types/sidebar.types";
import { useAuth } from "www/wrapper/auth-provider";
import { NavUser } from "../NavUser";
import SideBarSearch from "../ui/search";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "../ui/sidebar";
import CollapsibleSidebar from "./CollapsableSidebar";
import { SidebarItem } from "./SidebarItem";

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
	const pathname = usePathname();
	const homeRoute = pathname ? pathname === "/" : false;
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
		<Sidebar className="overflow-hidden  group-data-[side=left]:border-r-0 ">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="#">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className=" size-8"
										viewBox="0 0 768 768"
										fill="currentColor"
									>
										<path fill="currentColor" d="M269.6 265.2c.5.7.3.8-.5.4-2.4-1.5-7.1 1.6-10.8 7.3l-3.8 5.6-.3 103-.3 103 2.4 4.5c1.4 2.8 4.1 5.7 7.1 7.7l4.8 3.3h46.5c38.6 0 46.9-.2 49.2-1.4 3.7-2 8.9-7.9 9.8-11.4.5-1.5.8-21.6.8-44.7 0-46.4 0-46.8-6.2-53.6-5-5.5-10.5-6.9-26.7-6.9-13.6.1-18.9 1.2-22.8 4.7-4.2 3.7-5.1 7.2-5.6 21.3-.4 13-.3 13.6 2 17 5.6 8.3 19.8 5.3 19.8-4.2.1-9.4 9.2-13 15.6-6.1 2.4 2.6 2.4 2.9 2.4 22V456l-3.4 3.8-3.4 3.7-25.1.3c-28 .3-29.5 0-32.5-6.2-1.4-3.1-1.6-11.1-1.6-79 0-82.4-.1-81.5 5.5-83.6 1.5-.6 13.5-1 27.6-1 28.3 0 28.6.1 31.5 7.6 1.2 3.2 1.5 6.4 1.2 12.6-.4 8.5-2.1 12.8-5.6 14.4-.9.4-7.4 1-14.4 1.3-12.3.6-12.8.7-15.7 3.5-2.9 2.8-3.1 3.4-3.1 10.7 0 6.2.4 8.1 2.1 10.3 4 5.1 6.3 5.6 25.7 5.6 16.8 0 18.2-.1 22.3-2.3 2.9-1.6 5.4-4 7.4-7.2l3-4.9-.1-33.5c-.1-28.7-.3-34.1-1.7-36.7-2.2-4.2-9.5-10.7-11.3-10-.9.3-1.2.1-.9-.4.4-.7-15.4-1-45.5-1-34.6 0-45.9.3-45.4 1.2zM403.5 265.6c-3.5 1.9-8.4 7-9.6 10.1-.4 1.2-.9 17.4-1 36-.2 33-.2 33.9 1.9 38 1.3 2.5 4 5.5 6.4 7l4.1 2.8 33.3.5c31.8.5 33.4.6 36.1 2.6 5.3 3.9 5.4 5.1 4.7 51.9-.7 46.5-.6 46.1-6.3 48.4-1.9.8-10.5 1.1-27.5.9l-24.8-.3-3.4-3.7-3.4-3.8v-18.4c0-19.9.5-22.3 5-24.9 6.4-3.8 13-.2 13 7.2 0 7.9 8.4 12.5 15.8 8.7 5.1-2.7 6.2-6 6.2-19.3 0-13.7-.9-17.9-4.7-21.6-4.9-4.7-9.1-5.7-22.7-5.7-15.8 0-21.2 1.1-26.4 5.6-7.6 6.5-7.7 7.2-7.7 54.9 0 23.1.3 43.2.8 44.7.9 3.4 6.1 9.4 9.7 11.3 2.3 1.2 10.7 1.5 46.1 1.5h46.5c5 0 11.9-5.3 15-11.5l2.6-5.5-.4-101.7c-.4-95.8-.5-102-2.2-105.5-2-4.2-7.5-9.4-11.3-10.9-1.4-.5-22-.9-47.6-.9-38.9.1-45.6.3-48.2 1.6zm74.7 30.1c1.6 1.4 1.8 3.3 1.8 16.4 0 8.1-.3 15.4-.6 16.3-.5 1.4-4 1.6-28.3 1.6-29.7 0-30.7-.2-34.5-5.3-2.8-3.8-3.5-17.5-1.2-23.1.9-2.1 1.3-4.2 1-4.7-.3-.5.1-.6.9-.3s2-.2 2.7-1.1c1.1-1.3 5.2-1.5 28.8-1.5 24.2 0 27.8.2 29.4 1.7z" />
									</svg>
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-semibold">DevSync</span>
									<span className="">v1.0</span>
								</div>
							</a>
						</SidebarMenuButton>
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
				<SidebarGroup className="py-0">
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarGroupLabel>Main</SidebarGroupLabel>
							<SidebarMenuItem>
								<Link href={"/"}>
									<SidebarMenuButton isActive={homeRoute}>
										<Home /> Home
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<CollapsibleSidebar
					activeProjects={projectList}
					onEdit={handleEdit}
					onDelete={(project) => handleDeleteClick(project, "project")}
					isDeleting={isDeleting}
				/>

				<SidebarGroup className="mt-auto">
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
