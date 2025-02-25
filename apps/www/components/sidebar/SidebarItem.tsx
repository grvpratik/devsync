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
import { cn } from "www/lib/utils";

interface SidebarItemProps {
	item: {
		id: string;
		title: string;
		url: string;
	};
	onDelete: () => void;
	isDeleting: boolean;
}


const COLOR_CLASSES = [
	"bg-red-500",
	"bg-yellow-500",
	"bg-green-500",
	"bg-blue-500",
	"bg-indigo-500",
	"bg-pink-500",
	"bg-orange-500",
	"bg-purple-500",
	"bg-teal-500",
];

export function SidebarItem({ item, onDelete, isDeleting }: SidebarItemProps) {

	const getColorForId = (id: string) => {
	
		const charSum = id
			.split("")
			.reduce((sum, char) => sum + char.charCodeAt(0), 0);
	
		const colorIndex = charSum % COLOR_CLASSES.length;
		return COLOR_CLASSES[colorIndex];
	};

	const dotColorClass = getColorForId(item.id);

	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild>
				<a href={item.url} className="flex items-center gap-2">
					<div className={cn("size-2 rounded-full", dotColorClass)}></div>
					<span>{item.title}</span>
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
						className="text-red-500 flex justify-between items-center gap-2"
					>
						<span>Delete</span>
						<Trash2 className="w-4 h-4" />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
}
