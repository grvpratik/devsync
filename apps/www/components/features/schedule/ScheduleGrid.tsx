import { MetaData, PhasesResponse } from "shared";
import TaskManagement from "./BatchTask";
import MeetingCalendar from "./tasklist/TaskListCalendar";
import ProjectCard from "./ProjectCard";
import ProgressIndicator from "./ProgressIndicator";

interface ScheduleGrid {
	metadata: MetaData;
	phases: PhasesResponse[];
	id: string;
}

interface ProgressStats {
	completed: number;
	inProgress: number;
	upcoming: number;
}

function calculateProgressStats(phases: PhasesResponse[]): ProgressStats {
	// Initialize counts
	const stats: ProgressStats = {
		completed: 0,
		inProgress: 0,
		upcoming: 0,
	};

	// Get current date for determining in-progress vs upcoming
	const currentDate = new Date();

	// Process each phase
	phases.forEach((phase) => {
		const phaseStartDate = new Date(phase.startDate);
		const phaseEndDate = new Date(phase.endDate);
		const phaseIsActive =
			currentDate >= phaseStartDate && currentDate <= phaseEndDate;
		const phaseIsUpcoming = currentDate < phaseStartDate;

		// Process tasks in this phase
		phase.tasks.forEach((task) => {
			if (task.isCompleted) {
				stats.completed++;
			} else if (phaseIsActive) {
				stats.inProgress++;
			} else if (phaseIsUpcoming) {
				stats.upcoming++;
			} else {
				// Phase is past end date but task is not completed
				// Count as in-progress (overdue)
				stats.inProgress++;
			}
		});
	});

	return stats;
}
const ScheduleGrid = ({ metadata, phases, id }: ScheduleGrid) => {
	console.log(JSON.stringify(phases, null, 2));
	const state = calculateProgressStats(phases);
	return (
		<>
			{/* <div className=" grid w-full h-screen  grid-cols-1 grid-rows-6    lg:grid-cols-3 lg:grid-rows-2">
				<div className=" row-span-1 col-span-1">
					<ProjectCard />
				</div>
				<div className=" row-span-1 col-span-1">
					<ProgressIndicator title="progress" stats={stats} />
				</div>
				<div className=" row-span-2 col-span-1">
					<MeetingCalendar id={id} phases={phases} />
				</div>
				<div className=" row-span-1 col-span-1">
					<TaskManagement />
				</div>
				<div className=" row-span-1 col-span-1">calendar</div>
			</div> */}
			<div className=" flex flex-col ">
				<div className="flex w-full items-start lg:flex-row flex-col justify-center gap-4">
					<ProgressIndicator
						className="flex-1"
						title="progress"
						stats={state}
					/>

					<ProjectCard className="flex-1" metadata={metadata} />
				</div>
				<div className="flex items-start lg:flex-row flex-col justify-center gap-4">
					<TaskManagement projectPhases={phases} id={id} />
					<MeetingCalendar id={id} phases={phases} />
				</div>
			</div>
		</>
	);
};

export default ScheduleGrid;
