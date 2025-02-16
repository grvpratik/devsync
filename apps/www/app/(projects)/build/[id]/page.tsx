import React from "react";
import Analysis from "www/components/features/analysis/analysis-container";
import axios from "axios";
import { ApiResponse, BusinessIdeaResult } from "shared";
import { ApiService, AuthApiService } from "www/external/api";
import { cookies } from "next/headers";
import { getSessionCookie } from "www/hooks/use-server-session";

const BuildPage = async ({ params }: { params: { id: string } }) => {
	const { id } = await params;
	const session = await getSessionCookie();
	console.log("session",session)
	const result = await ApiService.getProjectById(id,session??'');
	// console.log("project by id",result)
	// const user= await AuthApiService.getUserData()
	// console.log(user)
	// console.log("result",result.result);
	if (result && !result.success) {
		return (
			<main className="flex flex-col justify-center items-center h-screen font-sans">
				<h1 className="text-2xl font-bold text-red-600">Error</h1>
				<p className="text-gray-700">
					Failed to fetch business data. Please try again later.
				</p>
			</main>
		);
	}
	if (!result?.result) {
		return (
			<main className="flex flex-col justify-center items-center h-screen font-sans">
				<h1 className="text-2xl font-bold text-gray-800">404 Not Found</h1>
				<p className="text-gray-600">
					The requested business could not be found.
				</p>
			</main>
		);
	}
	//console.log(result.data, "Data");
	return (
		<div className="flex-1 mx-4 flex flex-col">
			<Analysis res={result} id={id}/>{" "}
		</div>
	);
};

export default BuildPage;
