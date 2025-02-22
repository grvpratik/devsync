// Type definitions
export interface Task {
	id: string;
	name: string;
	desc: string;
	isCompleted: boolean;
}

export interface Phase {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	tasks: Task[];
}

export interface TaskUpdate {
	taskId: string;
	isCompleted: boolean;
}

export interface WeekCalendarProps {
	id: string;
	phases: Phase[];
	onPhaseChange?: (phase: Phase | null) => void;
	initialDate?: Date;
}

export type TabType = "today" | "pending" | "completed";

export interface DayInfo {
	date: Date;
	dayName: string;
	dayNumber: string;
}
