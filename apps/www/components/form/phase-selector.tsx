"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "www/components/ui/button";
import { Input } from "www/components/ui/input";
import { Label } from "www/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "www/components/ui/popover";
import { Calendar } from "www/components/ui/calendar";
import { cn } from "www/lib/utils";

interface DateRangeItem {
	name: string;
	description: string;
	start_date: Date;
	end_date: Date;
	content?: any[];
}

const initialSuggestions = [
	"Project Alpha",
	"Team Building Week",
	"Annual Leave",
	"Conference Trip",
	"Training Session",
];

import axios from "axios";
import { NEXT_PUBLIC_API } from "www/lib/constant";
import { useRouter } from "next/navigation";
//import { format } from "date-fns";
import { usePathname } from "next/navigation";
export function MultiDateRangeSelector({id}) {
	const [dateRanges, setDateRanges] = useState<DateRangeItem[]>([]);
	const [currentName, setCurrentName] = useState("");
	const [currentDesc, setCurrentDesc] = useState("");
	const [currentDateRange, setCurrentDateRange] = useState<
		| {
				from: Date | undefined;
				to: Date | undefined;
		  }
		| undefined
	>(undefined);
	const [suggestions, setSuggestions] = useState(initialSuggestions);
	const [loading, setLoading] = useState(false);

	const [error, setError] = useState<string | null>(null);
const router=useRouter()
const pathname=usePathname()
	const handleAddRange = () => {
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
			setDateRanges([...dateRanges, newRange]);
			setCurrentName("");
			setCurrentDesc("");
			setCurrentDateRange(undefined);

			// Remove the used suggestion if it exists
			if (suggestions.includes(currentName)) {
				setSuggestions(
					suggestions.filter((suggestion) => suggestion !== currentName)
				);
			}
		}
	};

	const handleRemoveRange = (index: number) => {
		const newRanges = [...dateRanges];
		newRanges.splice(index, 1);
		setDateRanges(newRanges);
	};

	const handleSubmit = async () => {
		try {
			setLoading(true);
			setError(null);

			// Using the payload with key "phases"
			const response = await axios.post(`${NEXT_PUBLIC_API}/build/${id}/phases`, {
				dateRanges,
			});

			if (response.status !== 200) {
				throw new Error("Failed to submit data");
			}

			console.log(pathname);
			router.push(`${pathname}/schedule`);

			// Log the response data
			console.log(response.data);

			// Optionally, set the response data to a state variable
			// setSubmitResponse(response.data);
		} catch (err: any) {
			// Ensure we set error to a string or an object that we handle properly
			setError(err.response?.data || err.message || "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4 font-sans">
			{/* Name Input with Suggestions */}
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
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outline">Suggestions</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[200px] p-0">
								<div className="p-2">
									{suggestions.map((suggestion) => (
										<Button
											key={suggestion}
											variant="ghost"
											className="w-full justify-start text-left"
											onClick={() => setCurrentName(suggestion)}
										>
											{suggestion}
										</Button>
									))}
								</div>
							</PopoverContent>
						</Popover>
					)}
				</div>
			</div>

			{/* Description Input */}
			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<div className="flex space-x-2">
					<Input
						id="description"
						value={currentDesc}
						onChange={(e) => setCurrentDesc(e.target.value)}
						placeholder="Enter a description for the date range"
						className="flex-grow"
					/>
				</div>
			</div>

			{/* Date Range Picker */}
			<div className="space-y-2">
				<Label>Date Range</Label>
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
					<PopoverContent className=" min-w-fit p-0" align="end">
						<Calendar
						className="w-full font-sans rounded-md"
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
							disabled={dateRanges.map((date) => ({
								from: date.start_date,
								to: date.end_date,
							}))}
						/>
					</PopoverContent>
				</Popover>
			</div>

			{/* Add Date Range Button */}
			<Button
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

			{/* List of Added Date Ranges */}
			<div className="space-y-2">
				<h3 className="font-semibold">Selected Date Ranges:</h3>
				{dateRanges.map((range, index) => (
					<div
						key={index}
						className="flex justify-between items-center bg-muted p-2 rounded"
					>
						<span>
							{range.name}: {format(range.start_date, "LLL dd, y")} -{" "}
							{format(range.end_date, "LLL dd, y")}
						</span>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => handleRemoveRange(index)}
						>
							Remove
						</Button>
					</div>
				))}
			</div>

			{/* JSON Output Preview */}
			<div>
				<h3 className="font-semibold mb-2">JSON Output:</h3>
				<pre className="bg-muted p-2 rounded overflow-x-auto">
					{JSON.stringify(
						dateRanges,
						(key, value) =>
							key === "start_date" || key === "end_date" ?
								format(new Date(value), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
							:	value,
						2
					)}
				</pre>
			</div>

			{/* Submit Section */}
			<div className="space-y-2">
				<Button
					onClick={handleSubmit}
					disabled={loading || dateRanges.length === 0}
				>
					{loading ? "Submitting..." : "Submit Date Ranges"}
				</Button>
				{error && <div className="text-red-500">{error}</div>}
				
			</div>
		</div>
	);
}
