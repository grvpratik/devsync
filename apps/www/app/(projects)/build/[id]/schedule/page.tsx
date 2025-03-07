import React from "react";

import { api, isSuccess } from "www/lib/handler";

import { ProjectReportResponse } from "shared";
import ScheduleGrid from "www/components/features/schedule/ScheduleGrid";
import { getSessionCookie } from "www/hooks/use-server-session";


const SchedulePage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } =await params;
	const session: string = (await getSessionCookie()) ?? "";
	if (!session) {
		return <div>login first</div>;
	}
	try {
		const result = await api.post<ProjectReportResponse>(
			`/build/project/${id}`,
			{},
			{ session }
		);

		if (!isSuccess(result)) {
			return (
				<main className="flex flex-col justify-center items-center h-screen ">
					<h1 className="text-2xl font-bold text-red-600">Error</h1>
					<p className="text-gray-700">
						{result.error?.message ||
							"Failed to fetch project data. Please try again later."}
					</p>
				</main>
			);
		}

		if (!result.result.phases || !!!result.result.phases.length) {
			return (
				<main className="flex flex-col justify-center items-center h-screen ">
					<h1 className="text-2xl font-bold text-gray-800">
						No Schedule Available
					</h1>
					<p className="text-gray-600">
						This project doesnt have any phases or schedule information yet.
					</p>
				</main>
			);
		}

		return (
			<main className="mx-4 mb-4 h-full w-full ">
				<ScheduleGrid
					metadata={result.result.metadata}
					phases={result.result.phases}
					id={id}
				/>
			</main>
		);
	} catch (error) {
		console.error("Error fetching project schedule:", error);
		return (
			<main className="flex flex-col justify-center items-center h-screen ">
				<h1 className="text-2xl font-bold text-red-600">Unexpected Error</h1>
				<p className="text-gray-700">
					An unexpected error occurred while loading the schedule.
				</p>
			</main>
		);
	}
};

export default SchedulePage;
