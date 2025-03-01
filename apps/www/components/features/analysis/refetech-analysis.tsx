"use client";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "www/components/ui/button";
import { useToast } from "www/hooks/use-toast";
import { api, isSuccess } from "www/lib/handler";

const RefetchAnalysis = ({
	section,
	id,
}: {
	section: "overview" | "feature" | "market";
	id: string;
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { toast } = useToast();

	const handleRefetch = async () => {
		try {
			setIsLoading(true);

			const response = await api.post(`/build/project/${id}/refresh/${section}`);

			if (isSuccess(response)) {
				toast({
					title: "Success",
					description: `${section.charAt(0).toUpperCase() + section.slice(1)} analysis refreshed successfully.`,
				});

				
				window.location.reload();
			} else {
				toast({
					variant: "destructive",
					title: "Error",
					description:
						response.error?.message || `Failed to refresh ${section} analysis.`,
				});
			}
		} catch (error) {
			console.error(`Error refreshing ${section} analysis:`, error);
			toast({
				variant: "destructive",
				title: "Error",
				description:
					error instanceof Error ?
						error.message
					:	`An unexpected error occurred while refreshing ${section} analysis.`,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<Button onClick={handleRefetch} disabled={isLoading} className="gap-2">
				{isLoading ?
					<>
						<LoaderCircle className="h-4 w-4 animate-spin" />
						<span>Refreshing...</span>
					</>
				:	<>
						<RefreshCw className="h-4 w-4" />
						<span>Refetch</span>
					</>
				}
			</Button>
		</div>
	);
};

export default RefetchAnalysis;
