import AiSearch from "www/components/features/landing/LandingSearch";

export default function Home() {
	return (
		<>
			<main className=" w-full h-screen flex flex-col items-center justify-center  font-sans">
				<div className="flex flex-col items-center justify-center gap-4 w-full  flex-nowrap">
					<h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">
						What's on your mind?
					</h2>
					<AiSearch />
				</div>
			</main>
		</>
	);
}
