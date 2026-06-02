import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, vi, beforeEach } from "vitest"
import Dashboard from "./Dashboard"

// Mock only the hooks actually used by Dashboard
vi.mock("../hooks/useWallet", () => ({
	useWallet: vi.fn(),
}))

vi.mock("../hooks/useLearnToken", () => ({
	useLearnToken: vi.fn(),
}))

import { useLearnToken } from "../hooks/useLearnToken"
import { useWallet } from "../hooks/useWallet"

const renderDashboard = () => {
	return render(
		<MemoryRouter>
			<Dashboard />
		</MemoryRouter>,
	)
}

describe("Dashboard page", () => {
	beforeEach(() => {
		vi.clearAllMocks()

		vi.mocked(useLearnToken).mockReturnValue({
			balance: 0n,
			isLoading: false,
			mint: vi.fn(),
			isMinting: false,
		} as any)
	})

	it("renders the Learner Dashboard heading", () => {
		vi.mocked(useWallet).mockReturnValue({
			address: "GTEST123",
		} as any)

		renderDashboard()

		expect(
			screen.getByRole("heading", { name: /Learner Dashboard/i }),
		).toBeInTheDocument()
	})

	it("shows connect wallet prompt when wallet is not connected", () => {
		vi.mocked(useWallet).mockReturnValue({
			address: undefined,
		} as any)

		renderDashboard()

		expect(screen.getByText(/Connect your wallet/i)).toBeInTheDocument()
		expect(
			screen.getByText(/Connect to see your wallet address and stats/i),
		).toBeInTheDocument()
	})

	it("shows wallet address stat card when connected", () => {
		vi.mocked(useWallet).mockReturnValue({
			address: "GTEST123",
		} as any)

		renderDashboard()

		expect(screen.getByText("Wallet Address")).toBeInTheDocument()
		expect(screen.getByText("GTEST123")).toBeInTheDocument()
	})

	it("shows placeholder LearnToken balance of 0 LRN", () => {
		vi.mocked(useWallet).mockReturnValue({
			address: "GTEST123",
		} as any)

		renderDashboard()

		expect(screen.getByText("LearnToken Balance")).toBeInTheDocument()
		expect(screen.getByText("0 LRN")).toBeInTheDocument()
	})

	it("shows scholarship eligibility badge", () => {
		vi.mocked(useWallet).mockReturnValue({
			address: "GTEST123",
		} as any)

		renderDashboard()

		expect(screen.getByText("Scholarship Eligibility")).toBeInTheDocument()
		expect(screen.getByText("Not yet eligible")).toBeInTheDocument()
	})

	it("renders placeholder courses in progress", () => {
		vi.mocked(useWallet).mockReturnValue({
			address: "GTEST123",
		} as any)

		renderDashboard()

		expect(screen.getByText("Courses in progress")).toBeInTheDocument()
		expect(screen.getByText("Web3 Foundations")).toBeInTheDocument()
		expect(screen.getByText("Smart Contract Engineering")).toBeInTheDocument()
		expect(screen.getByText("DeFi Builder Sprint")).toBeInTheDocument()
		expect(screen.getByText("Milestone Verification 101")).toBeInTheDocument()
	})

	it("renders Browse Courses CTA link", () => {
		vi.mocked(useWallet).mockReturnValue({
			address: "GTEST123",
		} as any)

		renderDashboard()

		const browseLink = screen.getByLabelText("Browse courses")
		expect(browseLink).toBeInTheDocument()
		expect(browseLink).toHaveAttribute("href", "/courses")
	})
})
