"use client";
import React, { useState, useEffect } from "react";
import { Button } from "www/components/ui/button";
import { Card, CardContent } from "www/components/ui/card";
import { Avatar, AvatarFallback } from "www/components/ui/avatar";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "www/components/ui/tabs";
import { Input } from "www/components/ui/input";
import { ChevronLeft, ChevronRight, Search, Check, Clock } from "lucide-react";
import {
	format,
	addDays,
	startOfWeek,
	isWithinInterval,
	parseISO,
} from "date-fns";

interface Task {
	name: string;
	id: string;
	desc: string;
	isCompleted: boolean;
	phaseId: string;
}

interface Phase {
	id: string;
	name: string;
	desc: string | null;
	startDate: string;
	endDate: string;
	projectId: string;
	tasks: Task[];
}

const WeekCalendar = () => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [searchQuery, setSearchQuery] = useState("");
	const [activePhases, setActivePhases] = useState<Phase[]>([]);
	const [activeTab, setActiveTab] = useState("today");

	// Sample phases data
	const phases: Phase[] = [
		{
			id: "f38250d1-1538-427c-a0c1-24bc1d42a533",
			name: "MVP",
			desc: "Minimum Viable Product phase",
			startDate: "2025-02-06T18:30:00.000Z",
			endDate: "2025-03-08T18:30:00.000Z",
			projectId: "86b2d538-be79-4b27-9f03-fe4161486b33",
			tasks: [
				{
					id: "task-1",
					name: "Design User Interface",
					desc: "Create wireframes and mockups for the main dashboard",
					isCompleted: true,
					phaseId: "f38250d1-1538-427c-a0c1-24bc1d42a533",
				},
				{
					id: "task-2",
					name: "Implement Authentication",
					desc: "Set up user login and registration flows",
					isCompleted: false,
					phaseId: "f38250d1-1538-427c-a0c1-24bc1d42a533",
				},
			],
		},
		{
			id: "a27150e2-2647-538d-b1d2-35bc2e53a644",
			name: "Beta Release",
			desc: "Beta testing phase with selected users",
			startDate: "2025-02-15T18:30:00.000Z",
			endDate: "2025-03-15T18:30:00.000Z",
			projectId: "86b2d538-be79-4b27-9f03-fe4161486b33",
			tasks: [
				{
					id: "task-3",
					name: "User Feedback Collection",
					desc: "Gather and analyze user feedback",
					isCompleted: false,
					phaseId: "a27150e2-2647-538d-b1d2-35bc2e53a644",
				},
				{
					id: "task-4",
					name: "Fix Critical Bugs",
					desc: "Address high-priority issues reported by beta testers",
					isCompleted: true,
					phaseId: "a27150e2-2647-538d-b1d2-35bc2e53a644",
				},
			],
		},
	];

	// Generate week days
	const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start from Monday
	const weekDays = Array.from({ length: 7 }).map((_, index) => {
		const date = addDays(startDate, index);
		return {
			date,
			dayName: format(date, "EEE"),
			dayNumber: format(date, "dd"),
		};
	});

	// Filter active phases based on selected date
	useEffect(() => {
		const filtered = phases.filter((phase) => {
			const phaseStart = parseISO(phase.startDate);
			const phaseEnd = parseISO(phase.endDate);

			// Check if selected date falls within the phase date range
			return isWithinInterval(selectedDate, {
				start: phaseStart,
				end: phaseEnd,
			});
		});

		setActivePhases(filtered);
	}, [selectedDate]);

	// Get all tasks from active phases
	const allTasks = activePhases.flatMap((phase) =>
		phase.tasks.map((task) => ({
			...task,
			phaseName: phase.name,
			phaseStartDate: phase.startDate,
			phaseEndDate: phase.endDate,
		}))
	);

	// Filter tasks based on search query
	const filteredTasks = allTasks.filter((task) => {
		if (!searchQuery) return true;

		return (
			task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			task.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
			task.phaseName.toLowerCase().includes(searchQuery.toLowerCase())
		);
	});

	// Group tasks by phase for Today view
	const tasksByPhase = filteredTasks.reduce(
		(acc, task) => {
			const phaseId = task.phaseId;
			if (!acc[phaseId]) {
				acc[phaseId] = {
					id: phaseId,
					name: task.phaseName,
					tasks: [],
				};
			}
			acc[phaseId].tasks.push(task);
			return acc;
		},
		{} as Record<
			string,
			{ id: string; name: string; tasks: typeof filteredTasks }
		>
	);

	// Get pending and completed tasks
	const pendingTasks = filteredTasks.filter((task) => !task.isCompleted);
	const completedTasks = filteredTasks.filter((task) => task.isCompleted);

	const isSelectedDay = (dayNumber: string) => {
		return format(selectedDate, "dd") === dayNumber;
	};

	const TaskCard = ({ task }: { task: (typeof filteredTasks)[0] }) => {
		return (
			<div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
				<div
					className={`mt-1 p-1 rounded-full ${task.isCompleted ? "bg-green-100" : "bg-gray-100"}`}
				>
					{task.isCompleted ?
						<Check className="h-4 w-4 text-green-600" />
					:	<Clock className="h-4 w-4 text-gray-500" />}
				</div>
				<div className="flex-1">
					<h4
						className={`font-medium ${task.isCompleted ? "line-through text-gray-500" : ""}`}
					>
						{task.name}
					</h4>
					<p className="text-xs text-gray-500 mt-1">{task.desc}</p>
				</div>
				<Button variant="ghost" size="icon" className="mt-1">
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		);
	};

	const PhaseTaskGroup = ({
		phaseId,
		phaseName,
		tasks,
	}: {
		phaseId: string;
		phaseName: string;
		tasks: typeof filteredTasks;
	}) => {
		return (
			<Card className="mb-4">
				<CardContent className="p-4">
					<div className="flex justify-between items-center mb-3">
						<h3 className="font-semibold text-purple-700">{phaseName}</h3>
						<span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
							{tasks.filter((t) => t.isCompleted).length}/{tasks.length}
						</span>
					</div>
					<div className="divide-y divide-gray-100">
						{tasks.map((task) => (
							<TaskCard key={task.id} task={task} />
						))}
					</div>
				</CardContent>
			</Card>
		);
	};

	const handlePrevWeek = () => {
		setSelectedDate((prevDate) => addDays(prevDate, -7));
	};

	const handleNextWeek = () => {
		setSelectedDate((prevDate) => addDays(prevDate, 7));
	};

	return (
		<div className="max-w-md mx-auto bg-white rounded-lg shadow-sm">
			<div className="p-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Schedule</h2>
					<Button variant="ghost" className="text-sm">
						See All
					</Button>
				</div>

				<div className="mb-6">
					<div className="flex justify-between items-center mb-4">
						<Button variant="ghost" size="icon" onClick={handlePrevWeek}>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<span className="font-medium">
							{format(selectedDate, "MMM, yyyy")}
						</span>
						<Button variant="ghost" size="icon" onClick={handleNextWeek}>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>

					<div className="grid grid-cols-7 gap-1">
						{weekDays.map(({ dayName, dayNumber, date }) => (
							<Button
								key={dayNumber}
								variant={isSelectedDay(dayNumber) ? "default" : "ghost"}
								className={`flex flex-col h-16 ${
									isSelectedDay(dayNumber) ?
										"bg-purple-600 hover:bg-purple-700"
									:	""
								}`}
								onClick={() => setSelectedDate(date)}
							>
								<span className="text-xs">{dayName}</span>
								<span className="text-lg">{dayNumber}</span>
							</Button>
						))}
					</div>
				</div>

				<div className="relative mb-4">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Search tasks..."
						className="pl-9"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-3 mb-4">
						<TabsTrigger value="today">Today</TabsTrigger>
						<TabsTrigger value="pending">Pending</TabsTrigger>
						<TabsTrigger value="completed">Completed</TabsTrigger>
					</TabsList>

					<TabsContent value="today" className="mt-0">
						{Object.values(tasksByPhase).length > 0 ?
							<div className="space-y-4">
								{Object.values(tasksByPhase).map(({ id, name, tasks }) => (
									<PhaseTaskGroup
										key={id}
										phaseId={id}
										phaseName={name}
										tasks={tasks}
									/>
								))}
							</div>
						:	<p className="text-center text-gray-500 py-4">
								No active tasks for {format(selectedDate, "MMMM d, yyyy")}
							</p>
						}
					</TabsContent>

					<TabsContent value="pending" className="mt-0">
						{pendingTasks.length > 0 ?
							<Card>
								<CardContent className="p-4">
									<div className="divide-y divide-gray-100">
										{pendingTasks.map((task) => (
											<TaskCard key={task.id} task={task} />
										))}
									</div>
								</CardContent>
							</Card>
						:	<p className="text-center text-gray-500 py-4">No pending tasks</p>}
					</TabsContent>

					<TabsContent value="completed" className="mt-0">
						{completedTasks.length > 0 ?
							<Card>
								<CardContent className="p-4">
									<div className="divide-y divide-gray-100">
										{completedTasks.map((task) => (
											<TaskCard key={task.id} task={task} />
										))}
									</div>
								</CardContent>
							</Card>
						:	<p className="text-center text-gray-500 py-4">
								No completed tasks
							</p>
						}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default WeekCalendar;
