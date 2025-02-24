import React from "react";
import Analysis from "www/components/features/analysis/analysis-container";
import { ProjectReportResponse } from "shared";
import { api, isSuccess } from "www/lib/handler";
import { getSessionCookie } from "www/hooks/use-server-session";
import { redirect } from "next/navigation";

const BuildPage = async ({ params }: { params: { id: string } }) => {
	const { id } = params;
	const session = await getSessionCookie();
	if (!session) {
		return redirect("/");
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
							"Failed to fetch business data. Please try again later."}
					</p>
				</main>
			);
		}

		if (!result.result) {
			return (
				<main className="flex flex-col justify-center items-center h-screen ">
					<h1 className="text-2xl font-bold text-gray-800">404 Not Found</h1>
					<p className="text-gray-600">
						The requested business could not be found.
					</p>
				</main>
			);
		}

		return (
			<div className="flex-1 mx-4 flex flex-col">
				<Analysis res={{ success: true, result: result.result }} id={id} />
			</div>
		);
	} catch (error) {
		console.error("Error fetching project:", error);
		return (
			<main className="flex flex-col justify-center items-center h-screen ">
				<h1 className="text-2xl font-bold text-red-600">Unexpected Error</h1>
				<p className="text-gray-700">
					An unexpected error occurred while fetching the project.
				</p>
			</main>
		);
	}
};

export default BuildPage;
