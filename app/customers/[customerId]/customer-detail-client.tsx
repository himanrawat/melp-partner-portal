"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconArrowLeft,
  IconBuilding,
  IconMail,
  IconPhone,
  IconUser,
  IconCalendar,
  IconUsers,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconAlertTriangle,
  IconCircleCheck,
  IconTicket,
  IconArrowUpRight,
  IconFileText,
  IconDownload,
  IconExternalLink,
  IconRefresh,
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
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Contact {
  name: string
  email: string
  phone?: string
  role?: string
}

interface Customer {
  id: number
  customerId: string
  name: string
  domain: string
  industry: string
  region: string
  plan: string
  seats: number
  seatsUsed: number
  products: string[]
  contractStart: string
  contractEnd: string
  renewalType: string
  adoptionHealth: string
  activeUsersTrend: string
  openIssues: number
  owner: string
  adminContact: Contact
  billingContact: Contact
  champion: Contact
  riskFlags: string[]
  expansionOpportunities: string[]
  lastActivity: string
}

interface CustomerDetailClientProps {
  customer: Customer
}

function getHealthBadge(health: string) {
  switch (health) {
    case "Good":
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
          <IconCircleCheck className="size-3 mr-1" />
          Good Health
        </Badge>
      )
    case "Medium":
      return (
        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
          Medium Health
        </Badge>
      )
    case "Risk":
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
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
      return (
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <IconTrendingUp className="size-4" />
          <span className="text-sm">Increasing</span>
        </div>
      )
    case "down":
      return (
        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
          <IconTrendingDown className="size-4" />
          <span className="text-sm">Declining</span>
        </div>
      )
    case "flat":
      return (
        <div className="flex items-center gap-1 text-muted-foreground">
          <IconMinus className="size-4" />
          <span className="text-sm">Stable</span>
        </div>
      )
    default:
      return null
  }
}

export function CustomerDetailClient({ customer }: CustomerDetailClientProps) {
  const contractStart = new Date(customer.contractStart)
  const contractEnd = new Date(customer.contractEnd)
  const now = new Date()
  const daysUntilRenewal = Math.ceil(
    (contractEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )
  const seatUtilization = Math.round((customer.seatsUsed / customer.seats) * 100)

  // Mock tickets data
  const tickets = [
    { id: "T-1001", subject: "SSO configuration issue", severity: "Medium", status: "Open", created: "2024-12-28" },
    { id: "T-1002", subject: "API rate limiting questions", severity: "Low", status: "Pending", created: "2024-12-25" },
  ]

  // Mock documents
  const documents = [
    { name: "Master Service Agreement", type: "Contract", date: "2024-01-15" },
    { name: "Implementation Checklist", type: "Implementation", date: "2024-01-20" },
    { name: "Q4 2024 Invoice", type: "Invoice", date: "2024-12-01" },
  ]

  return (
    <>
      {/* Page Header with Breadcrumb */}
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/customers" className="hover:text-foreground flex items-center gap-1">
            <IconArrowLeft className="size-4" />
            Back to Customers
          </Link>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <IconBuilding className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">{customer.name}</h1>
                {getHealthBadge(customer.adoptionHealth)}
              </div>
              <p className="text-muted-foreground">{customer.domain}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <IconMail className="size-4" />
              Contact
            </Button>
            <Button variant="outline" size="sm">
              <IconCalendar className="size-4" />
              Schedule Review
            </Button>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="px-4 lg:px-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="health">Usage & Health</TabsTrigger>
          <TabsTrigger value="tickets">
            Tickets
            {customer.openIssues > 0 && (
              <Badge variant="secondary" className="ml-1">
                {customer.openIssues}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="expansion">Expansion</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* 1. Account Overview */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Basic account details and contract info</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer ID</p>
                    <p className="font-medium">{customer.customerId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="font-medium">{customer.industry}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Region</p>
                    <p className="font-medium">{customer.region}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Partner Owner</p>
                    <p className="font-medium">{customer.owner}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
                <CardDescription>Subscription and renewal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <Badge variant="secondary">{customer.plan}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Renewal Type</p>
                    <p className="font-medium">{customer.renewalType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contract Start</p>
                    <p className="font-medium">
                      {contractStart.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contract End</p>
                    <p className="font-medium">
                      {contractEnd.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {daysUntilRenewal <= 90 && daysUntilRenewal > 0 && (
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3 text-sm">
                    <p className="font-medium text-amber-700 dark:text-amber-300">
                      Renewal in {daysUntilRenewal} days
                    </p>
                    <p className="text-amber-600 dark:text-amber-400">
                      Consider starting renewal conversation
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Products & Seats</CardTitle>
                <CardDescription>Enabled features and license utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Enabled Products</p>
                    <div className="flex flex-wrap gap-2">
                      {customer.products.map((product) => (
                        <Badge key={product} variant="outline">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Seat Utilization</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-semibold">
                          {customer.seatsUsed} / {customer.seats}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {seatUtilization}% used
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            seatUtilization >= 90
                              ? "bg-green-500"
                              : seatUtilization >= 60
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${seatUtilization}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. Contacts */}
        <TabsContent value="contacts" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUser className="size-5" />
                  Admin Contact
                </CardTitle>
                <CardDescription>Primary technical administrator</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{customer.adminContact.name}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconMail className="size-4" />
                  <a href={`mailto:${customer.adminContact.email}`} className="hover:underline">
                    {customer.adminContact.email}
                  </a>
                </div>
                {customer.adminContact.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconPhone className="size-4" />
                    {customer.adminContact.phone}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUser className="size-5" />
                  Billing Contact
                </CardTitle>
                <CardDescription>Finance and billing inquiries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{customer.billingContact.name}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconMail className="size-4" />
                  <a href={`mailto:${customer.billingContact.email}`} className="hover:underline">
                    {customer.billingContact.email}
                  </a>
                </div>
                {customer.billingContact.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconPhone className="size-4" />
                    {customer.billingContact.phone}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUsers className="size-5" />
                  Champion / Power User
                </CardTitle>
                <CardDescription>Key advocate within the organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{customer.champion.name}</p>
                  {customer.champion.role && (
                    <p className="text-sm text-muted-foreground">{customer.champion.role}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconMail className="size-4" />
                  <a href={`mailto:${customer.champion.email}`} className="hover:underline">
                    {customer.champion.email}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUser className="size-5" />
                  Partner Account Owner
                </CardTitle>
                <CardDescription>Your team's account manager</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{customer.owner}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 3. Usage & Health */}
        <TabsContent value="health" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Adoption Health</CardTitle>
                <CardDescription>Overall account health signals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Status</span>
                  {getHealthBadge(customer.adoptionHealth)}
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Active Users Trend</span>
                    {getTrendIcon(customer.activeUsersTrend)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Seat Utilization</span>
                    <span className={`font-medium ${
                      seatUtilization >= 80 ? "text-green-600" : seatUtilization >= 50 ? "text-amber-600" : "text-red-600"
                    }`}>
                      {seatUtilization}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Activity</span>
                    <span className="font-medium">
                      {new Date(customer.lastActivity).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Flags</CardTitle>
                <CardDescription>Issues requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                {customer.riskFlags.length > 0 ? (
                  <ul className="space-y-3">
                    {customer.riskFlags.map((flag, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <IconAlertTriangle className="size-4 text-red-500 mt-0.5" />
                        <span className="text-sm">{flag}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <IconCircleCheck className="size-8 text-green-500 mb-2" />
                    <p className="font-medium">No risk flags</p>
                    <p className="text-sm text-muted-foreground">
                      This account is in good standing
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Feature Adoption</CardTitle>
                <CardDescription>Which MELP features are being used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {["Chat", "Meetings", "AI Summaries", "Translation"].map((feature) => {
                    const isEnabled = customer.products.includes(feature)
                    return (
                      <div
                        key={feature}
                        className={`rounded-lg border p-4 ${
                          isEnabled ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950" : "border-muted"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{feature}</span>
                          {isEnabled ? (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Enabled</Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 4. Tickets & Issues */}
        <TabsContent value="tickets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconTicket className="size-5" />
                Open Support Tickets
              </CardTitle>
              <CardDescription>
                Track open issues for this customer. Partners can view but not resolve tickets.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customer.openIssues > 0 ? (
                <div className="space-y-4">
                  {tickets.slice(0, customer.openIssues).map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{ticket.id}</span>
                          <Badge
                            variant="outline"
                            className={
                              ticket.severity === "High"
                                ? "text-red-600 border-red-200"
                                : ticket.severity === "Medium"
                                ? "text-amber-600 border-amber-200"
                                : "text-muted-foreground"
                            }
                          >
                            {ticket.severity}
                          </Badge>
                        </div>
                        <p className="text-sm">{ticket.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          Opened {new Date(ticket.created).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={ticket.status === "Open" ? "default" : "secondary"}>
                        {ticket.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <IconCircleCheck className="size-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">No open tickets</h3>
                  <p className="text-muted-foreground">
                    This customer has no active support issues
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Expansion & Renewal Opportunities */}
        <TabsContent value="expansion" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconArrowUpRight className="size-5" />
                  Expansion Opportunities
                </CardTitle>
                <CardDescription>Suggested upsell and cross-sell opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                {customer.expansionOpportunities.length > 0 ? (
                  <ul className="space-y-3">
                    {customer.expansionOpportunities.map((opportunity, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 rounded-lg border p-3"
                      >
                        <IconArrowUpRight className="size-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground">
                      No expansion opportunities identified yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconRefresh className="size-5" />
                  Renewal Information
                </CardTitle>
                <CardDescription>Upcoming renewal details and notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Renewal Date</span>
                    <span className="font-medium">
                      {contractEnd.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Days Until Renewal</span>
                    <span
                      className={`font-medium ${
                        daysUntilRenewal <= 30
                          ? "text-red-600"
                          : daysUntilRenewal <= 60
                          ? "text-amber-600"
                          : "text-green-600"
                      }`}
                    >
                      {daysUntilRenewal} days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Renewal Type</span>
                    <Badge variant="outline">{customer.renewalType}</Badge>
                  </div>
                </div>
                {daysUntilRenewal <= 90 && (
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      Renewal Reminder
                    </p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      This account is due for renewal soon. Review health signals and prepare talking points.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 6. Documents */}
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconFileText className="size-5" />
                Customer Documents
              </CardTitle>
              <CardDescription>
                Contracts, invoices, and implementation notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <IconFileText className="size-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.type} • {new Date(doc.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="size-8">
                        <IconExternalLink className="size-4" />
                        <span className="sr-only">View document</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8">
                        <IconDownload className="size-4" />
                        <span className="sr-only">Download document</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
