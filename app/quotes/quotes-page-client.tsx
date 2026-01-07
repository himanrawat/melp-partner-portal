"use client"

import * as React from "react"
import {
  IconReceipt,
  IconPlus,
  IconSearch,
  IconClock,
  IconCircleCheckFilled,
  IconCircleDashed,
  IconSend,
  IconFileText,
  IconAlertTriangle,
  IconInfoCircle,
  IconChevronDown,
  IconPercentage,
  IconUsers,
  IconCalendar,
  IconMapPin,
  IconCurrencyDollar,
  IconEye,
  IconCopy,
  IconExternalLink,
  IconFilter,
  IconX,
  IconShieldCheck,
  IconSparkles,
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
import { Label } from "@/components/ui/label"
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

interface Plan {
  id: string
  name: string
  description: string
  seatRange: string
  highlights: string[]
  usageLimits: {
    aiSummaries: string
    translationMinutes: string
    storagePerUser: string
  }
  recommended?: boolean
}

interface Factor {
  factor: string
  description: string
  impact: string
}

interface PartnerTier {
  tier: string
  baseDiscount: string
  maxWithoutApproval: string
  description: string
}

interface ApprovalThreshold {
  condition: string
  approvalRequired: boolean
  approver: string
  sla: string
}

interface Quote {
  id: string
  dealId: string
  customer: string
  plan: string
  seats: number
  term: string
  region: string
  totalValue: number
  discountApplied: string
  status: string
  createdDate: string
  validUntil?: string
  submittedBy: string
  approvedBy?: string
  sentDate?: string
  pendingApprover?: string
}

interface QuotesData {
  pricing: {
    overview: {
      title: string
      description: string
      pricingModel: string
    }
    plans: Plan[]
    factors: Factor[]
  }
  discountRules: {
    partnerTiers: PartnerTier[]
    approvalThresholds: ApprovalThreshold[]
    currentPartnerTier: string
  }
  quotes: Quote[]
  quoteStatusDefinitions: Record<string, string>
}

interface QuotesPageClientProps {
  readonly data: QuotesData
}

function getStatusIcon(status: string) {
  switch (status) {
    case "approved":
      return <IconCircleCheckFilled className="size-4 text-green-500" />
    case "sent":
      return <IconSend className="size-4 text-blue-500" />
    case "pending_approval":
      return <IconClock className="size-4 text-amber-500" />
    case "draft":
      return <IconFileText className="size-4 text-muted-foreground" />
    case "expired":
      return <IconAlertTriangle className="size-4 text-red-500" />
    case "accepted":
      return <IconCircleCheckFilled className="size-4 text-emerald-500" />
    case "rejected":
      return <IconX className="size-4 text-red-500" />
    default:
      return <IconCircleDashed className="size-4 text-muted-foreground" />
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return (
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
          Approved
        </Badge>
      )
    case "sent":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
          Sent
        </Badge>
      )
    case "pending_approval":
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
          Pending Approval
        </Badge>
      )
    case "draft":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Draft
        </Badge>
      )
    case "expired":
      return (
        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
          Expired
        </Badge>
      )
    case "accepted":
      return (
        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
          Accepted
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
          Rejected
        </Badge>
      )
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function PricingOverviewSection({ pricing }: { pricing: QuotesData["pricing"] }) {
  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Unified Product Banner */}
      <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <IconSparkles className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{pricing.overview.title}</h3>
              <p className="text-muted-foreground mt-1">{pricing.overview.description}</p>
              <Badge variant="secondary" className="mt-2">
                {pricing.overview.pricingModel}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div>
        <h3 className="font-semibold mb-4">Available Plans</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pricing.plans.map((plan) => (
            <Card
              key={plan.id}
              className={plan.recommended ? "border-primary ring-1 ring-primary" : ""}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  {plan.recommended && (
                    <Badge variant="default" className="text-xs">
                      Recommended
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <IconUsers className="size-4 text-muted-foreground" />
                  <span>{plan.seatRange}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Includes:</p>
                  <ul className="text-xs space-y-0.5">
                    {plan.highlights.slice(0, 4).map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <IconCircleCheckFilled className="size-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Usage Limits:</p>
                  <div className="text-xs space-y-0.5 text-muted-foreground">
                    <p>AI Summaries: {plan.usageLimits.aiSummaries}</p>
                    <p>Translation: {plan.usageLimits.translationMinutes}</p>
                    <p>Storage: {plan.usageLimits.storagePerUser}/user</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <IconInfoCircle className="size-5 text-primary" />
            What Affects Pricing
          </CardTitle>
          <CardDescription>
            Factors that may influence the final quote
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pricing.factors.map((factor, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-sm font-medium">{factor.factor}</p>
                <p className="text-xs text-muted-foreground">{factor.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {factor.impact}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DiscountRulesSection({ discountRules }: { discountRules: QuotesData["discountRules"] }) {
  const currentTier = discountRules.partnerTiers.find(
    (t) => t.tier === discountRules.currentPartnerTier
  )

  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Current Tier Banner */}
      <Card className="bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
                <IconShieldCheck className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Partner Tier</p>
                <p className="text-xl font-semibold text-amber-700 dark:text-amber-400">
                  {discountRules.currentPartnerTier}
                </p>
              </div>
            </div>
            {currentTier && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Your Discount Range</p>
                <p className="text-lg font-semibold">
                  {currentTier.baseDiscount} - {currentTier.maxWithoutApproval}
                </p>
                <p className="text-xs text-muted-foreground">without approval</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Partner Tier Discounts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <IconPercentage className="size-5 text-primary" />
            Partner Tier Discounts
          </CardTitle>
          <CardDescription>
            Discount levels by partner tier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier</TableHead>
                <TableHead>Base Discount</TableHead>
                <TableHead>Max Without Approval</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discountRules.partnerTiers.map((tier) => (
                <TableRow
                  key={tier.tier}
                  className={tier.tier === discountRules.currentPartnerTier ? "bg-primary/5" : ""}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {tier.tier}
                      {tier.tier === discountRules.currentPartnerTier && (
                        <Badge variant="outline" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{tier.baseDiscount}</TableCell>
                  <TableCell>{tier.maxWithoutApproval}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {tier.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Approval Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <IconClock className="size-5 text-primary" />
            When Approval is Required
          </CardTitle>
          <CardDescription>
            Conditions that require additional approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {discountRules.approvalThresholds.map((threshold, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <IconAlertTriangle className="size-5 text-amber-500" />
                  <div>
                    <p className="font-medium text-sm">{threshold.condition}</p>
                    <p className="text-xs text-muted-foreground">
                      Approver: {threshold.approver}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{threshold.sla}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function QuoteRequestSection() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <IconPlus className="size-5 text-primary" />
            Request a Quote
          </CardTitle>
          <CardDescription>
            Submit a quote request for a customer deal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name</Label>
                <Input id="customer" placeholder="Enter customer name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deal">Link to Deal (Optional)</Label>
                <Select>
                  <SelectTrigger id="deal">
                    <SelectValue placeholder="Select existing deal or create new" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Create new deal</SelectItem>
                    <SelectItem value="d-2024-089">D-2024-089 - Acme Corp</SelectItem>
                    <SelectItem value="d-2024-092">D-2024-092 - TechStart Inc</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  If no deal exists, one will be auto-created
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select>
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seats">Number of Seats</Label>
                <Input id="seats" type="number" placeholder="e.g., 100" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="term">Contract Term</Label>
                <Select>
                  <SelectTrigger id="term">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="2-year">2-Year</SelectItem>
                    <SelectItem value="3-year">3-Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="na">North America</SelectItem>
                    <SelectItem value="emea">EMEA</SelectItem>
                    <SelectItem value="apac">APAC</SelectItem>
                    <SelectItem value="latam">LATAM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Special Requests (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="e.g., Custom usage limits, specific compliance needs"
                />
              </div>
              <div className="pt-4">
                <Button className="w-full">
                  <IconReceipt className="size-4 mr-2" />
                  Submit Quote Request
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  You&apos;ll receive a quote within 24 hours
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function QuoteHistorySection({
  quotes,
  statusDefinitions,
}: {
  quotes: Quote[]
  statusDefinitions: Record<string, string>
}) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")

  const filteredQuotes = React.useMemo(() => {
    return quotes.filter((quote) => {
      const matchesSearch =
        searchQuery === "" ||
        quote.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.dealId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || quote.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [quotes, searchQuery, statusFilter])

  const statusCounts = React.useMemo(() => {
    return quotes.reduce(
      (acc, quote) => {
        acc[quote.status] = (acc[quote.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
  }, [quotes])

  return (
    <div className="px-4 lg:px-6 space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search quotes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <IconFilter className="size-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft ({statusCounts.draft || 0})</SelectItem>
              <SelectItem value="pending_approval">
                Pending ({statusCounts.pending_approval || 0})
              </SelectItem>
              <SelectItem value="approved">Approved ({statusCounts.approved || 0})</SelectItem>
              <SelectItem value="sent">Sent ({statusCounts.sent || 0})</SelectItem>
              <SelectItem value="expired">Expired ({statusCounts.expired || 0})</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <IconPlus className="size-4 mr-2" />
            New Quote
          </Button>
        </div>
      </div>

      {/* Status Definitions */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <IconInfoCircle className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
              <TooltipProvider>
                {Object.entries(statusDefinitions).map(([status, definition]) => (
                  <Tooltip key={status}>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1 cursor-help">
                        {getStatusIcon(status)}
                        <span className="capitalize">{status.replace("_", " ")}</span>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{definition}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <IconSearch className="size-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No quotes found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{quote.id}</p>
                      <p className="text-xs text-muted-foreground">{quote.dealId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{quote.customer}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{quote.plan}</Badge>
                  </TableCell>
                  <TableCell>{quote.seats}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(quote.totalValue)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{quote.discountApplied}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(quote.status)}
                      {quote.pendingApprover && (
                        <span className="text-xs text-muted-foreground">
                          ({quote.pendingApprover})
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {quote.validUntil ? (
                      <span className="text-sm">
                        {new Date(quote.validUntil).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
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
                          <IconEye className="size-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconCopy className="size-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconExternalLink className="size-4 mr-2" />
                          View Deal
                        </DropdownMenuItem>
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

export function QuotesPageClient({ data }: QuotesPageClientProps) {
  const [activeTab, setActiveTab] = React.useState("pricing")

  const quoteStats = React.useMemo(() => {
    return {
      total: data.quotes.length,
      pending: data.quotes.filter((q) => q.status === "pending_approval").length,
      approved: data.quotes.filter((q) => q.status === "approved").length,
      sent: data.quotes.filter((q) => q.status === "sent").length,
    }
  }, [data.quotes])

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Quotes & Pricing</h1>
            <p className="text-muted-foreground">
              Pricing information, discount rules, and quote management
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600">
              {quoteStats.approved} approved
            </Badge>
            <Badge variant="outline" className="text-amber-600">
              {quoteStats.pending} pending
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4 lg:px-6">
        <TabsList>
          <TabsTrigger value="pricing">Pricing Overview</TabsTrigger>
          <TabsTrigger value="discounts">Discount Rules</TabsTrigger>
          <TabsTrigger value="request">Request Quote</TabsTrigger>
          <TabsTrigger value="history">
            Quote History
            <Badge variant="secondary" className="ml-2">
              {quoteStats.total}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="mt-6 space-y-0">
          <PricingOverviewSection pricing={data.pricing} />
        </TabsContent>

        <TabsContent value="discounts" className="mt-6 space-y-0">
          <DiscountRulesSection discountRules={data.discountRules} />
        </TabsContent>

        <TabsContent value="request" className="mt-6 space-y-0">
          <QuoteRequestSection />
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-0">
          <QuoteHistorySection
            quotes={data.quotes}
            statusDefinitions={data.quoteStatusDefinitions}
          />
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <div className="px-4 lg:px-6">
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Pricing & Quote Help</CardTitle>
            <CardDescription>
              Need assistance with quotes or pricing?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">Quote Approval SLA</p>
                <p className="text-xs text-muted-foreground">
                  Standard quotes: 24 hours. Large deals (100K+): 48 hours.
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Discount Questions</p>
                <p className="text-xs text-muted-foreground">
                  Contact your Partner Manager for discount exceptions.
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Custom Pricing</p>
                <p className="text-xs text-muted-foreground">
                  Enterprise deals with custom terms require Legal review.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
