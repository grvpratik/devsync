import type React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "www/components/ui/card";
import { Progress } from "www/components/ui/progress";
import type { Phase } from "../../../types";

interface PhasesProps {
	phases: Phase[];
}

const Phases: React.FC<PhasesProps> = ({ phases }) => {
	return (
		<Card className="bg-background">
			<CardHeader>
				<CardTitle className="text-xl font-semibold">Project Phases</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{phases.length > 0 &&
						phases.map((phase) => {
							const completedTasks = phase.tasks.filter(
								(task) => task.completed
							).length;
							const progress = (completedTasks / phase.tasks.length) * 100;

							return (
								<div key={phase.name} className="space-y-2">
									<h3 className="font-medium">{phase.name}</h3>
									<Progress value={progress} className="w-full" />
									<p className="text-sm text-muted-foreground">
										{completedTasks} of {phase.tasks.length} tasks completed
									</p>
								</div>
							);
						})}
				</div>
			</CardContent>
		</Card>
	);
};

export default Phases;
