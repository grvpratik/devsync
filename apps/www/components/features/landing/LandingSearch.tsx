"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "www/components/ui/button";
import { Textarea } from "www/components/ui/textarea";
import { useAutoResizeTextarea } from "www/hooks/use-auto-resize-textarea";
import { useToast } from "www/hooks/use-toast";
import { cn } from "www/lib/utils";

import { Brain, Lightbulb, LoaderCircle, Sparkles } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "www/components/ui/dropdown-menu";
import {
	AI_MODELS_LIST,
	MAX_HEIGHT,
	MIN_HEIGHT,
	PROJECT_TYPE,
} from "www/lib/constant";

import { api, isSuccess } from "www/lib/handler";

const AI_MODELS = AI_MODELS_LIST.map((model) => ({
	...model,
	icon: <Brain className="w-4 h-4" />,
}));

interface StateProps {
	value: string;
	selectedProject: string;
	selectedModel: string;
}

// interface SearchInput {
// 	value: string;
// 	project: string;
// 	model: string;
// }

export default function AiSearch() {
	const { toast } = useToast();
	const [loading, setLoading] = useState<boolean>(false);
	const [state, setState] = useState<StateProps>({
		value: "",
		selectedProject: PROJECT_TYPE[0].name,
		selectedModel: AI_MODELS[0].name,
	});

	const { textareaRef, adjustHeight } = useAutoResizeTextarea({
		minHeight: MIN_HEIGHT,
		maxHeight: MAX_HEIGHT,
	});
	const router = useRouter();

	const handleSubmit = async () => {
		if (!isValidInput(state)) return;

		setLoading(true);

		try {
			const input = {
				value: state.value,
				project: state.selectedProject,
				model: state.selectedModel,
			};
			const response = await api.post("/build/search", input);

			if (isSuccess(response)) {
				console.log("response", response);
				
				toast({
					variant: "default",
					title: "please wait redirecting",
					
				});
				router.push(`/build/${response.url}`);
			} else {
				toast({
					variant: "destructive",
					title: response.error.code,
					description: response.error.message,
				});
			}
		} catch (error) {
			handleError(error);
		} finally {
			setLoading(false);
			adjustHeight(true);
		}
	};

	const isValidInput = (state: StateProps): boolean => {
		if (!state.value?.trim()) {
			toast({
				variant: "destructive",
				title: "Validation Error",
				description: "Please enter a search value",
			});
			return false;
		}
		return true;
	};

	const handleError = (error: unknown) => {
		const message =
			error instanceof Error ? error.message : "Internal Server Error";
		toast({
			variant: "destructive",
			title: "Error occurred",
			description: message,
		});
	};

	const updateState = (updates: Partial<typeof state>) =>
		setState((prev) => ({ ...prev, ...updates }));

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<div className="w-full p-2 md:py-4 md:px-4">
			<div className="relative max-w-xl w-full mx-auto ">
				<div className="relative flex flex-col shadow-border rounded-xl">
					<div
						className="overflow-y-auto"
						style={{ maxHeight: `${MAX_HEIGHT}px` }}
					>
						<Textarea
							id="ai-input-04"
							value={state.value}
							placeholder="Search the web..."
							className="w-full rounded-xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 leading-[1.2]"
							ref={textareaRef}
							onKeyDown={handleKeyDown}
							disabled={loading}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
								setState((prev) => ({ ...prev, value: e.target.value }));
								adjustHeight();
							}}
						/>
					</div>

					<div className="h-12 bg-black/5 dark:bg-white/5 rounded-b-xl ">
						<div className="absolute left-3 bottom-2.5 flex items-center gap-2">
							{/* Agent Selection - Now using shadcn DropdownMenu */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										disabled={loading}
										size="icon"
										className="rounded-lg hover:bg-black/5 dark:hover:bg-white/5 p-1.5 h-auto"
									>
										<Lightbulb className="size-5 dark:text-white" />
										<span className="sr-only">Select project type</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-72">
									{PROJECT_TYPE.map((agent) => (
										<DropdownMenuItem
											key={agent.name}
											onClick={() =>
												updateState({ selectedProject: agent.name })
											}
											className="flex flex-col items-start py-2"
										>
											<span className="text-sm dark:text-white">
												{agent.name}
											</span>
											<span className="text-xs text-black/50 dark:text-white/50">
												{agent.description}
											</span>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>

							<div className="absolute top-11 text-nowrap flex items-center gap-1.5 text-[10px] text-muted-foreground dark:text-white/50 ml-1">
								<span>{state.selectedProject}</span>
							</div>

							
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
									disabled={loading}
										variant="outline"
										className="flex items-center gap-1.5 h-8 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg px-2"
									>
										<Brain className="w-4 h-4 dark:text-white" />
										<span className="dark:text-white text-center">
											{state.selectedModel}
										</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-64">
									{AI_MODELS.map((model) => (
										<DropdownMenuItem
											key={model.name}
											onClick={() => updateState({ selectedModel: model.name })}
											className="flex items-center gap-2 py-1.5"
										>
											<div className="flex items-center gap-2 flex-1">
												{model.icon}
												<span className="flex text-nowrap">{model.name}</span>
											</div>
											<span className="text-xs line-clamp-1 text-zinc-500 dark:text-zinc-400">
												{model.description}
											</span>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<div className="absolute right-3 bottom-3">
							<Button
								variant="outline"
								size="icon"
								aria-label="generate"
								type="button"
								onClick={handleSubmit}
								disabled={loading}
								data-loading={loading}
								className={cn(
									"rounded-lg p-2 size-8 disabled:text-sky-500 disabled:cursor-not-allowed hover:text-sky-500 hover:bg-sky-500/15 disabled:bg-sky-500/15 transition-colors",
									state.value ?
										"bg-sky-500/15 text-sky-500"
									:	"bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
								)}
							>
								{loading ?
									<div className="absolute inset-0 flex items-center justify-center">
										<LoaderCircle
											className="animate-spin"
											size={16}
											strokeWidth={2}
											aria-hidden="true"
										/>
									</div>
								:	<Sparkles
										className="opacity-60"
										size={16}
										strokeWidth={2}
										aria-hidden="true"
									/>
								}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
