"use client";
import React, { useState, useEffect, useMemo, JSX } from "react";
import { Button } from "www/components/ui/button";
import { Card, CardContent } from "www/components/ui/card";
import { Checkbox } from "www/components/ui/checkbox";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "www/components/ui/tabs";
import { Input } from "www/components/ui/input";
import {
	ChevronLeft,
	ChevronRight,
	Search,
	Check,
	Clock,
	Save,
	Loader2,
} from "lucide-react";
import {
	format,
	addDays,
	startOfWeek,
	parseISO,
	isValid,
	isBefore,
} from "date-fns";
import { toast } from "www/hooks/use-toast";
import { api, isSuccess } from "www/lib/handler";
import { cn } from "www/lib/utils"; // Assuming you have a utility for class name merging
import { DayInfo, Phase, TabType, Task, TaskUpdate, WeekCalendarProps } from "./types";
import { TaskCard } from "./task-card";


// Empty state component
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
	<p className="text-center text-muted-foreground py-4">{message}</p>
);

// Loading state component
const LoadingState: React.FC = () => (
	<div className="flex justify-center items-center py-8">
		<Loader2 className="h-8 w-8 animate-spin text-primary" />
	</div>
);

export const WeekCalendar: React.FC<WeekCalendarProps> = ({
	id,
	phases = [],
	onPhaseChange,
	initialDate,
}) => {
	// States
	const [selectedDate, setSelectedDate] = useState<Date>(
		initialDate || new Date()
	);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [activePhase, setActivePhase] = useState<Phase | null>(null);
	const [activePhaseIndex, setActivePhaseIndex] = useState<number>(-1);
	const [activeTab, setActiveTab] = useState<TabType>("today");
	const [modifiedTasks, setModifiedTasks] = useState<Record<string, boolean>>(
		{}
	);
	const [isInitializing, setIsInitializing] = useState<boolean>(true);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [allTasks, setAllTasks] = useState<Task[]>([]);

	// Derived state
	const hasChanges = Object.keys(modifiedTasks).length > 0;

	// Calculate week days
	const weekDays = useMemo<DayInfo[]>(() => {
		const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start from Monday
		return Array.from({ length: 7 }).map((_, index) => {
			const date = addDays(startDate, index);
			return {
				date,
				dayName: format(date, "EEE"),
				dayNumber: format(date, "dd"),
			};
		});
	}, [selectedDate]);

	
	useEffect(() => {
		setIsInitializing(true);

		
		
			try {
				let currentPhaseIndex = -1;
				const phase = phases.find((phase, index) => {
					if (!phase.startDate || !phase.endDate) return false;

					const phaseStart = parseISO(phase.startDate);
					const phaseEnd = parseISO(phase.endDate);

					if (!isValid(phaseStart) || !isValid(phaseEnd)) return false;

					const isActive =
						selectedDate >= phaseStart && selectedDate <= phaseEnd;
					if (isActive) {
						currentPhaseIndex = index;
					}
					return isActive;
				});

				setActivePhase(phase || null);
				setActivePhaseIndex(currentPhaseIndex);

				// Prepare all tasks with phase information
				const allRelevantTasks: Task[] = [];
				phases.forEach((p, index) => {
					// Only include tasks from current phase and earlier phases
					if (currentPhaseIndex >= 0 && index <= currentPhaseIndex) {
						const tasksWithPhaseInfo = p.tasks.map((task) => ({
							...task,
							phaseId: p.id,
							phaseName: p.name,
						}));
						allRelevantTasks.push(...tasksWithPhaseInfo);
					}
				});

				setAllTasks(allRelevantTasks);

				if (onPhaseChange) {
					onPhaseChange(phase || null);
				}
				setModifiedTasks({});
			} catch (error) {
				console.error("Error finding active phase:", error);
				toast({
					title: "Error",
					description: "Failed to determine active phase",
					variant: "destructive",
				});
			} finally {
				setIsInitializing(false);
			}
		

		
	}, [selectedDate, phases, onPhaseChange]);

	// Filter tasks based on search query
	const filteredTasks = useMemo(() => {
		if (!activePhase?.tasks?.length) return [];

		return activePhase.tasks.filter(
			(task) =>
				task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				task.desc.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [activePhase, searchQuery]);

	// Filter all tasks based on search query
	const filteredAllTasks = useMemo(() => {
		if (!allTasks.length) return [];

		return allTasks.filter(
			(task) =>
				task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				task.desc.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [allTasks, searchQuery]);

	// Get pending and completed tasks
	const pendingTasks = useMemo(
		() =>
			filteredTasks.filter((task) =>
				modifiedTasks.hasOwnProperty(task.id) ?
					!modifiedTasks[task.id]
				:	!task.isCompleted
			),
		[filteredTasks, modifiedTasks]
	);

	const completedTasks = useMemo(
		() =>
			filteredTasks.filter((task) =>
				modifiedTasks.hasOwnProperty(task.id) ?
					modifiedTasks[task.id]
				:	task.isCompleted
			),
		[filteredTasks, modifiedTasks]
	);

	// Get all pending and completed tasks from current and previous phases
	const allPendingTasks = useMemo(
		() =>
			filteredAllTasks.filter((task) =>
				modifiedTasks.hasOwnProperty(task.id) ?
					!modifiedTasks[task.id]
				:	!task.isCompleted
			),
		[filteredAllTasks, modifiedTasks]
	);

	const allCompletedTasks = useMemo(
		() =>
			filteredAllTasks.filter((task) =>
				modifiedTasks.hasOwnProperty(task.id) ?
					modifiedTasks[task.id]
				:	task.isCompleted
			),
		[filteredAllTasks, modifiedTasks]
	);

	// Handler functions
	const handleTaskToggle = (taskId: string, currentStatus: boolean): void => {
		setModifiedTasks((prev) => ({
			...prev,
			[taskId]: !currentStatus,
		}));
	};

	const saveChanges = async (): Promise<void> => {
		if (Object.keys(modifiedTasks).length === 0) return;

		setIsSaving(true);
		try {
			
			const updates: TaskUpdate[] = Object.entries(modifiedTasks).map(
				([taskId, isCompleted]) => ({
					taskId,
					isCompleted,
				})
			);

			const result = await api.patch(
				`/build/project/${id}/phases/batch`,
				updates
			);
			if (!isSuccess(result)) {
				toast({
					title: "Error",
					description: result.error.message || "Failed to save changes",
					variant: "destructive",
				});
				return;
			}

			// Clear modified tasks after successful save
			setModifiedTasks({});
			toast({
				title: "Changes saved",
				description: `Updated ${updates.length} task(s)`,
			});
		} catch (error) {
			console.error("Failed to save changes", error);
			toast({
				title: "Error",
				description: "Failed to save changes. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSaving(false);
		}
	};

	const handlePrevWeek = (): void => {
		setSelectedDate((prevDate) => addDays(prevDate, -7));
	};

	const handleNextWeek = (): void => {
		setSelectedDate((prevDate) => addDays(prevDate, 7));
	};

	const isSelectedDay = (dayNumber: string): boolean => {
		return format(selectedDate, "dd") === dayNumber;
	};

	// Render helper functions
	const renderTaskList = (tasks: Task[]): JSX.Element => {
		if (tasks.length === 0) {
			return (
				<EmptyState
					message={
						activeTab === "today" ?
							`No tasks for ${format(selectedDate, "MMMM d, yyyy")}`
						:	`No ${activeTab} tasks`
					}
				/>
			);
		}

		return (
			<Card>
				<CardContent className="p-4">
					<div className="divide-y divide-border">
						{tasks.map((task) => {
							const isModified = modifiedTasks.hasOwnProperty(task.id);
							const effectiveStatus =
								isModified ? modifiedTasks[task.id] : task.isCompleted;

							return (
								<TaskCard
									key={task.id}
									task={task}
									isModified={isModified}
									effectiveStatus={effectiveStatus}
									onToggle={handleTaskToggle}
								/>
							);
						})}
					</div>
				</CardContent>
			</Card>
		);
	};

	
	return (
		<div className="max-w-md mx-auto bg-background text-foreground rounded-lg shadow-sm">
			<div className="p-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Schedule</h2>
					<Button variant="ghost" className="text-sm">
						See All
					</Button>
				</div>

			
				<div className="mb-6">
					<div className="flex justify-between items-center mb-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={handlePrevWeek}
							aria-label="Previous week"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<span className="font-medium">
							{format(selectedDate, "MMM, yyyy")}
						</span>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleNextWeek}
							aria-label="Next week"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>

					<div className="grid grid-cols-7 gap-1">
						{weekDays.map(({ dayName, dayNumber, date }) => (
							<Button
								key={dayNumber}
								variant={isSelectedDay(dayNumber) ? "default" : "ghost"}
								className={cn(
									"flex flex-col h-16",
									isSelectedDay(dayNumber) &&
										"bg-primary text-primary-foreground hover:bg-primary/90"
								)}
								onClick={() => setSelectedDate(date)}
								aria-label={format(date, "EEEE, MMMM d, yyyy")}
							>
								<span className="text-xs">{dayName}</span>
								<span className="text-lg">{dayNumber}</span>
							</Button>
						))}
					</div>
				</div>

				
				<div className="min-h-[300px]">
					
					{isInitializing && <LoadingState />}

					
					{!isInitializing && !activePhase && (
						<EmptyState
							message={`No active phase for ${format(selectedDate, "MMMM d, yyyy")}`}
						/>
					)}

					
					{!isInitializing && activePhase && (
						<>
							<div className="mb-4">
								<h3 className="font-semibold text-primary">
									{activePhase.name}
								</h3>
								<p className="text-sm text-muted-foreground">
									{format(parseISO(activePhase.startDate), "MMM d")} -{" "}
									{format(parseISO(activePhase.endDate), "MMM d, yyyy")}
								</p>
							</div>

							<div className="relative mb-4">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search tasks..."
									className="pl-9"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									aria-label="Search tasks"
								/>
							</div>

							
							{hasChanges && (
								<div className="mb-4 flex justify-end">
									<Button
										onClick={saveChanges}
										disabled={isSaving}
										className="bg-primary text-primary-foreground hover:bg-primary/90"
										aria-label="Save changes"
									>
										{isSaving ?
											<span className="flex items-center">
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Saving...
											</span>
										:	<span className="flex items-center">
												<Save className="mr-2 h-4 w-4" />
												Save Changes ({Object.keys(modifiedTasks).length})
											</span>
										}
									</Button>
								</div>
							)}

							
							<Tabs
								value={activeTab}
								onValueChange={(value) => setActiveTab(value as TabType)}
								className="w-full"
							>
								<TabsList className="grid w-full grid-cols-3 mb-4">
									<TabsTrigger value="today">Today</TabsTrigger>
									<TabsTrigger value="pending">All Pending</TabsTrigger>
									<TabsTrigger value="completed">All Completed</TabsTrigger>
								</TabsList>

								<TabsContent value="today" className="mt-0">
									{renderTaskList(filteredTasks)}
								</TabsContent>

								<TabsContent value="pending" className="mt-0">
									{renderTaskList(allPendingTasks)}
								</TabsContent>

								<TabsContent value="completed" className="mt-0">
									{renderTaskList(allCompletedTasks)}
								</TabsContent>
							</Tabs>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default WeekCalendar;
