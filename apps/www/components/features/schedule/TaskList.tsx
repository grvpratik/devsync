"use client";
import React, { useState } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragOverlay,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Task } from "./ScheduleCal";
import SortableTask from "./SortableTask";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "www/components/ui/card";
import { Button } from "www/components/ui/button";
import { Input } from "www/components/ui/input";
import TaskFilter from "./TaskFilter";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "www/components/ui/select";

interface TaskListProps {
	tasks: Task[];
	onTasksReorder: (tasks: Task[]) => void;
	onAddTask: (text: string, category: string) => void;
	onDeleteTask: (taskId: string) => void;
}

const TaskList = ({ tasks, onTasksReorder, onAddTask, onDeleteTask }) => {
	const [newTaskText, setNewTaskText] = useState("");
	const [activeId, setActiveId] = useState(null);
	const [newTaskCategory, setNewTaskCategory] = useState("home");
	const [selectedCategory, setSelectedCategory] = useState("all");

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragStart = (event) => {
		setActiveId(event.active.id);
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;
		setActiveId(null);

		if (active.id !== over?.id) {
			const oldIndex = tasks.findIndex((task) => task.id === active.id);
			const newIndex = tasks.findIndex((task) => task.id === over.id);
			onTasksReorder(arrayMove(tasks, oldIndex, newIndex));
		}
	};

	const handleAddTask = (e) => {
		e.preventDefault();
		if (newTaskText.trim()) {
			onAddTask(newTaskText.trim(), newTaskCategory);
			setNewTaskText("");
		}
	};

	const activeTask = tasks.find((task) => task.id === activeId);
	const filteredTasks =
		selectedCategory === "all" ? tasks : (
			tasks.filter((task) => task.category === selectedCategory)
		);

	return (
		<Card className="bg-background border-border">
			<CardHeader>
				<CardTitle className="text-xl font-semibold">Tasks</CardTitle>
			</CardHeader>
			<CardContent>
				<TaskFilter
					selectedCategory={selectedCategory}
					onCategoryChange={setSelectedCategory}
				/>
				<div className="h-[calc(100vh-16rem)] overflow-y-auto pr-2">
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={filteredTasks}
							strategy={verticalListSortingStrategy}
						>
							<div className="space-y-2">
								{filteredTasks.map((task) => (
									<SortableTask
										key={task.id}
										task={task}
										onDelete={onDeleteTask}
									/>
								))}
							</div>
						</SortableContext>
						<DragOverlay>
							{activeId && activeTask ?
								<div className="bg-background border rounded-lg p-4 shadow-lg">
									{activeTask.text}
								</div>
							:	null}
						</DragOverlay>
					</DndContext>
				</div>

				<form onSubmit={handleAddTask} className="mt-4 space-y-4">
					<div className="flex gap-2">
						<Input
							type="text"
							value={newTaskText}
							onChange={(e) => setNewTaskText(e.target.value)}
							placeholder="Enter new task..."
							className="flex-1"
						/>
						<Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
							<SelectTrigger className="w-[140px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="home">Home</SelectItem>
								<SelectItem value="work">Work</SelectItem>
								<SelectItem value="personal">Personal</SelectItem>
							</SelectContent>
						</Select>
						<Button type="submit" className="gap-2">
							<Plus className="w-4 h-4" />
							Add Task
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default TaskList;
