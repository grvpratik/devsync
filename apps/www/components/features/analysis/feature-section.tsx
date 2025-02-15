import React, { useState } from "react";
import { Settings, Shield, Star, Trash2, Edit, Plus, X } from "lucide-react";
import { AddFeatureDialog } from "www/components/form/FeatureDialog";
import { json } from "stream/consumers";
import { MultiDateRangeSelector } from "../../form/phase-selector";
import { Feature, FeatureSchema } from "shared";
// Types

// Feature Types Configuration
const FEATURE_TYPES = [
	{ name: "must-have", icon: Shield, color: "bg-red-50 border-red-200" },
	{ name: "should-have", icon: Settings, color: "bg-blue-50 border-blue-200" },
	{ name: "nice-to-have", icon: Star, color: "bg-green-50 border-green-200" },
];

// API Service (simulated)
const FeatureService = {
	async addFeature(feature: Omit<FeatureProps, "id">) {
		try {
			// Simulated API call
			const response = await fetch("/api/features", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(feature),
			});

			if (!response.ok) throw new Error("Failed to add feature");

			return await response.json();
		} catch (error) {
			console.error("Add feature error:", error);
			throw error;
		}
	},

	async deleteFeature(featureId: string) {
		try {
			const response = await fetch(`/api/features/${featureId}`, {
				method: "DELETE",
			});

			if (!response.ok) throw new Error("Failed to delete feature");

			return true;
		} catch (error) {
			console.error("Delete feature error:", error);
			throw error;
		}
	},
};

// Feature Card Component
const FeatureCard = ({
	feature,
	onFeatureDelete,
}: {
	feature: FeatureSchema;
	onFeatureDelete: (id: string) => void;
}) => {
	return (
		<div className="bg-white p-4 rounded-lg shadow-md mb-3 relative">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="font-bold text-lg">{feature.name}</h3>
					<p className="text-gray-600 text-sm">{feature.description}</p>
				</div>
				<div className="flex space-x-2">
					<button
						className="text-red-500 hover:text-red-700"
						onClick={() => onFeatureDelete(feature.id)}
					>
						<Trash2 size={20} />
					</button>
				</div>
			</div>
			<div className="mt-2 flex justify-between items-center">
				<span
					className={`
                    px-2 py-1 rounded-full text-xs
                    ${
											feature.priority === "High" ? "bg-red-100 text-red-800"
											: feature.priority === "Medium" ?
												"bg-yellow-100 text-yellow-800"
											:	"bg-green-100 text-green-800"
										}
                `}
				>
					{feature.priority}
				</span>
				<div className="flex items-center">
					<div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
						<div
							className="bg-blue-600 h-2.5 rounded-full"
							style={{ width: `${feature.complexity * 10}%` }}
						></div>
					</div>
					<span className="text-xs text-gray-500">{feature.complexity}/10</span>
				</div>
			</div>
		</div>
	);
};

// Feature Card Wrapper Component
const FeatureCardWrapper = ({
	features,
	type,
}: {
	features: (typeof FeatureSchema)[];
	type: string;
}) => {
	const [featuresList, setFeaturesList] = useState(features);

	const handleAddFeature = async (newFeature: Omit<typeof FeatureSchema, "id">) => {
		console.log(newFeature, "newFeature");
		try {
			// Optimistic update
			const optimisticFeature = {
				...newFeature,
				id: `temp-${Date.now()}`,
			};
			setFeaturesList((prev) => [...prev, optimisticFeature]);

			// Actual API call
			const addedFeature = await FeatureService.addFeature(newFeature);

			// Replace optimistic feature with actual feature
			setFeaturesList((prev) =>
				prev.map((f) => (f.id === optimisticFeature.id ? addedFeature : f))
			);
		} catch (error) {
			// Remove optimistic feature if API call fails
			setFeaturesList((prev) =>
				prev.filter((f) => f.id !== `temp-${Date.now()}`)
			);
		}
	};

	const handleDeleteFeature = async (featureId: string) => {
		try {
			// Optimistic update
			setFeaturesList((prev) => prev.filter((f) => f.id !== featureId));

			// Actual API call
			await FeatureService.deleteFeature(featureId);
		} catch (error) {
			// Revert if deletion fails
			// Here you might want to fetch the latest data or show an error
			console.error("Failed to delete feature", error);
		}
	};

	const typeConfig = FEATURE_TYPES.find((t) => t.name === type);
	const TypeIcon = typeConfig?.icon || Shield;

	return (
		<div
			className={`p-4 rounded-lg border ${typeConfig?.color || "bg-gray-50"}`}
		>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold flex items-center">
					<TypeIcon className="mr-2 text-gray-600" size={24} />
					{type.replace("-", " ").toUpperCase()}
				</h2>

				<AddFeatureDialog type={type} onAddFeature={handleAddFeature} loading />
			</div>

			{featuresList
				.filter((feature) => feature.type === type)
				.map((feature) => (
					<FeatureCard
						key={feature.id}
						feature={feature}
						onFeatureDelete={handleDeleteFeature}
					/>
				))}
		</div>
	);
};

// Main Features Analysis Component
const FeaturesAnalysis = ({ featureslist }: { featureslist: Feature }) => {
	if (!featureslist) return <div>not found</div>;
	const initialData = featureslist && featureslist.length > 0 && featureslist;
	return (
		<>
			{" "}
			<pre>{JSON.stringify(featureslist, null, 9)}</pre>
			<MultiDateRangeSelector />
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* {FEATURE_TYPES.map((type) => (
                <FeatureCardWrapper 
                    key={type.name} 
                    features={initialData} 
                    type={type.name} 
                />
            ))} */}
			</div>
		</>
	);
};

export default FeaturesAnalysis;
