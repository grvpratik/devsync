import axios, { AxiosResponse } from "axios";
import React from "react";
import ScheduleCalendar from "www/components/features/schedule/ScheduleCalendar";

async function getData(id: string): Promise<AxiosResponse | null> {
	try {
		const URL = `${process.env.NEXT_PUBLIC_API!}/build/project/${id}/schedule`;
		console.log(`Fetching: ${URL}`);

		const res = await axios.get(URL);
		//	console.log("API Response:", res.data);

		return res;
	} catch (error: any) {
		console.error("Error fetching data:", error.message || error);

		return null;
	}
}
const SchedulePage = async ({ params }: { params: { id: string } }) => {
	const { id } = await params;
	const result = await getData(id);
	//console.log(result?.data.result);
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
			<ScheduleCalendar result={result && result.data.result} />
		</main>
	);
};

export default SchedulePage;
