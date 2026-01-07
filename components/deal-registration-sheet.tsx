"use client";

import * as React from "react";
import { IconHelpCircle, IconInfoCircle } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const PACKAGES = ["Starter", "Professional", "Business", "Enterprise"];
const TERMS = ["Monthly", "Yearly"];
const REGIONS = ["North America", "EMEA", "APAC", "LATAM"];
const EXPANSION_OPTIONS = ["Yes", "No"];

interface DealRegistrationSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DealRegistrationSheet({
	open,
	onOpenChange,
}: DealRegistrationSheetProps) {
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsSubmitting(false);
		onOpenChange(false);
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="sm:max-w-lg overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Register a New Deal</SheetTitle>
						<SheetDescription>
							Register a deal with the right package and commercial details in under
							a minute.
						</SheetDescription>
					</SheetHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-6 py-6">
					{/* Account Information */}
					<div className="space-y-4">
						<h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
							Account Information
						</h4>
						<div className="grid gap-3">
							<div className="grid gap-2">
								<Label htmlFor="account-name">
									Account Name <span className="text-red-500">*</span>
								</Label>
								<Input
									id="account-name"
									placeholder="e.g., Mono Corporation"
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="account-domain">
									Account Domain <span className="text-red-500">*</span>
								</Label>
								<Input
									id="account-domain"
									placeholder="e.g., mono.com"
									required
								/>
							</div>
						</div>
					</div>

					{/* Commercial Scope */}
					<div className="space-y-4">
						<h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
							Commercial Scope
						</h4>
						<div className="grid gap-3">
							<div className="grid gap-2">
								<Label htmlFor="package">
									Package <span className="text-red-500">*</span>
								</Label>
								<Select required>
									<SelectTrigger id="package">
										<SelectValue placeholder="Select package" />
									</SelectTrigger>
									<SelectContent>
										{PACKAGES.map((pkg) => (
											<SelectItem key={pkg} value={pkg}>
												{pkg}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="seats">
									Seats <span className="text-red-500">*</span>
								</Label>
								<Input
									id="seats"
									type="number"
									min="1"
									step="1"
									inputMode="numeric"
									placeholder="e.g., 150"
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="contract-term">
									Contract Term <span className="text-red-500">*</span>
								</Label>
								<Select required>
									<SelectTrigger id="contract-term">
										<SelectValue placeholder="Select term" />
									</SelectTrigger>
									<SelectContent>
										{TERMS.map((term) => (
											<SelectItem key={term} value={term}>
												{term}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<div className="flex items-center gap-2">
									<Label htmlFor="deal-value">
										Estimated Deal Value (USD){" "}
										<span className="text-red-500">*</span>
									</Label>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<IconHelpCircle className="size-4 text-muted-foreground cursor-help" />
											</TooltipTrigger>
											<TooltipContent side="top" className="max-w-xs">
												Enter the total contract value for the initial term and
												any expected renewals
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
								<Input
									id="deal-value"
									type="number"
									min="0"
									placeholder="e.g., 50000"
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="region">
									Region <span className="text-red-500">*</span>
								</Label>
								<Select required>
									<SelectTrigger id="region">
										<SelectValue placeholder="Select region" />
									</SelectTrigger>
									<SelectContent>
										{REGIONS.map((region) => (
											<SelectItem key={region} value={region}>
												{region}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="close-date">
									Expected Close Date <span className="text-red-500">*</span>
								</Label>
								<Input id="close-date" type="date" required />
							</div>
						</div>
					</div>

					{/* Additional Context */}
					<div className="space-y-4">
						<h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
							Additional Context
						</h4>
						<div className="grid gap-3">
							<div className="grid gap-2">
								<Label htmlFor="use-case">Use Case</Label>
								<textarea
									id="use-case"
									className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
									placeholder="e.g., distributed teams, secure internal communications"
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="competitor">Competitor</Label>
								<Input id="competitor" placeholder="e.g., Teams, Zoom, Slack" />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="expansion-potential">Expansion Potential</Label>
								<Select>
									<SelectTrigger id="expansion-potential">
										<SelectValue placeholder="Select option" />
									</SelectTrigger>
									<SelectContent>
										{EXPANSION_OPTIONS.map((option) => (
											<SelectItem key={option} value={option}>
												{option}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="notes">Notes</Label>
								<textarea
									id="notes"
									className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
									placeholder="Any additional context about the opportunity..."
								/>
							</div>
						</div>
					</div>

					{/* Help Section */}
					<div className="rounded-lg border bg-muted/50 p-4 space-y-3">
						<div className="flex items-start gap-2">
							<IconInfoCircle className="size-5 text-blue-500 mt-0.5 shrink-0" />
							<div className="space-y-2 text-sm">
								<p className="font-medium">What happens next?</p>
								<ul className="list-disc list-inside space-y-1 text-muted-foreground">
									<li>Registrations are reviewed within 24-48 hours</li>
									<li>
										Approvals consider discount %, deal size, contract term, and
										strategic account status
									</li>
									<li>
										After approval, move to proposal and negotiation with the
										customer
									</li>
									<li>
										Final outcomes are tracked as successful or unsuccessful
									</li>
								</ul>
							</div>
						</div>
					</div>
				</form>
				<SheetFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
						{isSubmitting ? "Registering..." : "Register Deal"}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
