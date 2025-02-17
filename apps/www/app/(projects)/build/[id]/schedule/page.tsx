import axios, { AxiosResponse } from "axios";
import React from "react";
import ScheduleCalendar from "www/components/features/schedule/ScheduleCalendar";
import { ApiService } from "www/external/api";
import { getSessionCookie } from "www/hooks/use-server-session";


const SchedulePage = async ({ params }: { params: { id: string } }) => {
	const { id } = await params;
	const session= await getSessionCookie()
	const result = await ApiService.getProjectById(id,session!)
	console.log(result.result.phases,"sechedule");
	if (!result) {
		return (
			<main className="flex flex-col justify-center items-center h-screen font-sans">
				<h1 className="text-2xl font-bold text-red-600">Error</h1>
				<p className="text-gray-700">
					Failed to fetch business data. Please try again later.
				</p>
			</main>
		);
	}

	//fetch
	return (
		<main className="mx-4 mb-4">
			<ScheduleCalendar result={result && result.result.phases} />
		</main>
	);
};

export default SchedulePage;
