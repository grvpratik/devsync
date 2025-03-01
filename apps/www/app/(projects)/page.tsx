import AiSearch from "www/components/features/landing/LandingSearch";

export default function Home() {
	return (
		<main className=" w-full h-full flex flex-col items-center justify-end md:justify-center pb-2 ">
			<div className="flex flex-col h-full items-center justify-center gap-1 w-full  flex-nowrap text-wrap mx-auto">
				<div>
					<h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">
						What&lsquo;s on your mind?
					</h2>
				</div>

				<AiSearch />
			</div>
		</main>
	);
}
