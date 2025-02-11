import type React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "www/components/ui/card";
import { Badge } from "www/components/ui/badge";
import type { Task } from "www/types";

interface TodoListProps {
	tasks: Task[] | [];
	date: Date | undefined;
}

const TodoList: React.FC<TodoListProps> = ({ tasks, date }) => {
	// const incompleteTasks = tasks.filter((task) => !task.completed && task.date < new Date())

	return (
		<Card className="bg-background">
			<CardHeader>
				<CardTitle className="text-xl font-semibold">
					Todo List for {date ? date.toLocaleDateString() : "Today"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
					{tasks.length === 0 ?
						<div className="text-center text-muted-foreground py-8">
							No tasks for this day
						</div>
					:	tasks.map((task) => (
							<div
								key={task.id}
								className="flex items-center gap-3 bg-card hover:bg-accent/50 rounded-lg p-3 border border-border transition-colors"
							>
								<input
									type="checkbox"
									checked={task.completed}
									onChange={() => {
										
										/* Add toggle completion logic */
									}}
									className="w-4 h-4 rounded-full border-2 border-primary/50 checked:bg-primary checked:border-transparent focus:ring-0 focus:ring-offset-0"
								/>
								<div className="flex-1">
									<div className="text-foreground">{task.title}</div>
									<div className="flex items-center gap-2 mt-1">
										<Badge
											className={`bg-${task.priority}-500/10 text-${task.priority}-500 font-medium`}
										>
											{task.priority}
										</Badge>
									</div>
								</div>
							</div>
						))
					}
				</div>
			</CardContent>
		</Card>
	);
};

export default TodoList;
