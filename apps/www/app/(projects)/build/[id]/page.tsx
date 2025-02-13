import React from "react";
import Analysis from "www/components/features/analysis/analysis-container";
import axios from "axios";
import { BusinessIdeaResult } from "shared";
interface ApiResponse {
	status: number;
	data: BusinessResponse;
}
export interface BusinessResponse {
	success: boolean;
	result: BusinessIdeaResult;
}
// ✅ Improved API Call with Error Handling
async function getData(id: string): Promise<ApiResponse | null> {
	try {
		const URL = `${process.env.NEXT_PUBLIC_API!}/business/${id}`;
		//	console.log(`Fetching: ${URL}`);

		const res = await axios.post(URL);
		//	console.log("API Response:", res.data);

		return res;
	} catch (error: any) {
		console.error("Error fetching data:", error.message || error);

		return null;
	}
}

const BuildPage = async ({ params }: { params: { id: string } }) => {
	const { id } = await params; // ✅ No need to `await params`

	const result = await getData(id);

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

	if (result.status !== 200) {
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
			<Analysis res={result.data} />{" "}
		</div>
	);
};

export default BuildPage;
