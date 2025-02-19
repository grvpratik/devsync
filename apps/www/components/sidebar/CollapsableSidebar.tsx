"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ChevronDown,
	ChevronRight,
	MoreHorizontal,
	Folder,
	Loader2,
	Trash2,
	Edit2,
	Edit,
} from "lucide-react";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenuAction,
} from "www/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "www/components/ui/dropdown-menu";
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

import { SidebarProjects } from "www/app/(projects)/layout";
import { toast } from "www/hooks/use-toast";
import { api, isSuccess } from "www/lib/handler";

const CollapsibleSidebar = ({
	activeProjects,
}: {
	activeProjects: SidebarProjects[];
}) => {
	const [isExpanded, setIsExpanded] = useState(true);
	const [isDeleting, setIsDeleting] = useState<string | null>(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [projectToDelete, setProjectToDelete] =
		useState<SidebarProjects | null>(null);
	const router = useRouter();

	const handleEdit = (projectId: string) => {
		router.push(`/build/${projectId}`);
	};

	const handleDeleteClick = (project: SidebarProjects) => {
		setProjectToDelete(project);
		setShowDeleteDialog(true);
	};

	const handleDeleteConfirm = async () => {
		if (!projectToDelete) return;

		try {
			setIsDeleting(projectToDelete.id);

			const response = await api.delete(`/build/project/${projectToDelete.id}`);
			if (isSuccess(response)) {
				toast({
					title: "Project deleted",
					description: `${projectToDelete.title} has been successfully deleted.`,
					variant: "default",
				});
			}

			
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete project. Please try again.",
				variant: "destructive",
			});
			console.error("Delete error:", error);
		} finally {
			setIsDeleting(null);
			setShowDeleteDialog(false);
			setProjectToDelete(null);

		}
	};

	return (
		<>
			<SidebarGroup>
				<SidebarGroupLabel>
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="flex items-center w-full"
					>
						{isExpanded ?
							<ChevronDown className="w-4 h-4 mr-2" />
						:	<ChevronRight className="w-4 h-4 mr-2" />}
						Projects
					</button>
				</SidebarGroupLabel>

				{isExpanded && (
					<SidebarGroupContent>
						<SidebarMenu>
							{activeProjects &&
								activeProjects.map((item) => (
									<SidebarMenuItem key={item.id || item.title}>
										<SidebarMenuButton asChild>
											<a href={item.url}>
												<Folder className="w-4 h-4" />
												<span>{item.title}</span>
											</a>
										</SidebarMenuButton>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<SidebarMenuAction>
													{isDeleting === item.id ?
														<Loader2 className="w-4 h-4 animate-spin" />
													:	<MoreHorizontal className="w-4 h-4" />}
												</SidebarMenuAction>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												side="right"
												align="start"
												className=" min-w-fit"
											>
												<DropdownMenuItem
													className="flex  justify-between"
													onClick={() => handleEdit(item.id)}
												>
													<span>Edit</span>
													<Edit className=" size-2" />
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleDeleteClick(item)}
													className="text-red-500 flex justify-between "
												>
													<span>Delete </span>
													<Trash2 className=" size-2" />
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</SidebarMenuItem>
								))}
						</SidebarMenu>
					</SidebarGroupContent>
				)}
			</SidebarGroup>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the project "{projectToDelete?.title}
							". This action cannot be undone.
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
		</>
	);
};

export default CollapsibleSidebar;
