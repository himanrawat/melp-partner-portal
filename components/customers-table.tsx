"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconSearch,
  IconFilter,
  IconRefresh,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconAlertTriangle,
  IconCircleCheck,
  IconEye,
  IconMail,
  IconCalendar,
} from "@tabler/icons-react"
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
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const contactSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  role: z.string().optional(),
})

export const customerSchema = z.object({
  id: z.number(),
  customerId: z.string(),
  name: z.string(),
  domain: z.string(),
  industry: z.string(),
  region: z.string(),
  plan: z.string(),
  seats: z.number(),
  contractStart: z.string(),
  contractEnd: z.string(),
  renewalType: z.string(),
  adoptionHealth: z.string(),
  activeUsersTrend: z.string(),
  openIssues: z.number(),
  owner: z.string(),
  adminContact: contactSchema,
  billingContact: contactSchema,
  champion: contactSchema,
  riskFlags: z.array(z.string()),
  expansionOpportunities: z.array(z.string()),
  lastActivity: z.string(),
})

type Customer = z.infer<typeof customerSchema>

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Legal",
  "Energy",
  "Transportation",
] as const

const PLANS = ["Starter", "Professional", "Business", "Enterprise"] as const

function getHealthBadge(health: string) {
  switch (health) {
    case "Good":
      return (
        <Badge
          variant="outline"
          className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
        >
          <IconCircleCheck className="size-3 mr-1" />
          Good
        </Badge>
      )
    case "Medium":
      return (
        <Badge
          variant="outline"
          className="text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
        >
          Medium
        </Badge>
      )
    case "Risk":
      return (
        <Badge
          variant="outline"
          className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
        >
          <IconAlertTriangle className="size-3 mr-1" />
          At Risk
        </Badge>
      )
    default:
      return <Badge variant="outline">{health}</Badge>
  }
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case "up":
      return <IconTrendingUp className="size-4 text-green-500" />
    case "down":
      return <IconTrendingDown className="size-4 text-red-500" />
    case "flat":
      return <IconMinus className="size-4 text-muted-foreground" />
    default:
      return null
  }
}


interface CustomersTableProps {
  readonly data: Customer[]
}

export function CustomersTable({ data: initialData }: CustomersTableProps) {
  const [data] = React.useState(() => initialData)
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    domain: false,
    lastActivity: false,
    region: false,
  })
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [activeTab, setActiveTab] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [healthFilter, setHealthFilter] = React.useState<string>("all")
  const [industryFilter, setIndustryFilter] = React.useState<string>("all")
  const [planFilter, setPlanFilter] = React.useState<string>("all")
  const [ownerFilter, setOwnerFilter] = React.useState<string>("all")
  const columnsTriggerId = "customers-columns-trigger"
  const columnsContentId = "customers-columns-content"

  // Get unique owners
  const owners = React.useMemo(
    () => [...new Set(data.map((c) => c.owner))],
    [data]
  )

  // Filter data based on all criteria
  const filteredData = React.useMemo(() => {
    let result = data

    // Tab-based filtering
    const now = new Date()
    switch (activeTab) {
      case "renewing-30":
        const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        result = result.filter((c) => {
          const contractEnd = new Date(c.contractEnd)
          return contractEnd >= now && contractEnd <= thirtyDays
        })
        break
      case "renewing-60":
        const sixtyDays = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
        result = result.filter((c) => {
          const contractEnd = new Date(c.contractEnd)
          return contractEnd >= now && contractEnd <= sixtyDays
        })
        break
      case "renewing-90":
        const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
        result = result.filter((c) => {
          const contractEnd = new Date(c.contractEnd)
          return contractEnd >= now && contractEnd <= ninetyDays
        })
        break
      case "at-risk":
        result = result.filter((c) => c.adoptionHealth === "Risk")
        break
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.customerId.toLowerCase().includes(query) ||
          c.domain.toLowerCase().includes(query)
      )
    }

    // Dropdown filters
    if (healthFilter !== "all") {
      result = result.filter((c) => c.adoptionHealth === healthFilter)
    }
    if (industryFilter !== "all") {
      result = result.filter((c) => c.industry === industryFilter)
    }
    if (planFilter !== "all") {
      result = result.filter((c) => c.plan === planFilter)
    }
    if (ownerFilter !== "all") {
      result = result.filter((c) => c.owner === ownerFilter)
    }

    return result
  }, [data, activeTab, searchQuery, healthFilter, industryFilter, planFilter, ownerFilter])

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <Link
            href={`/customers/${row.original.customerId}`}
            className="font-medium hover:underline"
          >
            {row.original.name}
          </Link>
          <p className="text-xs text-muted-foreground">{row.original.domain}</p>
        </div>
      ),
    },
    {
      accessorKey: "industry",
      header: "Industry",
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {row.original.plan}
        </Badge>
      ),
    },
    {
      accessorKey: "seats",
      header: "Seats",
      cell: ({ row }) => (
        <div className="text-sm">
          <span className="font-medium">{row.original.seats}</span>
        </div>
      ),
    },
    {
      accessorKey: "contractEnd",
      header: "Renewal Date",
      cell: ({ row }) => {
        const date = new Date(row.original.contractEnd)
        const now = new Date()
        const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return (
          <div className="text-sm">
            <p>
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            {daysUntil <= 30 && daysUntil > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {daysUntil} days left
              </p>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "adoptionHealth",
      header: "Health",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {getHealthBadge(row.original.adoptionHealth)}
          {getTrendIcon(row.original.activeUsersTrend)}
        </div>
      ),
    },
    {
      accessorKey: "openIssues",
      header: "Issues",
      cell: ({ row }) => (
        <span
          className={
            row.original.openIssues > 0
              ? "text-amber-600 dark:text-amber-400 font-medium"
              : "text-muted-foreground"
          }
        >
          {row.original.openIssues}
        </span>
      ),
    },
    {
      accessorKey: "owner",
      header: "Owner",
    },
    {
      accessorKey: "domain",
      header: "Domain",
    },
    {
      accessorKey: "region",
      header: "Region",
    },
    {
      accessorKey: "lastActivity",
      header: "Last Activity",
      cell: ({ row }) => {
        const date = new Date(row.original.lastActivity)
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const actionTriggerId = `customer-${row.original.id}-actions-trigger`
        const actionContentId = `customer-${row.original.id}-actions-content`
        return (
          <div className="flex justify-end gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8" asChild>
                    <Link href={`/customers/${row.original.customerId}`}>
                      <IconEye className="size-4" />
                      <span className="sr-only">View customer</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Details</TooltipContent>
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
                  <IconMail className="size-4 mr-2" />
                  Contact Admin
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconCalendar className="size-4 mr-2" />
                  Schedule Review
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <IconEye className="size-4 mr-2" />
                  View Full Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

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
  })

  // Count for tabs
  const now = new Date()
  const renewingIn30 = data.filter((c) => {
    const contractEnd = new Date(c.contractEnd)
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    return contractEnd >= now && contractEnd <= thirtyDays
  }).length

  const atRiskCount = data.filter((c) => c.adoptionHealth === "Risk").length

  const clearFilters = () => {
    setSearchQuery("")
    setHealthFilter("all")
    setIndustryFilter("all")
    setPlanFilter("all")
    setOwnerFilter("all")
  }

  const hasActiveFilters =
    searchQuery ||
    healthFilter !== "all" ||
    industryFilter !== "all" ||
    planFilter !== "all" ||
    ownerFilter !== "all"

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full flex-col justify-start gap-6"
    >
      {/* Tab Navigation */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="customer-view-selector" className="sr-only">
          View
        </Label>
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="customer-view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            <SelectItem value="renewing-30">Renewing in 30 days</SelectItem>
            <SelectItem value="renewing-60">Renewing in 60 days</SelectItem>
            <SelectItem value="renewing-90">Renewing in 90 days</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="renewing-30">
            Renewing in 30 days
            {renewingIn30 > 0 && <Badge variant="secondary">{renewingIn30}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="renewing-60">Renewing in 60 days</TabsTrigger>
          <TabsTrigger value="renewing-90">Renewing in 90 days</TabsTrigger>
          <TabsTrigger value="at-risk">
            At Risk
            {atRiskCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              >
                {atRiskCount}
              </Badge>
            )}
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
                    typeof column.accessorFn !== "undefined" && column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id === "contractEnd" ? "Renewal Date" : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2 px-4 lg:px-6">
        <div className="relative flex-1 min-w-50 max-w-sm">
          <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={healthFilter} onValueChange={setHealthFilter}>
          <SelectTrigger className="w-[130px]" size="sm">
            <SelectValue placeholder="Health" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Health</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Risk">At Risk</SelectItem>
          </SelectContent>
        </Select>
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-[140px]" size="sm">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[130px]" size="sm">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            {PLANS.map((plan) => (
              <SelectItem key={plan} value={plan}>
                {plan}
              </SelectItem>
            ))}
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
                    <EmptyStateNoResults onClearFilters={clearFilters} />
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
            customer(s)
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="customers-rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-20" id="customers-rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
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
  )
}

function EmptyStateNoResults({
  onClearFilters,
}: {
  onClearFilters: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8">
      <div className="rounded-full bg-muted p-4 mb-4">
        <IconFilter className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        No customers match these filters
      </h3>
      <p className="text-muted-foreground mb-4">
        Try adjusting your search or filter criteria
      </p>
      <Button variant="outline" onClick={onClearFilters}>
        <IconRefresh className="size-4 mr-2" />
        Clear filters
      </Button>
    </div>
  )
}
