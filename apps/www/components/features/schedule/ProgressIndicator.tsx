import { Clock } from "lucide-react";
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "www/components/ui/card";
import { cn } from "www/lib/utils";

interface ProgressStats {
	inProgress: number;
	completed: number;
	upcoming: number;
}

interface ProgressIndicatorProps {
	title: string;
	stats: ProgressStats;
	className?: string;
	showLabels?: boolean;
}

const ProgressIndicator = ({
	title,
	stats,
	className,
	showLabels = true,
}: ProgressIndicatorProps) => {
	const total = useMemo(
		() => stats.inProgress + stats.completed + stats.upcoming,
		[stats]
	);

	const completionPercentage = useMemo(() => {
		if (total === 0) return 0;
		return Math.round((stats.completed / total) * 100);
	}, [stats.completed, total]);

	// Validate input data
	if (total < 0) {
		console.error("Invalid progress stats: negative values detected");
		return null;
	}

	const getSegmentWidth = (value: number) => {
		if (total === 0) return 0;
		return `${(value / total) * 100}%`;
	};

	return (
		<Card className={cn("w-full max-w-sm", className)}>
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center gap-2 text-2xl font-bold">
					<Clock className="h-5 w-5" /> {title}
				</CardTitle>
			</CardHeader>

			<CardContent className="pt-4">
				<div className="space-y-6">
					<div className="flex items-baseline space-x-2">
						<span className="text-4xl font-bold">{completionPercentage}%</span>
						<span className="text-sm text-muted-foreground">
							Total activity
						</span>
					</div>

					{/* Progress bar */}
					<div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
						<div
							className="bg-purple-500"
							style={{ width: getSegmentWidth(stats.inProgress) }}
							role="progressbar"
							aria-label="In progress"
						/>
						<div
							className="bg-green-500"
							style={{ width: getSegmentWidth(stats.completed) }}
							role="progressbar"
							aria-label="Completed"
						/>
						<div
							className="bg-orange-500"
							style={{ width: getSegmentWidth(stats.upcoming) }}
							role="progressbar"
							aria-label="Upcoming"
						/>
					</div>

					{/* Status indicators */}
					{showLabels && (
						<div className="grid grid-cols-3 gap-4">
							<StatusIndicator
								count={stats.inProgress}
								label="In progress"
								color="purple"
							/>
							<StatusIndicator
								count={stats.completed}
								label="Completed"
								color="green"
							/>
							<StatusIndicator
								count={stats.upcoming}
								label="Upcoming"
								color="orange"
							/>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

// Helper component for status indicators
interface StatusIndicatorProps {
	count: number;
	label: string;
	color: "purple" | "green" | "orange";
}

const StatusIndicator = React.memo(
	({ count, label, color }: StatusIndicatorProps) => {
		const colorClasses = {
			purple: "bg-purple-500",
			green: "bg-green-500",
			orange: "bg-orange-500",
		};

		return (
			<div className="flex flex-col items-center space-y-2">
				<div
					className={cn(
						"flex h-8 w-8 items-center justify-center rounded-full font-medium text-white",
						colorClasses[color]
					)}
				>
					{count}
				</div>
				<span className="text-sm text-muted-foreground">{label}</span>
			</div>
		);
	}
);

StatusIndicator.displayName = "StatusIndicator";

export default React.memo(ProgressIndicator);
