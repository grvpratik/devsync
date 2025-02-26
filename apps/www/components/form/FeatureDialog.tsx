// "use client";

// import { useState } from "react";
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from "www/components/ui/dialog";
// import { Button } from "www/components/ui/button";
// import { Input } from "www/components/ui/input";
// import { Textarea } from "www/components/ui/textarea";
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "www/components/ui/select";
// //import { Slider } from "www/components/ui/slider"
// import { Label } from "www/components/ui/label";

// type Priority = "low" | "medium" | "high";

// export const AddFeatureDialog = ({ type, onAddFeature, loading }) => {
// 	const [name, setName] = useState("");
// 	const [description, setDescription] = useState("");
// 	const [priority, setPriority] = useState<Priority>("medium");
// 	// const [rating, setRating] = useState(0)

// 	const handleSubmit = async (event: React.FormEvent) => {
// 		event.preventDefault();
// 		// Handle form submission here
// 		const newFeature = {
// 			name,
// 			description,
// 			priority,

// 			type,
// 		};
// 		console.log({ name, description, priority });
// 		// Reset form fields
// 		await onAddFeature(newFeature);
// 		setName("");
// 		setDescription("");
// 		setPriority("medium");
// 		// setRating(0)
// 	};

// 	return (
// 		<Dialog>
// 			<DialogTrigger asChild className="">
// 				<Button variant="outline">Add New Task</Button>
// 			</DialogTrigger>
// 			<DialogContent className="sm:max-w-[425px]">
// 				<DialogHeader>
// 					<DialogTitle>Add New Task</DialogTitle>
// 				</DialogHeader>
// 				<form onSubmit={handleSubmit} className="grid gap-4 py-4 ">
// 					<div className="grid grid-cols-4 items-center gap-4">
// 						<Label htmlFor="name" className="text-right">
// 							Name
// 						</Label>
// 						<Input
// 							id="name"
// 							value={name}
// 							onChange={(e) => setName(e.target.value)}
// 							className="col-span-3"
// 						/>
// 					</div>
// 					<div className="grid grid-cols-4 items-center gap-4">
// 						<Label htmlFor="description" className="text-right">
// 							Description
// 						</Label>
// 						<Textarea
// 							id="description"
// 							value={description}
// 							onChange={(e) => setDescription(e.target.value)}
// 							className="col-span-3"
// 						/>
// 					</div>
// 					<div className="grid grid-cols-4 items-center gap-4">
// 						<Label htmlFor="priority" className="text-right">
// 							Priority
// 						</Label>
// 						<Select
// 							value={priority}
// 							onValueChange={(value: Priority) => setPriority(value)}
// 						>
// 							<SelectTrigger className="col-span-3">
// 								<SelectValue placeholder="Select priority" />
// 							</SelectTrigger>
// 							<SelectContent>
// 								<SelectItem value="low">Low</SelectItem>
// 								<SelectItem value="medium">Medium</SelectItem>
// 								<SelectItem value="high">High</SelectItem>
// 							</SelectContent>
// 						</Select>
// 					</div>
// 					<div className="grid grid-cols-4 items-center gap-4">
// 						{/* <Label htmlFor="rating" className="text-right">
//               Rating
//             </Label> */}
// 						{/* <div className="col-span-3 flex items-center gap-4">
//               <Slider
//                 id="rating"
//                 min={0}
//                 max={5}
//                 step={0.5}
//                 value={[rating]}
//                 onValueChange={(value) => setRating(value[0])}
//               />
//               <span>{rating}</span>
//             </div> */}
// 					</div>
// 					<Button type="submit" className="ml-auto">
// 						Submit
// 					</Button>
// 				</form>
// 			</DialogContent>
// 		</Dialog>
// 	);
// };
