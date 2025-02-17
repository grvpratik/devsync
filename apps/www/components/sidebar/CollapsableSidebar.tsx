import React, { useState } from "react";
import {
	ChevronDown,
	ChevronRight,
	MoreHorizontal,
	Folder,
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

const CollapsibleSidebar = ({ activeProjects }) => {
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
						{activeProjects &&
							activeProjects.map((item) => (
								<SidebarMenuItem key={item.name}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<Folder className="w-4 h-4" />
											<span>{item.name}</span>
										</a>
									</SidebarMenuButton>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<SidebarMenuAction>
												<MoreHorizontal className="w-4 h-4" />
											</SidebarMenuAction>
										</DropdownMenuTrigger>
										<DropdownMenuContent side="right" align="start">
											<DropdownMenuItem>
												<span>Edit Project</span>
											</DropdownMenuItem>
											<DropdownMenuItem>
												<span>Delete Project</span>
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
