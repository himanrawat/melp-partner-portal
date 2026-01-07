"use client"

import * as React from "react"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconAlertCircle,
  IconClock,
  IconX,
  IconPlus,
  IconFileText,
  IconEye,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const schema = z.object({
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
})

type Deal = z.infer<typeof schema>

function getStageIcon(stage: string) {
  switch (stage) {
    case "Closed Successful":
      return <IconCircleCheckFilled className="size-4 fill-green-500" />
    case "Closed Unsuccessful":
      return <IconX className="size-4 text-red-500" />
    case "Negotiation":
    case "Proposal":
      return <IconClock className="size-4 text-blue-500" />
    default:
      return <IconClock className="size-4 text-muted-foreground" />
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "Approved":
      return (
        <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
          {status}
        </Badge>
      )
    case "Pending Approval":
      return (
        <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800">
          {status}
        </Badge>
      )
    case "Conflict":
      return (
        <Badge variant="outline" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
          <IconAlertCircle className="size-3 mr-1" />
          {status}
        </Badge>
      )
    case "At Risk":
      return (
        <Badge variant="outline" className="text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800">
          <IconAlertCircle className="size-3 mr-1" />
          {status}
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

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
        <span>{row.original.stage}</span>
      </div>
    ),
  },
  {
    accessorKey: "closeDate",
    header: "Close Date",
    cell: ({ row }) => {
      const date = new Date(row.original.closeDate)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    },
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
      const value = row.original.value
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(value)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "region",
    header: "Region",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.original.status),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: () => (
      <div className="flex justify-end">
        <Button variant="ghost" size="icon" className="size-8">
          <IconEye className="size-4" />
          <span className="sr-only">View deal</span>
        </Button>
      </div>
    ),
  },
]

export function DataTable({ data: initialData }: { data: Deal[] }) {
  const [data] = React.useState(() => initialData)
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [activeTab, setActiveTab] = React.useState("all")
  const columnsTriggerId = "data-table-columns-trigger"
  const columnsContentId = "data-table-columns-content"

  const filteredData = React.useMemo(() => {
    switch (activeTab) {
      case "pending":
        return data.filter((d) => d.status === "Pending Approval" || d.status === "Conflict" || d.status === "At Risk")
      case "successful":
        return data.filter((d) => d.stage === "Closed Successful")
      case "approvals":
        return data.filter((d) => d.status === "Pending Approval")
      default:
        return data
    }
  }, [data, activeTab])

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

  const pendingCount = data.filter((d) => d.status === "Pending Approval" || d.status === "Conflict" || d.status === "At Risk").length
  const approvalsCount = data.filter((d) => d.status === "Pending Approval").length

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">My Deals</SelectItem>
          <SelectItem value="pending">Pending Actions</SelectItem>
          <SelectItem value="successful">Successful Deals</SelectItem>
          <SelectItem value="approvals">Approvals Needed</SelectItem>
        </SelectContent>
      </Select>
      <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
        <TabsTrigger value="all">My Deals</TabsTrigger>
        <TabsTrigger value="pending">
          Pending Actions {pendingCount > 0 && <Badge variant="secondary">{pendingCount}</Badge>}
        </TabsTrigger>
        <TabsTrigger value="successful">Successful Deals</TabsTrigger>
        <TabsTrigger value="approvals">
          Approvals Needed {approvalsCount > 0 && <Badge variant="secondary">{approvalsCount}</Badge>}
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
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <IconFileText className="size-4" />
            <span className="hidden lg:inline">Request Quote</span>
          </Button>
          <Button size="sm">
            <IconPlus className="size-4" />
            <span className="hidden lg:inline">Register Deal</span>
          </Button>
        </div>
      </div>

      <TabsContent value={activeTab} className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No deals found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Showing {table.getRowModel().rows.length} of {filteredData.length} deal(s)
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
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
