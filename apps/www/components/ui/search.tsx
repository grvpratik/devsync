import { Search } from "lucide-react";
import { useId } from "react";
import { Input } from "www/components/ui/input";

interface SearchProps {
	onSearchChange: (query: string) => void;
	value: string;
}

export default function SideBarSearch({ onSearchChange, value }: SearchProps) {
	const id = useId();

	return (
		<div className="space-y-2 mx-1">
			<div className="relative ">
				<Input
					id={id}
					className="peer ps-9 text-sm rounded-xl focus-within:shadow-border  overflow-hidden   "
					placeholder="Search..."
					type="search"
					value={value}
					onChange={(e) => onSearchChange(e.target.value)}
				/>
				<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
					<Search size={16} strokeWidth={2} />
				</div>
			</div>
		</div>
	);
}
