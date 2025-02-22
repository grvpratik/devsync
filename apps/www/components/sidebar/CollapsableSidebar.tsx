"use client";
import React, { useState } from "react";
import {
	ChevronDown,
	ChevronRight,
	MoreHorizontal,
	Folder,
	Loader2,
	Edit,
	Trash2,
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
import { SidebarProjects } from "www/app/(projects)/layout";

interface CollapsibleSidebarProps {
	activeProjects: SidebarProjects[];
	onEdit: (projectId: string) => void;
	onDelete: (project: SidebarProjects) => void;
	isDeleting: string | null;
}

const CollapsibleSidebar = ({
	activeProjects,
	onEdit,
	onDelete,
	isDeleting,
}: CollapsibleSidebarProps) => {
	const [isExpanded, setIsExpanded] = useState(true);

	return (
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
						{activeProjects?.map((item) => (
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
										className="min-w-fit"
									>
										<DropdownMenuItem
											className="flex justify-between"
											onClick={() => onEdit(item.id)}
										>
											<span>Edit</span>
											<Edit className="size-2" />
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => onDelete(item)}
											className="text-red-500 flex justify-between"
										>
											<span>Delete</span>
											<Trash2 className="size-2" />
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			)}
		</SidebarGroup>
	);
};

export default CollapsibleSidebar;
