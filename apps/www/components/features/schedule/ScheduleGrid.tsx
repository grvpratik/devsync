import { MetaData, PhasesResponse } from "shared";
import TaskManagement from "./BatchTask";
import MeetingCalendar from "./tasklist/TaskListCalendar";
import ProjectCard from "./ProjectCard";
import ProgressIndicator from "./ProgressIndicator";
const stats = {
	inProgress: 1,
	completed: 12,
	upcoming: 1,
};

interface ScheduleGrid {
	metadata: MetaData;
	phases: PhasesResponse[];
	id: string;
}
const ScheduleGrid = ({ metadata, phases, id }: ScheduleGrid) => {
	console.log(phases)
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
			<div className=" flex ">
				<ProgressIndicator title="progress" stats={stats} />

				<ProjectCard metadata={metadata} />
				<TaskManagement projectPhases={phases} id={id} />
				<MeetingCalendar id={id} phases={phases} />
			</div>
		</>
	);
};

export default ScheduleGrid;
