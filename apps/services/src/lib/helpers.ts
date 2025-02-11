export function isIdeaWellFormed(idea: string): boolean {
	const minLength = 10;
	const maxLength = 500;
	const containsTechKeywords =
		/\b(app|software|AI|platform|tech|digital|online|web|mobile|data|cloud|blockchain|IoT|API|automation)\b/i;

	return (
		idea.length >= minLength &&
		idea.length <= maxLength &&
		idea.split(" ").length >= 3 &&
		containsTechKeywords.test(idea)
	);
}
