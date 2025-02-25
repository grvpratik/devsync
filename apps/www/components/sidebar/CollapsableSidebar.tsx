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
	BoxesIcon,
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
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";

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
	return (
		<Collapsible defaultOpen className="group/collapsible">
			<SidebarGroup className="py-0">
				<SidebarGroupLabel
					className="font-normal text-sm text-sidebar-foreground"
					asChild
				>
					<CollapsibleTrigger className="flex gap-2 items-center">
						<BoxesIcon /> Projects
						<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
					</CollapsibleTrigger>
				</SidebarGroupLabel>
				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{activeProjects?.map((item) => (
								<SidebarMenuItem key={item.id || item.title}>
									<SidebarMenuButton
										className="text-sidebar-foreground/70"
										asChild
									>
										<a href={item.url}>
											{" "}
											<svg
												className="size-5 top-0 ml-2 text-inherit"
												viewBox="0 0 15 15"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<g strokeWidth={0} />
												<g strokeLinecap="round" strokeLinejoin="round" />
												<g id="SVGRepo_iconCarrier">
													<path
														fillRule="evenodd"
														clipRule="evenodd"
														d="M9.87737 12H9.9H11.5C11.7761 12 12 11.7761 12 11.5C12 11.2239 11.7761 11 11.5 11H9.9C8.77164 11 7.95545 10.9996 7.31352 10.9472C6.67744 10.8952 6.25662 10.7946 5.91103 10.6185C5.25247 10.283 4.71703 9.74753 4.38148 9.08897C4.20539 8.74338 4.10481 8.32256 4.05284 7.68648C4.00039 7.04455 4 6.22836 4 5.1V3.5C4 3.22386 3.77614 3 3.5 3C3.22386 3 3 3.22386 3 3.5V5.1V5.12263C3 6.22359 3 7.08052 3.05616 7.76791C3.11318 8.46584 3.23058 9.0329 3.49047 9.54296C3.9219 10.3897 4.61031 11.0781 5.45704 11.5095C5.9671 11.7694 6.53416 11.8868 7.23209 11.9438C7.91948 12 8.77641 12 9.87737 12Z"
														fill="currentColor"
													/>
												</g>
											</svg>
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
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>
	);
};

export default CollapsibleSidebar;
