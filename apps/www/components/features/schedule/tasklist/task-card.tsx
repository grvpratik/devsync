
import {
	Check,
	Clock,
} from "lucide-react";
import { Checkbox } from "www/components/ui/checkbox";
import { cn } from "www/lib/utils";
import { Task } from "./types";

// Component for rendering individual task
export const TaskCard: React.FC<{
	task: Task;
	isModified: boolean;
	effectiveStatus: boolean;
	onToggle: (taskId: string, currentStatus: boolean) => void;
}> = ({ task, isModified, effectiveStatus, onToggle }) => (
	<div className="flex items-start space-x-3 py-3 border-b border-border last:border-0">
		<div className="mt-1">
			<Checkbox
				checked={effectiveStatus}
				onCheckedChange={() => onToggle(task.id, effectiveStatus)}
				className={isModified ? "border-primary" : ""}
			/>
		</div>
		<div className="flex-1">
			<h4
				className={cn(
					"font-medium",
					effectiveStatus && "line-through text-muted-foreground"
				)}
			>
				{task.name}
				{isModified && (
					<span className="ml-2 text-xs text-primary font-normal">
						(Modified)
					</span>
				)}
			</h4>
			<p className="text-xs text-muted-foreground mt-1">{task.desc}</p>
			{task.phaseName && (
				<p className="text-xs text-primary mt-1">From: {task.phaseName}</p>
			)}
		</div>
		<div className="mt-1">
			{effectiveStatus ?
				<Check className="h-4 w-4 text-primary" />
			:	<Clock className="h-4 w-4 text-muted-foreground" />}
		</div>
	</div>
);
