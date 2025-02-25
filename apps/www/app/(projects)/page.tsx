import AiSearch from "www/components/features/landing/LandingSearch";

export default function Home() {
	return (
		<>
			<main className=" w-full h-full flex flex-col items-center justify-end md:justify-center pb-2 ">
				<div className="flex flex-col items-center justify-center gap-1 w-full  flex-nowrap text-wrap mx-auto">
					<h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">
						What's on your mind?
					</h2>
					<p className=" text-wrap text-center">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis laborum autem eos ut natus nesciunt alias placeat ipsum consequatur fuga aspernatur atque eum deserunt modi, quo aut a laboriosam commodi.</p>
					<AiSearch />
				</div>
			</main>
		</>
	);
}
