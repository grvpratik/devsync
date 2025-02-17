"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, Save, Loader2, Check } from "lucide-react";
// import { useToast } from "www/components/ui/use-toast";
import { Button } from "www/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "www/components/ui/card";
// import { Checkbox } from "www/components/ui/checkbox";
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
import { useToast } from "www/hooks/use-toast";

// Types
interface Task {
	id: string;
	name: string;
	desc: string;
	isCompleted: boolean;
	phaseId: string;
}

interface Phase {
	id: string;
	name: string;
	tasks: Task[];
}

// Loading Overlay Component
const LoadingOverlay = ({ message }: { message: string }) => (
	<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div className="bg-white p-4 rounded-lg flex items-center gap-2">
			<Loader2 className="h-4 w-4 animate-spin" />
			{message}
		</div>
	</div>
);

// Task Card Component
const TaskCard = ({
	phase,
	onTaskUpdate,
	onTaskDelete,
	onTaskCreate,
}: {
	phase: Phase;
	onTaskUpdate: (tasks: Task[]) => void;
	onTaskDelete: (taskIds: string[]) => void;
	onTaskCreate: (phaseId: string, tasks: Omit<Task, "id">[]) => void;
}) => {
	const { toast } = useToast();
	const [pendingChanges, setPendingChanges] = useState<{
		[key: string]: boolean;
	}>({});
	const [isCreating, setIsCreating] = useState(false);
	const [newTask, setNewTask] = useState<{ name: string; desc: string }>({
		name: "",
		desc: "",
	});
	const [deleteTask, setDeleteTask] = useState<Task | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleCheckboxChange = useCallback(
		(taskId: string, isCompleted: boolean) => {
			setPendingChanges((prev) => ({
				...prev,
				[taskId]: isCompleted,
			}));
		},
		[]
	);

	const savePendingChanges = useCallback(async () => {
		try {
			setIsLoading(true);
			const updatedTasks = phase.tasks.map((task) => ({
				...task,
				isCompleted: pendingChanges[task.id] ?? task.isCompleted,
			}));
			await onTaskUpdate(updatedTasks);
			setPendingChanges({});
			toast({
				title: "Changes saved",
				description: "Your tasks have been updated successfully.",
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to save changes. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	}, [phase.tasks, pendingChanges, onTaskUpdate, toast]);

	const handleCreateTask = useCallback(async () => {
		if (!newTask.name.trim()) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Task name is required.",
			});
			return;
		}

		try {
			setIsLoading(true);
			await onTaskCreate(phase.id, [
				{
					name: newTask.name,
					desc: newTask.desc,
					isCompleted: false,
					phaseId: phase.id,
				},
			]);
			setIsCreating(false);
			setNewTask({ name: "", desc: "" });
			toast({
				title: "Task created",
				description: "New task has been added successfully.",
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to create task. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	}, [newTask, phase.id, onTaskCreate, toast]);

	const handleDeleteTask = useCallback(async () => {
		if (!deleteTask) return;

		try {
			setIsLoading(true);
			await onTaskDelete([deleteTask.id]);
			setDeleteTask(null);
			toast({
				title: "Task deleted",
				description: "The task has been removed successfully.",
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to delete task. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	}, [deleteTask, onTaskDelete, toast]);

	return (
		<>
			<Card className="w-[350px]">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-lg font-semibold">{phase.name}</CardTitle>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsCreating(true)}
					>
						<Plus className="h-4 w-4" />
					</Button>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{phase.tasks.map((task) => (
							<div
								key={task.id}
								className="flex items-start space-x-4 rounded-lg border p-4 transition-colors hover:bg-accent"
							>
								{/* <Checkbox
									checked={pendingChanges[task.id] ?? task.isCompleted}
									onCheckedChange={(checked) =>
										handleCheckboxChange(task.id, checked as boolean)
									}
								/> */}
								<div className="flex-1 space-y-1">
									<p
										className={`${
											(pendingChanges[task.id] ?? task.isCompleted) ?
												"line-through text-muted-foreground"
											:	""
										}`}
									>
										{task.name}
									</p>
									{task.desc && (
										<p className="text-sm text-muted-foreground">{task.desc}</p>
									)}
								</div>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setDeleteTask(task)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>

					{Object.keys(pendingChanges).length > 0 && (
						<Button
							className="mt-4 w-full"
							onClick={savePendingChanges}
							disabled={isLoading}
						>
							{isLoading ?
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							:	<Save className="mr-2 h-4 w-4" />}
							Save Changes
						</Button>
					)}
				</CardContent>
			</Card>

			<Dialog open={isCreating} onOpenChange={setIsCreating}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Task</DialogTitle>
						<DialogDescription>
							Add a new task to the {phase.name} phase.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="space-y-2">
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
						<div className="space-y-2">
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
							{isLoading ?
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							:	<Check className="mr-2 h-4 w-4" />}
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
						<AlertDialogAction onClick={handleDeleteTask} disabled={isLoading}>
							{isLoading ?
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							:	<Trash2 className="mr-2 h-4 w-4" />}
							Delete Task
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{isLoading && <LoadingOverlay message="Processing..." />}
		</>
	);
};

// Main Component
export default function TaskManagement() {
	const [phases, setPhases] = useState<Phase[]>([
		{
			id: "phase1",
			name: "To Do",
			tasks: [
				{
					id: "task1",
					name: "Design new landing page",
					desc: "Create wireframes and mockups",
					isCompleted: false,
					phaseId: "phase1",
				},
			],
		},
		{
			id: "phase2",
			name: "In Progress",
			tasks: [
				{
					id: "task2",
					name: "Implement authentication",
					desc: "Add login and signup functionality",
					isCompleted: false,
					phaseId: "phase2",
				},
			],
		},
		{
			id: "phase3",
			name: "Done",
			tasks: [
				{
					id: "task3",
					name: "Setup project structure",
					desc: "Initialize repository and configure build tools",
					isCompleted: true,
					phaseId: "phase3",
				},
			],
		},
	]);

	const handleTaskUpdate = useCallback(
		async (phaseId: string, updatedTasks: Task[]) => {
			try {
				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 1000));

				setPhases((prevPhases) =>
					prevPhases.map((phase) =>
						phase.id === phaseId ? { ...phase, tasks: updatedTasks } : phase
					)
				);
			} catch (error) {
				throw new Error("Failed to update tasks");
			}
		},
		[]
	);

	const handleTaskCreate = useCallback(
		async (phaseId: string, newTasks: Omit<Task, "id">[]) => {
			try {
				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 1000));

				const createdTasks = newTasks.map((task) => ({
					...task,
					id: Math.random().toString(36).substr(2, 9),
				}));

				setPhases((prevPhases) =>
					prevPhases.map((phase) =>
						phase.id === phaseId ?
							{ ...phase, tasks: [...phase.tasks, ...createdTasks] }
						:	phase
					)
				);
			} catch (error) {
				throw new Error("Failed to create tasks");
			}
		},
		[]
	);

	const handleTaskDelete = useCallback(async (taskIds: string[]) => {
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setPhases((prevPhases) =>
				prevPhases.map((phase) => ({
					...phase,
					tasks: phase.tasks.filter((task) => !taskIds.includes(task.id)),
				}))
			);
		} catch (error) {
			throw new Error("Failed to delete tasks");
		}
	}, []);

	return (
		<div className="p-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{phases.map((phase) => (
					<TaskCard
						key={phase.id}
						phase={phase}
						onTaskUpdate={(tasks) => handleTaskUpdate(phase.id, tasks)}
						onTaskDelete={handleTaskDelete}
						onTaskCreate={handleTaskCreate}
					/>
				))}
			</div>
		</div>
	);
}
