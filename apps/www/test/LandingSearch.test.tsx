// LandingSearch.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AiSearch from "./LandingSearch";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "www/hooks/use-toast";

// Mock dependencies
vi.mock("axios");
vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
}));
vi.mock("www/hooks/use-toast", () => ({
	useToast: vi.fn(),
}));

describe("AiSearch", () => {
	const mockRouter = {
		push: vi.fn(),
	};
	const mockToast = {
		toast: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		(useRouter as any).mockReturnValue(mockRouter);
		(useToast as any).mockReturnValue(mockToast);
	});

	it("renders initial state correctly", () => {
		render(<AiSearch />);

		expect(
			screen.getByPlaceholderText("Search the web...")
		).toBeInTheDocument();
		expect(screen.getByText("Personal Project")).toBeInTheDocument();
		expect(screen.getByText("GPT-4")).toBeInTheDocument();
	});

	it("handles textarea input", async () => {
		render(<AiSearch />);
		const textarea = screen.getByPlaceholderText("Search the web...");

		await userEvent.type(textarea, "Test input");
		expect(textarea).toHaveValue("Test input");
	});

	it("opens and closes agent menu", async () => {
		render(<AiSearch />);
		const agentButton = screen.getByText("Personal Project").parentElement;

		await userEvent.click(agentButton!);
		expect(screen.getByText("Business idea")).toBeVisible();

		// Click outside to close
		await userEvent.click(document.body);
		expect(screen.queryByText("Business idea")).not.toBeVisible();
	});

	it("opens and closes model menu", async () => {
		render(<AiSearch />);
		const modelButton = screen.getByText("GPT-4").parentElement;

		await userEvent.click(modelButton!);
		expect(screen.getByText("Gemini")).toBeVisible();

		await userEvent.click(document.body);
		expect(screen.queryByText("Gemini")).not.toBeVisible();
	});

	it("submits form successfully", async () => {
		(axios.post as any).mockResolvedValueOnce({
			status: 200,
			data: { id: "test-id" },
		});

		render(<AiSearch />);
		const textarea = screen.getByPlaceholderText("Search the web...");
		const submitButton = screen.getByLabelText("generate");

		await userEvent.type(textarea, "Test input");
		await userEvent.click(submitButton);

		expect(axios.post).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/search`,
			{
				value: "Test input",
				agent: "Personal Project",
				model: "GPT-4",
			},
			expect.any(Object)
		);

		await waitFor(() => {
			expect(mockRouter.push).toHaveBeenCalledWith("/ai/build/test-id");
		});
	});

	it("handles submission error", async () => {
		(axios.post as any).mockRejectedValueOnce(new Error("Test error"));

		render(<AiSearch />);
		const textarea = screen.getByPlaceholderText("Search the web...");
		const submitButton = screen.getByLabelText("generate");

		await userEvent.type(textarea, "Test input");
		await userEvent.click(submitButton);

		await waitFor(() => {
			expect(mockToast.toast).toHaveBeenCalledWith({
				variant: "destructive",
				title: "Error occured",
				description: "Interal Error",
			});
		});
	});

	it("handles enter key submission", async () => {
		render(<AiSearch />);
		const textarea = screen.getByPlaceholderText("Search the web...");

		await userEvent.type(textarea, "Test input{enter}");

		expect(axios.post).toHaveBeenCalled();
	});

	it("prevents submission when textarea is empty", async () => {
		render(<AiSearch />);
		const submitButton = screen.getByLabelText("generate");

		await userEvent.click(submitButton);

		expect(axios.post).not.toHaveBeenCalled();
	});
});
