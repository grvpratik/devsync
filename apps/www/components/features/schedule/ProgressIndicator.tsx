import React, { useMemo } from "react";
import { Card, CardContent, CardHeader } from "www/components/ui/card";


interface ProgressStats {
	inProgress: number;
	completed: number;
	upcoming: number;
}

interface ProgressIndicatorProps {
    title:string;
	stats: ProgressStats;
	className?: string;
	showLabels?: boolean;
}

const ProgressIndicator = ({
    title,
	stats,
	className = "",
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
		<Card className={`w-full max-w-sm ${className}`}>
           
                <CardHeader className="p-4">{title}</CardHeader>
          
			<CardContent className="pt-6">
				<div className="space-y-6">
					{/* Header with percentage */}
					<div className="flex items-baseline space-x-2">
						<span className="text-4xl font-bold">{completionPercentage}%</span>
						<span className="text-sm text-gray-500">Total activity</span>
					</div>

					{/* Progress bar */}
					<div className="h-2 w-full flex rounded-full overflow-hidden">
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
					className={`w-8 h-8 rounded-full ${colorClasses[color]} flex items-center justify-center text-white font-medium`}
				>
					{count}
				</div>
				<span className="text-sm text-gray-600">{label}</span>
			</div>
		);
	}
);

StatusIndicator.displayName = "StatusIndicator";

export default React.memo(ProgressIndicator);
