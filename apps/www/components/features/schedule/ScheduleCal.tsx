// "use client";
// import React from "react";
// import { Calendar } from "www/components/ui/calendar";
// import {
// 	Card,
// 	CardHeader,
// 	CardTitle,
// 	CardContent,
// } from "www/components/ui/card";
// import { Badge } from "www/components/ui/badge";
// import TaskList from "./TaskList";
// import { response } from "www/app/(ai)/layout";
// export type Task = {
// 	id: string;
// 	text: string;
// 	completed: boolean;
// 	category: "home" | "work" | "personal";
// 	date: Date;
// };

// const categoryColors: Record<Task["category"], string> = {
// 	home: "bg-blue-500/10 text-blue-500",
// 	work: "bg-purple-500/10 text-purple-500",
// 	personal: "bg-green-500/10 text-green-500",
// };

// const scheduleData = response.filter((data) => data.id === 1);
// console.log(scheduleData);
// const ScheduleCalendar = () => {
// 	const [date, setDate] = React.useState<Date | undefined>(new Date());
// 	console.log(date);

// 	const phases = scheduleData[0].phases;

// 	console.log(scheduleData[0].schedule);
// 	console.log(scheduleData[0].phases, "phase");

// 	function findPhaseByDate(date: Date) {
// 		const targetDate = new Date(date);
// 		return phases.find((phase) => {
// 			const start = new Date(phase.start_date);
// 			const end = new Date(phase.end_date);
// 			return targetDate >= start && targetDate <= end;
// 		});
// 	}
// 	console.log(date);
// 	console.log(findPhaseByDate(date!));
// 	// Get all phases within a date range
// 	function getPhasesByDateRange(startDate: Date, endDate: Date) {
// 		const start = new Date(startDate);
// 		const end = new Date(endDate);

// 		return phases.filter((phase) => {
// 			const phaseStart = new Date(phase.start_date);
// 			const phaseEnd = new Date(phase.end_date);
// 			return phaseStart <= end && phaseEnd >= start;
// 		});
// 	}

// 	// Get all tasks within a date range
// 	function getTasksByDateRange(startDate: Date, endDate: Date) {
// 		const relevantPhases = getPhasesByDateRange(startDate, endDate);
// 		return relevantPhases.flatMap((phase) => phase.tasks);
// 	}

// 	// Sort phases by date
// 	function getSortedPhases() {
// 		return [...phases].sort(
// 			(a, b) =>
// 				new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
// 		);
// 	}

// 	const [tasks, setTasks] = React.useState<Task[]>([
// 		{
// 			id: "1",
// 			text: "bring garbage out",
// 			completed: false,
// 			category: "home",
// 			date: new Date(),
// 		},
// 		{
// 			id: "3",
// 			text: "bring garbage out",
// 			completed: false,
// 			category: "home",
// 			date: new Date(),
// 		},
// 		{
// 			id: "4",
// 			text: "bring garbage out",
// 			completed: false,
// 			category: "home",
// 			date: new Date(),
// 		},
// 		{
// 			id: "5",
// 			text: "bring garbage out",
// 			completed: false,
// 			category: "home",
// 			date: new Date(),
// 		},
// 		{
// 			id: "6",
// 			text: "bring garbage out",
// 			completed: false,
// 			category: "home",
// 			date: new Date(),
// 		},
// 	]);

// 	// const handleTasksReorder = (newTasks: Task[]) => {
// 	// 	setTasks(newTasks);
// 	// };

// 	// const addTask = (text: string, category: Task["category"]) => {
// 	// 	if (!date) return;
// 	// 	setTasks([
// 	// 		...tasks,
// 	// 		{
// 	// 			id: Date.now().toString(),
// 	// 			text,
// 	// 			completed: false,
// 	// 			category,
// 	// 			date: date,
// 	// 		},
// 	// 	]);
// 	// };

// 	// const deleteTask = (taskId: string) => {
// 	// 	setTasks(tasks.filter((task: Task) => task.id !== taskId));
// 	// };

// 	// const selectedDateTasks = tasks.filter(
// 	// 	(task) => date && task.date.toDateString() === date.toDateString()
// 	// );

// 	const incompleteTasks = tasks.filter(
// 		(task) =>
// 			!task.completed &&
// 			task.date < new Date() &&
// 			task.date.toDateString() !== date?.toDateString()
// 	);

// 	return (
// 		<main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-screen p-4">
// 			<Card className="bg-background">
// 				<CardContent className="p-4">
// 					<Calendar
// 						disabled={{ before: new Date() }}
// 						mode="single"
// 						selected={date}
// 						onSelect={setDate}
// 						className="rounded-md"
// 					/>
// 				</CardContent>
// 			</Card>
// 			<div>
// 				<h1>task list</h1>
// 				{findPhaseByDate(date!)!.tasks.map((val, i) => {
// 					return <div key={val.id}>{val.title}</div>;
// 				})}
// 			</div>
// 			{/* <TaskList
// 				tasks={selectedDateTasks}
// 				onTasksReorder={handleTasksReorder}
// 				onAddTask={addTask}
// 				onDeleteTask={deleteTask}
// 			/> */}
// 			{phases.map((val) => {
// 				return (
// 					<Card key={val.name}>
// 						<CardTitle>{val.name}</CardTitle>
// 						<CardContent>
// 							{val.tasks.map((res) => {
// 								return (
// 									<div key={res.id}>
// 										{" "}
// 										<h1>{res.title}</h1>
// 										<div>{res.desc}</div>{" "}
// 									</div>
// 								);
// 							})}
// 						</CardContent>
// 					</Card>
// 				);
// 			})}
// 			<Card className="bg-background">
// 				<CardHeader>
// 					<CardTitle className="text-xl font-semibold flex items-center gap-2">
// 						Overdue Tasks
// 						{incompleteTasks.length > 0 && (
// 							<Badge variant="destructive" className="rounded-full">
// 								{incompleteTasks.length}
// 							</Badge>
// 						)}
// 					</CardTitle>
// 				</CardHeader>
// 				<CardContent>
// 					<div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
// 						{incompleteTasks.length === 0 ?
// 							<div className="text-center text-muted-foreground py-8">
// 								No overdue tasks
// 							</div>
// 						:	incompleteTasks.map((task) => (
// 								<div
// 									key={task.id}
// 									className="flex items-center gap-3 bg-card hover:bg-accent/50 rounded-lg p-3 border border-border transition-colors"
// 								>
// 									<input
// 										type="checkbox"
// 										className="w-4 h-4 rounded-full border-2 border-primary/50 checked:bg-primary checked:border-transparent focus:ring-0 focus:ring-offset-0"
// 									/>
// 									<div className="flex-1">
// 										<div className="text-foreground">{task.text}</div>
// 										<div className="flex items-center gap-2 mt-1">
// 											<Badge
// 												className={`${categoryColors[task.category]} font-medium`}
// 											>
// 												{task.category}
// 											</Badge>
// 											<span className="text-sm text-muted-foreground">
// 												Due: {task.date.toLocaleDateString()}
// 											</span>
// 										</div>
// 									</div>
// 								</div>
// 							))
// 						}
// 					</div>
// 				</CardContent>
// 			</Card>
// 		</main>
// 	);
// };

// export default ScheduleCalendar;
