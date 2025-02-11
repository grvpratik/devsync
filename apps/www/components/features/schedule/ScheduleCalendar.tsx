"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "www/components/ui/card";
import Calendar from "www/components/features/schedule/Calendar";
import TodoList from "www/components/features/schedule/TodoList";
import Phases from "www/components/features/schedule/Phases";
import type { Task, Phase } from "www/types";
import { useSidebar } from "www/components/ui/sidebar";
import { cn } from "www/lib/utils";

interface ScheduleCalendarProps {
	result: Phase[];
}

const selectedDateTasks: (date: Date, phases: Phase[]) => Phase | undefined = (
	date,
	phases
) => {
	const targetDate = new Date(date);
	console.log(targetDate,"fn")
	return phases.find((phase: Phase) => {
		const start = new Date(phase.start_date);
		const end = new Date(phase.end_date);
		return targetDate >= start && targetDate <= end;
	});
};

const ScheduleCalendar = ({ result }: ScheduleCalendarProps) => {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const { state } = useSidebar();

	const phases: Phase[] = result ?? [];

	const PhaseTasks: Phase | undefined = selectedDateTasks(date!, phases);
	console.log(date, phases, PhaseTasks, "pt");
	return (
		<main
			className={cn(
				"grid sm:grid-cols-2 md:grid-cols-3 gap-4 h-screen p-4",
				state === "collapsed" ? "md:grid-cols-3 " : "md:grid-cols-2 "
			)}
		>
			<Card className="bg-background ">
				<Calendar date={date} setDate={setDate} />
			</Card>
			<TodoList tasks={PhaseTasks?.tasks ?? []} date={date} />
			<Phases phases={phases} />
		</main>
	);
};

export default ScheduleCalendar;
