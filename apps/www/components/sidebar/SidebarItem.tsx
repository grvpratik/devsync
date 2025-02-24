import { MoreHorizontal, Loader2, Trash2 } from "lucide-react";
import {
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenuAction,
} from "../ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface SidebarItemProps {
	item: {
		id: string;
		title: string;
		url: string;
	};
	onDelete: () => void;
	isDeleting: boolean;
}

export function SidebarItem({ item, onDelete, isDeleting }: SidebarItemProps) {
	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild>
				<a href={item.url}>
				<div className=" size-2 rounded-full bg-blue-500"></div>	<span>{item.title}</span>
				</a>
			</SidebarMenuButton>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuAction>
						{isDeleting ?
							<Loader2 className="w-4 h-4 animate-spin" />
						:	<MoreHorizontal className="w-4 h-4" />}
					</SidebarMenuAction>
				</DropdownMenuTrigger>
				<DropdownMenuContent side="right" align="start" className="min-w-fit">
					<DropdownMenuItem
						onClick={onDelete}
						className="text-red-500 flex justify-between"
					>
						<span>Delete</span>
						<Trash2 className="size-2" />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
}
