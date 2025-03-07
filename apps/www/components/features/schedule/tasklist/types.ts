import { PhasesResponse } from "shared";

// Type definitions
export interface Task {
	id: string;
	name: string;
	desc: string;
	isCompleted: boolean;
	phaseId?: string;
	phaseName?: string;
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
	phases: PhasesResponse[];
	onPhaseChange?: (phase: PhasesResponse | null) => void;
	initialDate?: Date;
}

export type TabType = "today" | "pending" | "completed";

export interface DayInfo {
	date: Date;
	dayName: string;
	dayNumber: string;
}
