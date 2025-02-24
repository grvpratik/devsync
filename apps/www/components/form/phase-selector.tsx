"use client";

import { useState, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon, Divide, LoaderCircle } from "lucide-react";
import { Button } from "www/components/ui/button";
import { Input } from "www/components/ui/input";
import { Label } from "www/components/ui/label";
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from "www/components/ui/popover";
import { Calendar } from "www/components/ui/calendar";
import { cn } from "www/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { ApiService } from "www/lib/api";
import { ScrollArea } from "www/components/ui/scroll-area";

// Types
export interface DateRange {
	from: Date | undefined;
	to: Date | undefined;
}

export interface DateRangeItem {
	name: string;
	description: string;
	start_date: Date;
	end_date: Date;
	content?: any[];
}

interface Props {
	id: string;
	initialSuggestions?: string[];
	onSubmitSuccess?: () => void;
	onSubmitError?: (error: string) => void;
}

// Subcomponents for better organization
const DateRangeInput = ({
	currentDateRange,
	setCurrentDateRange,
	disabledDates,
}: {
	currentDateRange: DateRange | undefined;
	setCurrentDateRange: (range: DateRange | undefined) => void;
	disabledDates: DateRange[];
}) => (
	<div className="flex-1 space-y-2">
		<Label className="">Date Range</Label>
		<Popover modal={true}>
			<PopoverTrigger asChild>
				<Button
					id="date"
					variant="outline"
					className={cn(
						"w-full justify-start text-left font-normal",
						!currentDateRange && "text-muted-foreground"
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{currentDateRange?.from ?
						currentDateRange.to ?
							<>
								{format(currentDateRange.from, "LLL dd, y")} -{" "}
								{format(currentDateRange.to, "LLL dd, y")}
							</>
						:	format(currentDateRange.from, "LLL dd, y")
					:	<span>Pick a date range</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="min-w-fit p-0" align="end">
				<Calendar
					className="w-full  rounded-md"
					initialFocus
					mode="range"
					defaultMonth={currentDateRange?.from}
					selected={currentDateRange}
					onSelect={(range) =>
						setCurrentDateRange(
							range ?
								{ from: range.from, to: range.to ?? undefined }
							:	undefined
						)
					}
					numberOfMonths={1}
					disabled={disabledDates}
				/>
			</PopoverContent>
		</Popover>
	</div>
);

const DateRangeList = ({
	dateRanges,
	onRemove,
}: {
	dateRanges: DateRangeItem[];
	onRemove: (index: number) => void;
}) => (
	<div className="space-y-4 my-6">
		<h3 className="font-semibold text-lg">Selected Date Ranges</h3>
		{dateRanges.length === 0 ?
			<div className="text-muted-foreground text-sm italic p-4 text-center bg-muted/50 rounded-md">
				No date ranges selected yet
			</div>
		:	<div className="space-y-3">
				{dateRanges.map((range, index) => (
					<div
						key={`${range.name}-${range.start_date}`}
						className="flex justify-between items-center bg-muted/80 p-4 rounded-lg hover:bg-muted transition-colors"
					>
						<div className="space-y-1">
							<h4 className="font-medium text-sm">{range.name}</h4>
							<p className="text-sm text-muted-foreground">
								{format(range.start_date, "LLL dd, y")} -{" "}
								{format(range.end_date, "LLL dd, y")}
							</p>
						</div>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => onRemove(index)}
							className="ml-4 hover:bg-destructive/90"
						>
							Remove
						</Button>
					</div>
				))}
			</div>
		}
	</div>
);

// Main component
export function MultiDateRangeSelector({
	id,
	initialSuggestions = [
		"planning",
		"setup",
		"mvp",
		"auth",
		"db",
		"deployment",
		"launch",
		"marketing",
	],
	onSubmitSuccess,
	onSubmitError,
}: Props) {
	const [dateRanges, setDateRanges] = useState<DateRangeItem[]>([]);
	const [currentName, setCurrentName] = useState("");
	const [currentDesc, setCurrentDesc] = useState("");
	const [currentDateRange, setCurrentDateRange] = useState<DateRange>();
	const [suggestions, setSuggestions] = useState(initialSuggestions);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();
	const pathname = usePathname();

	// Memoized disabled dates
	const disabledDateRanges = useMemo(
		() =>
			dateRanges.map((date) => ({
				from: date.start_date,
				to: date.end_date,
			})),
		[dateRanges]
	);

	// Callbacks for better performance
	const handleAddRange = useCallback(() => {
		if (
			currentName &&
			currentDesc &&
			currentDateRange?.from &&
			currentDateRange?.to
		) {
			const newRange: DateRangeItem = {
				name: currentName,
				description: currentDesc,
				start_date: currentDateRange.from,
				end_date: currentDateRange.to,
				content: [],
			};
			setDateRanges((prev) => [...prev, newRange]);
			setCurrentName("");
			setCurrentDesc("");
			setCurrentDateRange(undefined);

			setSuggestions((prev) =>
				prev.filter((suggestion) => suggestion !== currentName)
			);
		}
	}, [currentName, currentDesc, currentDateRange]);

	const handleRemoveRange = useCallback((index: number) => {
		setDateRanges((prev) => {
			const newRanges = [...prev];
			newRanges.splice(index, 1);
			return newRanges;
		});
	}, []);

	const handleSubmit = async () => {
		try {
			setLoading(true);
			setError(null);

			await ApiService.getPhases(id, dateRanges);

			onSubmitSuccess?.();
			router.push(`${pathname}/schedule`);
		} catch (err: any) {
			const errorMessage =
				err.response?.data || err.message || "An error occurred";
			setError(errorMessage);
			onSubmitError?.(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	// Memoized JSON output
	const jsonOutput = useMemo(
		() =>
			JSON.stringify(
				dateRanges,
				(key, value) =>
					key === "start_date" || key === "end_date" ?
						format(new Date(value), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
					:	value,
				2
			),
		[dateRanges]
	);

	return (
		<ScrollArea className="max-h-[28rem]  ">
			<div className="h-full ml-2 mr-4">
				<div className="space-y-2">
					<Label htmlFor="name">Name</Label>
					<div className="flex space-x-2">
						<Input
							id="name"
							value={currentName}
							onChange={(e) => setCurrentName(e.target.value)}
							placeholder="Enter a name for the date range"
							className="flex-grow"
						/>
						{suggestions.length > 0 && (
							<Popover modal={true}>
								<PopoverTrigger asChild>
									<Button variant="outline">Suggestions</Button>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<div className="p-2">
										{suggestions.map((suggestion) => (
											<PopoverClose>
												<Button
													key={suggestion}
													variant="ghost"
													className="w-full justify-start text-left"
													onClick={() => setCurrentName(suggestion)}
												>
													{suggestion}
												</Button>
											</PopoverClose>
										))}
									</div>
								</PopoverContent>
							</Popover>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">Description</Label>
					<Input
						id="description"
						value={currentDesc}
						onChange={(e) => setCurrentDesc(e.target.value)}
						placeholder="Enter a description for the date range"
						className="flex-grow"
					/>
				</div>
				<div className=" flex gap-2 my-2 items-end">
					<DateRangeInput
						currentDateRange={currentDateRange}
						setCurrentDateRange={setCurrentDateRange}
						disabledDates={disabledDateRanges}
					/>
					<Button
						className=""
						variant="secondary"
						onClick={handleAddRange}
						disabled={
							!currentName ||
							!currentDesc ||
							!currentDateRange?.from ||
							!currentDateRange?.to
						}
					>
						Add Date Range
					</Button>
				</div>

				<DateRangeList dateRanges={dateRanges} onRemove={handleRemoveRange} />

				<div>
					<h3 className="font-semibold mb-2">JSON Output:</h3>
					<pre className="bg-muted p-2 rounded overflow-x-auto text-xs">
						{jsonOutput}
					</pre>
				</div>

				<div className=" my-2">
					<Button
						onClick={handleSubmit}
						disabled={loading || dateRanges.length === 0}
					>
						{loading ?
							<div className="flex gap-1 items-center">
								<LoaderCircle
									className=" animate-spin"
									size={16}
									strokeWidth={2}
									aria-hidden="true"
								/>
								Submitting
							</div>
						:	"Submit Date Ranges"}
					</Button>
					{error && <div className="text-red-500">{error}</div>}
				</div>
			</div>
		</ScrollArea>
	);
}
