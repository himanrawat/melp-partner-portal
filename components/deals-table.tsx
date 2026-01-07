"use client";

import * as React from "react";
import {
	IconChevronDown,
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconCircleCheckFilled,
	IconAlertCircle,
	IconClock,
	IconPlus,
	IconDownload,
	IconEye,
	IconNote,
	IconUpload,
	IconSearch,
	IconFilter,
	IconRefresh,
	IconCircleDot,
	IconSend,
	IconUsers,
	IconListCheck,
	IconFileDescription,
	IconCheck,
	IconCircleXFilled,
} from "@tabler/icons-react";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export const dealSchema = z.object({
	id: z.number(),
	dealId: z.string(),
	account: z.string(),
	stage: z.string(),
	value: z.number(),
	closeDate: z.string(),
	owner: z.string(),
	region: z.string(),
	status: z.string(),
	package: z.string(),
	seats: z.string(),
	term: z.string(),
	lastActivity: z.string(),
	contactEmail: z.string(),
});

type Deal = z.infer<typeof dealSchema>;

// Deal stages as specified
const DEAL_STAGES = [
	"Lead Captured",
	"Qualified",
	"Deal Registered",
	"Approved",
	"Proposal Shared",
	"Negotiation",
	"Closed Successful",
	"Closed Unsuccessful",
] as const;

function getStageIcon(stage: string) {
	switch (stage) {
		case "Lead Captured":
			return <IconCircleDot className="size-4 text-muted-foreground" />;
		case "Qualified":
			return <IconListCheck className="size-4 text-blue-500" />;
		case "Deal Registered":
			return <IconFileDescription className="size-4 text-indigo-500" />;
		case "Approved":
			return <IconCheck className="size-4 text-green-500" />;
		case "Proposal Shared":
			return <IconSend className="size-4 text-purple-500" />;
		case "Negotiation":
			return <IconUsers className="size-4 text-amber-500" />;
		case "Closed Successful":
			return <IconCircleCheckFilled className="size-4 fill-green-500" />;
		case "Closed Unsuccessful":
			return <IconCircleXFilled className="size-4 fill-red-500" />;
		default:
			return <IconClock className="size-4 text-muted-foreground" />;
	}
}

function getStatusBadge(status: string) {
	switch (status) {
		case "Approved":
			return (
				<Badge
					variant="outline"
					className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
				>
					{status}
				</Badge>
			);
		case "Pending Approval":
			return (
				<Badge
					variant="outline"
					className="text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
				>
					{status}
				</Badge>
			);
		case "Conflict":
			return (
				<Badge
					variant="outline"
					className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
				>
					<IconAlertCircle className="size-3 mr-1" />
					{status}
				</Badge>
			);
		case "At Risk":
			return (
				<Badge
					variant="outline"
					className="text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800"
				>
					<IconAlertCircle className="size-3 mr-1" />
					{status}
				</Badge>
			);
		default:
			return <Badge variant="outline">{status}</Badge>;
	}
}

interface DealsTableProps {
	readonly data: Deal[];
	readonly onRegisterDeal: () => void;
}

export function DealsTable({
	data: initialData,
	onRegisterDeal,
}: DealsTableProps) {
	const [data] = React.useState(() => initialData);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({
			lastActivity: false,
			contactEmail: false,
		});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [activeTab, setActiveTab] = React.useState("all");
	const [searchQuery, setSearchQuery] = React.useState("");
	const [stageFilter, setStageFilter] = React.useState<string>("all");
	const [statusFilter, setStatusFilter] = React.useState<string>("all");
	const [ownerFilter, setOwnerFilter] = React.useState<string>("all");
	const [regionFilter, setRegionFilter] = React.useState<string>("all");
	const columnsTriggerId = "deals-columns-trigger";
	const columnsContentId = "deals-columns-content";

	// Get unique values for filter dropdowns
	const owners = React.useMemo(
		() => [...new Set(data.map((d) => d.owner))],
		[data]
	);
	const regions = React.useMemo(
		() => [...new Set(data.map((d) => d.region))],
		[data]
	);
	// Filter data based on all criteria
	const filteredData = React.useMemo(() => {
		let result = data;

		// Tab-based filtering
		switch (activeTab) {
			case "my-deals":
				result = result.filter((d) => d.owner === "John Smith"); // Would use logged-in owner
				break;
			case "pending":
				result = result.filter((d) => d.status === "Pending Approval");
				break;
			case "closing-month":
				const now = new Date();
				const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
				result = result.filter((d) => {
					const closeDate = new Date(d.closeDate);
					return closeDate >= now && closeDate <= monthEnd;
				});
				break;
			case "successful-unsuccessful":
				result = result.filter(
					(d) =>
						d.stage === "Closed Successful" || d.stage === "Closed Unsuccessful"
				);
				break;
		}

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(d) =>
					d.account.toLowerCase().includes(query) ||
					d.dealId.toLowerCase().includes(query) ||
					d.contactEmail.toLowerCase().includes(query)
			);
		}

		// Dropdown filters
		if (stageFilter !== "all") {
			result = result.filter((d) => d.stage === stageFilter);
		}
		if (statusFilter !== "all") {
			result = result.filter((d) => d.status === statusFilter);
		}
		if (ownerFilter !== "all") {
			result = result.filter((d) => d.owner === ownerFilter);
		}
		if (regionFilter !== "all") {
			result = result.filter((d) => d.region === regionFilter);
		}

		return result;
	}, [
		data,
		activeTab,
		searchQuery,
		stageFilter,
		statusFilter,
		ownerFilter,
		regionFilter,
	]);

	const columns: ColumnDef<Deal>[] = [
		{
			accessorKey: "dealId",
			header: "Deal ID",
			cell: ({ row }) => (
				<Button variant="link" className="text-foreground px-0 font-medium">
					{row.original.dealId}
				</Button>
			),
		},
		{
			accessorKey: "account",
			header: "Account",
			cell: ({ row }) => (
				<div className="font-medium">{row.original.account}</div>
			),
		},
		{
			accessorKey: "stage",
			header: "Stage",
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					{getStageIcon(row.original.stage)}
					<span className="text-sm">{row.original.stage}</span>
				</div>
			),
		},
		{
			accessorKey: "package",
			header: "Package",
			cell: ({ row }) => (
				<Badge variant="secondary" className="font-normal">
					{row.original.package}
				</Badge>
			),
		},
		{
			accessorKey: "seats",
			header: "Seats",
		},
		{
			accessorKey: "term",
			header: "Term",
		},
		{
			accessorKey: "value",
			header: () => <div className="text-right">Deal Value</div>,
			cell: ({ row }) => {
				const value = row.original.value;
				const formatted = new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
					minimumFractionDigits: 0,
				}).format(value);
				return <div className="text-right font-medium">{formatted}</div>;
			},
		},
		{
			accessorKey: "closeDate",
			header: "Expected Close",
			cell: ({ row }) => {
				const date = new Date(row.original.closeDate);
				return date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				});
			},
		},
		{
			accessorKey: "status",
			header: "Approval Status",
			cell: ({ row }) => getStatusBadge(row.original.status),
		},
		{
			accessorKey: "owner",
			header: "Owner",
		},
		{
			accessorKey: "lastActivity",
			header: "Last Activity",
			cell: ({ row }) => {
				const date = new Date(row.original.lastActivity);
				return date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				});
			},
		},
		{
			accessorKey: "region",
			header: "Region",
		},
		{
			accessorKey: "contactEmail",
			header: "Contact",
			cell: ({ row }) => (
				<span className="text-muted-foreground text-sm">
					{row.original.contactEmail}
				</span>
			),
		},
		{
			id: "actions",
			header: () => <div className="text-right">Actions</div>,
			cell: ({ row }) => {
				const actionTriggerId = `deal-${row.original.id}-actions-trigger`;
				const actionContentId = `deal-${row.original.id}-actions-content`;
				return (
					<div className="flex justify-end gap-1">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="ghost" size="icon" className="size-8">
										<IconEye className="size-4" />
										<span className="sr-only">View deal</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>View Deal</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<DropdownMenu>
							<DropdownMenuTrigger
								asChild
								id={actionTriggerId}
								aria-controls={actionContentId}
							>
								<Button variant="ghost" size="icon" className="size-8">
									<IconChevronDown className="size-4" />
									<span className="sr-only">More actions</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								id={actionContentId}
								aria-labelledby={actionTriggerId}
								align="end"
							>
								<DropdownMenuItem>
									<IconNote className="size-4 mr-2" />
									Add Note
								</DropdownMenuItem>
								<DropdownMenuItem>
									<IconUpload className="size-4 mr-2" />
									Upload Document
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								{row.original.status !== "Approved" && (
									<DropdownMenuItem>
										<IconCheck className="size-4 mr-2" />
										Request Approval
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				);
			},
		},
	];

	const table = useReactTable({
		data: filteredData,
		columns,
		state: {
			sorting,
			columnVisibility,
			columnFilters,
			pagination,
		},
		getRowId: (row) => row.id.toString(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const pendingCount = data.filter(
		(d) => d.status === "Pending Approval"
	).length;
	const closingThisMonth = data.filter((d) => {
		const now = new Date();
		const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		const closeDate = new Date(d.closeDate);
		return closeDate >= now && closeDate <= monthEnd;
	}).length;

	const clearFilters = () => {
		setSearchQuery("");
		setStageFilter("all");
		setStatusFilter("all");
		setOwnerFilter("all");
		setRegionFilter("all");
	};

	const hasActiveFilters =
		searchQuery ||
		stageFilter !== "all" ||
		statusFilter !== "all" ||
		ownerFilter !== "all" ||
		regionFilter !== "all";

	return (
		<Tabs
			value={activeTab}
			onValueChange={setActiveTab}
			className="w-full flex-col justify-start gap-6"
		>
			{/* Tab Navigation */}
			<div className="flex items-center justify-between px-4 lg:px-6">
				<Label htmlFor="view-selector" className="sr-only">
					View
				</Label>
				<Select value={activeTab} onValueChange={setActiveTab}>
					<SelectTrigger
						className="flex w-fit @4xl/main:hidden"
						size="sm"
						id="view-selector"
					>
						<SelectValue placeholder="Select a view" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Deals</SelectItem>
						<SelectItem value="my-deals">My Deals</SelectItem>
						<SelectItem value="pending">Pending Approval</SelectItem>
						<SelectItem value="closing-month">Closing This Month</SelectItem>
						<SelectItem value="successful-unsuccessful">
							Successful / Unsuccessful
						</SelectItem>
					</SelectContent>
				</Select>
				<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
					<TabsTrigger value="all">All Deals</TabsTrigger>
					<TabsTrigger value="my-deals">My Deals</TabsTrigger>
					<TabsTrigger value="pending">
						Pending Approval{" "}
						{pendingCount > 0 && (
							<Badge variant="secondary">{pendingCount}</Badge>
						)}
					</TabsTrigger>
					<TabsTrigger value="closing-month">
						Closing This Month{" "}
						{closingThisMonth > 0 && (
							<Badge variant="secondary">{closingThisMonth}</Badge>
						)}
					</TabsTrigger>
					<TabsTrigger value="successful-unsuccessful">
						Successful / Unsuccessful
					</TabsTrigger>
				</TabsList>
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger
							asChild
							id={columnsTriggerId}
							aria-controls={columnsContentId}
						>
							<Button variant="outline" size="sm">
								Columns
								<IconChevronDown className="ml-1 size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							id={columnsContentId}
							aria-labelledby={columnsTriggerId}
							align="end"
							className="w-48"
						>
							{table
								.getAllColumns()
								.filter(
									(column) =>
										typeof column.accessorFn !== "undefined" &&
										column.getCanHide()
								)
								.map((column) => (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id === "closeDate" ? "Expected Close" : column.id}
									</DropdownMenuCheckboxItem>
								))}
						</DropdownMenuContent>
					</DropdownMenu>
					<Button variant="outline" size="sm">
						<IconDownload className="size-4" />
						<span className="hidden lg:inline">Export</span>
					</Button>
					<Button size="sm" onClick={onRegisterDeal}>
						<IconPlus className="size-4" />
						<span className="hidden lg:inline">Register Deal</span>
					</Button>
				</div>
			</div>

			{/* Filters Row */}
			<div className="flex flex-wrap items-center gap-2 px-4 lg:px-6">
				<div className="relative flex-1 min-w-50 max-w-sm">
					<IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						placeholder="Search by account, deal ID, or email..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>
				<Select value={stageFilter} onValueChange={setStageFilter}>
					<SelectTrigger className="w-[150px]" size="sm">
						<SelectValue placeholder="Stage" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Stages</SelectItem>
						{DEAL_STAGES.map((stage) => (
							<SelectItem key={stage} value={stage}>
								{stage}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-[160px]" size="sm">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Statuses</SelectItem>
						<SelectItem value="Approved">Approved</SelectItem>
						<SelectItem value="Pending Approval">Pending Approval</SelectItem>
						<SelectItem value="Conflict">Conflict</SelectItem>
						<SelectItem value="At Risk">At Risk</SelectItem>
					</SelectContent>
				</Select>
				<Select value={ownerFilter} onValueChange={setOwnerFilter}>
					<SelectTrigger className="w-[140px]" size="sm">
						<SelectValue placeholder="Owner" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Owners</SelectItem>
						{owners.map((owner) => (
							<SelectItem key={owner} value={owner}>
								{owner}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={regionFilter} onValueChange={setRegionFilter}>
					<SelectTrigger className="w-[140px]" size="sm">
						<SelectValue placeholder="Region" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Regions</SelectItem>
						{regions.map((region) => (
							<SelectItem key={region} value={region}>
								{region}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{hasActiveFilters && (
					<Button variant="ghost" size="sm" onClick={clearFilters}>
						<IconRefresh className="size-4 mr-1" />
						Clear
					</Button>
				)}
			</div>

			<TabsContent
				value={activeTab}
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
				<div className="overflow-hidden rounded-lg border">
					<Table>
						<TableHeader className="bg-muted sticky top-0 z-10">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-48">
										{data.length === 0 ? (
											<EmptyStateNoDeals onRegisterDeal={onRegisterDeal} />
										) : (
											<EmptyStateNoResults onClearFilters={clearFilters} />
										)}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{/* Pagination */}
				<div className="flex items-center justify-between px-4">
					<div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
						Showing {table.getRowModel().rows.length} of {filteredData.length}{" "}
						deal(s)
					</div>
					<div className="flex w-full items-center gap-8 lg:w-fit">
						<div className="hidden items-center gap-2 lg:flex">
							<Label htmlFor="rows-per-page" className="text-sm font-medium">
								Rows per page
							</Label>
							<Select
								value={`${table.getState().pagination.pageSize}`}
								onValueChange={(value) => table.setPageSize(Number(value))}
							>
								<SelectTrigger size="sm" className="w-20" id="rows-per-page">
									<SelectValue
										placeholder={table.getState().pagination.pageSize}
									/>
								</SelectTrigger>
								<SelectContent side="top">
									{[10, 20, 30, 40, 50].map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex w-fit items-center justify-center text-sm font-medium">
							Page {table.getState().pagination.pageIndex + 1} of{" "}
							{table.getPageCount() || 1}
						</div>
						<div className="ml-auto flex items-center gap-2 lg:ml-0">
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Go to first page</span>
								<IconChevronsLeft className="size-4" />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Go to previous page</span>
								<IconChevronLeft className="size-4" />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Go to next page</span>
								<IconChevronRight className="size-4" />
							</Button>
							<Button
								variant="outline"
								className="hidden size-8 lg:flex"
								size="icon"
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Go to last page</span>
								<IconChevronsRight className="size-4" />
							</Button>
						</div>
					</div>
				</div>
			</TabsContent>
		</Tabs>
	);
}

// Empty state when no deals exist
function EmptyStateNoDeals({ onRegisterDeal }: { onRegisterDeal: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center text-center py-8">
			<div className="rounded-full bg-muted p-4 mb-4">
				<IconFileDescription className="size-8 text-muted-foreground" />
			</div>
			<h3 className="text-lg font-semibold mb-2">
				You haven&apos;t registered any deals yet
			</h3>
			<p className="text-muted-foreground mb-4 max-w-sm">
				Deal registration helps protect your sales opportunities and ensures you
				receive proper commission for your work.
			</p>
			<Button onClick={onRegisterDeal}>
				<IconPlus className="size-4 mr-2" />
				Register your first deal
			</Button>
		</div>
	);
}

// Empty state when filters return nothing
function EmptyStateNoResults({
	onClearFilters,
}: {
	onClearFilters: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center text-center py-8">
			<div className="rounded-full bg-muted p-4 mb-4">
				<IconFilter className="size-8 text-muted-foreground" />
			</div>
			<h3 className="text-lg font-semibold mb-2">
				No deals match these filters
			</h3>
			<p className="text-muted-foreground mb-4">
				Try adjusting your search or filter criteria
			</p>
			<Button variant="outline" onClick={onClearFilters}>
				<IconRefresh className="size-4 mr-2" />
				Clear filters
			</Button>
		</div>
	);
}
