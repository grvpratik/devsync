"use client";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { PhasesResponse, TaskResponse } from "shared";
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
import { Badge } from "www/components/ui/badge";
import { Button } from "www/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "www/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "www/components/ui/dialog";
import { Input } from "www/components/ui/input";
import { Label } from "www/components/ui/label";
import { Textarea } from "www/components/ui/textarea";
import { toast, useToast } from "www/hooks/use-toast";
import { api, isSuccess } from "www/lib/handler";

// Types
interface Task {
	id: string;
	name: string;
	desc: string;
	phaseId: string;
}


interface TaskCardProps {
	task: TaskResponse;
	onDelete: (task: TaskResponse) => void;
}

interface PhaseCardProps {
	phase: PhasesResponse;
	onTaskDelete: (taskIds: string[]) => Promise<void>;
	onTaskCreate: (phaseId: string, tasks: Omit<Task, "id">[]) => Promise<void>;
}

interface NewTask {
	name: string;
	desc: string;
}

const TaskCard = ({ task, onDelete }: TaskCardProps) => (
	<div className="flex items-start space-x-4 rounded-lg border p-4 hover:bg-accent hover:text-accent-foreground">
		<div className="flex-1">
			<p className="font-medium">{task.name}</p>
			{task.desc && (
				<p className="text-sm text-muted-foreground">{task.desc}</p>
			)}
		</div>
		<Button variant="ghost" size="icon" onClick={() => onDelete(task)}>
			<Trash2 className="h-4 w-4" />
		</Button>
	</div>
);

const PhaseCard = ({ phase, onTaskDelete, onTaskCreate }: PhaseCardProps) => {
	const { toast } = useToast();
	const [isCreating, setIsCreating] = useState(false);
	const [newTask, setNewTask] = useState<NewTask>({ name: "", desc: "" });
	const [deleteTask, setDeleteTask] = useState<TaskResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleCreateTask = async () => {
		if (!newTask.name.trim()) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Task name is required",
			});
			return;
		}

		setIsLoading(true);
		try {
			await onTaskCreate(phase.id, [
				{
					name: newTask.name,
					desc: newTask.desc,
					phaseId: phase.id,
				},
			]);
			setIsCreating(false);
			setNewTask({ name: "", desc: "" });
			// toast({
			// 	title: "Success",
			// 	description: "Task created successfully",
			// });
		} catch (error) {
			console.log(error,"TASK CREATION FAILED")
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to create task",
			});
		}
		setIsLoading(false);
	};

	const handleDeleteTask = async () => {
		if (!deleteTask) return;

		setIsLoading(true);
		try {
			await onTaskDelete([deleteTask.id]);
			setDeleteTask(null);
			// toast({
			// 	title: "Success",
			// 	description: "Task deleted successfully",
			// });
		} catch (error) {
			console.log(error,"TASK DELETE ERROR")
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to delete task",
			});
		}
		setIsLoading(false);
	};

	return (
		<>
			<Card className="w-full">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-lg font-semibold">
						{phase.name}
						<Badge variant="secondary" className="ml-2">
							{phase.tasks.length} Tasks
						</Badge>
					</CardTitle>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsCreating(true)}
					>
						<Plus className="h-4 w-4" />
					</Button>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{phase.tasks.map((task) => (
							<TaskCard
								key={task.id}
								task={task}
								onDelete={() => setDeleteTask(task)}
							/>
						))}
					</div>
				</CardContent>
			</Card>

			<Dialog open={isCreating} onOpenChange={setIsCreating}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Task</DialogTitle>
						<DialogDescription>
							Add a new task to {phase.name}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="name">Task Name</Label>
							<Input
								id="name"
								value={newTask.name}
								onChange={(e) =>
									setNewTask((prev) => ({ ...prev, name: e.target.value }))
								}
								placeholder="Enter task name"
							/>
						</div>
						<div>
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={newTask.desc}
								onChange={(e) =>
									setNewTask((prev) => ({ ...prev, desc: e.target.value }))
								}
								placeholder="Enter task description"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsCreating(false)}>
							Cancel
						</Button>
						<Button onClick={handleCreateTask} disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Create Task
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog open={!!deleteTask} onOpenChange={() => setDeleteTask(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Task</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this task? This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteTask}
							disabled={isLoading}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

interface TaskManagementProps {
	projectPhases: PhasesResponse[];
	id: string;
}

export default function TaskManagement({
	projectPhases = [],
	id,
}: TaskManagementProps) {
	const [phases, setPhases] = useState<PhasesResponse[]>(projectPhases);

	const handleTaskCreate = useCallback(
		async (phaseId: string, newTasks: Omit<Task, "id">[]) => {
			const response = await api.post(
				`/build/project/${id}/phases/batch`,
				newTasks
			);
			if (!isSuccess(response)) {
				toast({
					variant: "destructive",
					title: "Failed to create task",
					description: response.error.message,
				});
				return;
			}

			setPhases((prevPhases) =>
				prevPhases.map((phase) =>
					phase.id === phaseId ?
						{ ...phase, tasks: [...phase.tasks, ...newTasks] as TaskResponse[] }
					:	phase
				)
			);
		},
		[id]
	);

	const handleTaskDelete = useCallback(
		async (taskIds: string[]) => {
			const response = await api.delete(
				`/build/project/${id}/phases/batch`,
				taskIds
			);
			if (!isSuccess(response)) {
				toast({
					variant: "destructive",
					title: "Failed to delete task",
					description: response.error.message,
				});
				return;
			}
			toast({
				variant: "default",
				title: " deleted task",
				description: "successfully deleted task",
			});
			// Update local state
			setPhases((prevPhases) =>
				prevPhases.map((phase) => ({
					...phase,
					tasks: phase.tasks.filter((task) => !taskIds.includes(task.id)),
				}))
			);
		},
		[id]
	);

	return (
		<div className="p-2 max-w-7xl mx-auto">
			<h1 className="text-3xl font-bold mb-6">Project Phases</h1>
			<div className="flex flex-wrap gap-4">
				{phases.map((phase) => (
					<PhaseCard
						key={phase.id}
						phase={phase}
						onTaskDelete={handleTaskDelete}
						onTaskCreate={handleTaskCreate}
					/>
				))}
			</div>
		</div>
	);
}
