"use client"

import * as React from "react"
import {
  IconCoin,
  IconCurrencyDollar,
  IconClock,
  IconCircleCheckFilled,
  IconCircleDashed,
  IconTrendingUp,
  IconCalendar,
  IconDownload,
  IconFileText,
  IconBuildingBank,
  IconInfoCircle,
  IconSearch,
  IconFilter,
  IconChevronDown,
  IconExternalLink,
  IconReceipt,
  IconWallet,
  IconChartBar,
  IconAlertCircle,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Summary {
  earnedThisMonth: number
  pendingCommissions: number
  paidToDate: number
  forecastedCommissions: number
  currency: string
}

interface Commission {
  id: string
  dealId: string
  customer: string
  dealValue: number
  commissionRate: string
  earnedAmount: number
  status: string
  dealCloseDate: string
  expectedPayoutDate?: string
  paidDate?: string
  payoutReference?: string
  notes?: string
}

interface Payout {
  id: string
  date: string
  amount: number
  status: string
  method: string
  reference?: string
  commissionsIncluded: string[]
}

interface PayoutSchedule {
  frequency: string
  payoutDay: string
  minimumPayout: number
  currency: string
  method: string
  nextPayoutDate: string
}

interface TaxDocument {
  id: string
  name: string
  type: string
  uploadDate: string
  status: string
  expiryDate?: string | null
  year?: number
}

interface MonthlyEarning {
  month: string
  amount: number
}

interface RevenueData {
  summary: Summary
  commissions: Commission[]
  payouts: Payout[]
  payoutSchedule: PayoutSchedule
  taxDocuments: TaxDocument[]
  statusDefinitions: Record<string, string>
  monthlyEarnings: MonthlyEarning[]
}

interface RevenuePageClientProps {
  readonly data: RevenueData
}

function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function getStatusIcon(status: string) {
  switch (status) {
    case "paid":
    case "completed":
      return <IconCircleCheckFilled className="size-4 text-green-500" />
    case "approved":
    case "scheduled":
      return <IconClock className="size-4 text-blue-500" />
    case "pending":
      return <IconCircleDashed className="size-4 text-amber-500" />
    default:
      return <IconCircleDashed className="size-4 text-muted-foreground" />
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return (
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
          Paid
        </Badge>
      )
    case "completed":
      return (
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
          Completed
        </Badge>
      )
    case "approved":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
          Approved
        </Badge>
      )
    case "scheduled":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
          Scheduled
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
          Pending
        </Badge>
      )
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

function SummaryCards({ summary }: { summary: Summary }) {
  return (
    <div className="px-4 lg:px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconCoin className="size-4 text-green-600" />
              Earned This Month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {formatCurrency(summary.earnedThisMonth, summary.currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              January 2025
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconClock className="size-4 text-amber-600" />
              Pending Commissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
              {formatCurrency(summary.pendingCommissions, summary.currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting validation
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconWallet className="size-4 text-blue-600" />
              Paid to Date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {formatCurrency(summary.paidToDate, summary.currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconTrendingUp className="size-4 text-purple-600" />
              Forecasted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {formatCurrency(summary.forecastedCommissions, summary.currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Next 30 days
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function EarningsChart({ monthlyEarnings }: { monthlyEarnings: MonthlyEarning[] }) {
  const maxAmount = Math.max(...monthlyEarnings.map((e) => e.amount))

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <IconChartBar className="size-5 text-primary" />
            Monthly Earnings
          </CardTitle>
          <CardDescription>Your commission earnings over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-40">
            {monthlyEarnings.map((earning, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="w-full bg-primary/80 hover:bg-primary rounded-t transition-colors cursor-pointer"
                        style={{
                          height: `${(earning.amount / maxAmount) * 100}%`,
                          minHeight: "4px",
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{formatCurrency(earning.amount)}</p>
                      <p className="text-xs text-muted-foreground">{earning.month}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-xs text-muted-foreground truncate w-full text-center">
                  {earning.month.split(" ")[0].slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CommissionsSection({
  commissions,
  statusDefinitions,
}: {
  commissions: Commission[]
  statusDefinitions: Record<string, string>
}) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")

  const filteredCommissions = React.useMemo(() => {
    return commissions.filter((commission) => {
      const matchesSearch =
        searchQuery === "" ||
        commission.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commission.dealId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commission.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || commission.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [commissions, searchQuery, statusFilter])

  const statusCounts = React.useMemo(() => {
    return commissions.reduce(
      (acc, commission) => {
        acc[commission.status] = (acc[commission.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
  }, [commissions])

  return (
    <div className="space-y-4">
      {/* Status Definitions */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <IconInfoCircle className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Commission Status Definitions</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                {Object.entries(statusDefinitions).map(([status, definition]) => (
                  <div key={status} className="flex items-start gap-1.5">
                    {getStatusIcon(status)}
                    <div>
                      <span className="font-medium capitalize">{status}:</span>{" "}
                      <span className="text-muted-foreground">{definition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search commissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <IconFilter className="size-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending ({statusCounts.pending || 0})</SelectItem>
            <SelectItem value="approved">Approved ({statusCounts.approved || 0})</SelectItem>
            <SelectItem value="paid">Paid ({statusCounts.paid || 0})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Commissions Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commission ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Deal Value</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Earned</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deal Closed</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCommissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <IconSearch className="size-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No commissions found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredCommissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{commission.id}</p>
                      <p className="text-xs text-muted-foreground">{commission.dealId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{commission.customer}</TableCell>
                  <TableCell>{formatCurrency(commission.dealValue)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{commission.commissionRate}</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatCurrency(commission.earnedAmount)}
                  </TableCell>
                  <TableCell>{getStatusBadge(commission.status)}</TableCell>
                  <TableCell>
                    {new Date(commission.dealCloseDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <IconChevronDown className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <IconExternalLink className="size-4 mr-2" />
                          View Deal
                        </DropdownMenuItem>
                        {commission.payoutReference && (
                          <DropdownMenuItem>
                            <IconReceipt className="size-4 mr-2" />
                            View Payout
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function PayoutsSection({
  payouts,
  payoutSchedule,
}: {
  payouts: Payout[]
  payoutSchedule: PayoutSchedule
}) {
  return (
    <div className="space-y-6">
      {/* Payout Schedule */}
      <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                <IconBuildingBank className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payout Schedule</p>
                <p className="font-semibold">{payoutSchedule.frequency} - {payoutSchedule.payoutDay}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Method: {payoutSchedule.method} | Minimum: {formatCurrency(payoutSchedule.minimumPayout)}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-muted-foreground">Next Payout</p>
              <p className="font-semibold">
                {new Date(payoutSchedule.nextPayoutDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payout History</CardTitle>
          <CardDescription>All your payment transactions</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payout ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell className="font-medium">{payout.id}</TableCell>
                <TableCell>
                  {new Date(payout.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium text-green-600">
                  {formatCurrency(payout.amount)}
                </TableCell>
                <TableCell>{getStatusBadge(payout.status)}</TableCell>
                <TableCell>{payout.method}</TableCell>
                <TableCell>
                  {payout.reference ? (
                    <span className="font-mono text-xs">{payout.reference}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function TaxDocumentsSection({ taxDocuments }: { taxDocuments: TaxDocument[] }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <IconFileText className="size-5 text-primary" />
            Tax Documents
          </CardTitle>
          <CardDescription>
            Download your tax forms and compliance documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {taxDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <IconFileText className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.type} | Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={doc.status === "current" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {doc.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="size-8">
                    <IconDownload className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <IconAlertCircle className="size-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Need to update your tax information?</p>
              <p className="text-xs text-muted-foreground mt-1">
                Contact your Partner Manager to update W-9 or banking details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function RevenuePageClient({ data }: RevenuePageClientProps) {
  const [activeTab, setActiveTab] = React.useState("overview")

  const commissionStats = React.useMemo(() => {
    return {
      pending: data.commissions.filter((c) => c.status === "pending").length,
      approved: data.commissions.filter((c) => c.status === "approved").length,
      paid: data.commissions.filter((c) => c.status === "paid").length,
    }
  }, [data.commissions])

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Revenue</h1>
            <p className="text-muted-foreground">
              Track your earnings, commissions, and payouts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <IconDownload className="size-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={data.summary} />

      {/* Earnings Chart */}
      <EarningsChart monthlyEarnings={data.monthlyEarnings} />

      {/* Tabs */}
      <div className="px-4 lg:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">
              Commissions
              <Badge variant="secondary" className="ml-2">
                {data.commissions.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="payouts">
              Payouts
              <Badge variant="secondary" className="ml-2">
                {data.payouts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="tax">Tax Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <CommissionsSection
              commissions={data.commissions}
              statusDefinitions={data.statusDefinitions}
            />
          </TabsContent>

          <TabsContent value="payouts" className="mt-6">
            <PayoutsSection payouts={data.payouts} payoutSchedule={data.payoutSchedule} />
          </TabsContent>

          <TabsContent value="tax" className="mt-6">
            <TaxDocumentsSection taxDocuments={data.taxDocuments} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Help Section */}
      <div className="px-4 lg:px-6">
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Revenue Help</CardTitle>
            <CardDescription>
              Questions about your earnings?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">Commission Calculations</p>
                <p className="text-xs text-muted-foreground">
                  Commissions are calculated based on your partner tier and deal size.
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Payout Timing</p>
                <p className="text-xs text-muted-foreground">
                  Approved commissions are paid on the 15th of each month.
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Disputes</p>
                <p className="text-xs text-muted-foreground">
                  Contact your Partner Manager for commission disputes or questions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
