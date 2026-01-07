"use client"

import * as React from "react"
import {
  IconDownload,
  IconHelpCircle,
  IconHeartHandshake,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CustomersSummaryCards } from "@/components/customers-summary-cards"
import { CustomersTable } from "@/components/customers-table"

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

interface CustomersPageClientProps {
  data: Customer[]
}

export function CustomersPageClient({ data }: CustomersPageClientProps) {
  const exportTriggerId = "customers-export-trigger"
  const exportContentId = "customers-export-content"

  // Calculate summary metrics
  const totalCustomers = data.length
  const totalSeats = data.reduce((sum, c) => sum + c.seats, 0)

  // Renewals in next 90 days
  const now = new Date()
  const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
  const upcomingRenewals = data.filter((c) => {
    const contractEnd = new Date(c.contractEnd)
    return contractEnd >= now && contractEnd <= ninetyDaysFromNow
  }).length

  // At-risk customers
  const atRiskCustomers = data.filter((c) => c.adoptionHealth === "Risk").length

  // Good health customers
  const healthyCustomers = data.filter((c) => c.adoptionHealth === "Good").length

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">
              Manage your won accounts, track health, and identify expansion opportunities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                id={exportTriggerId}
                aria-controls={exportContentId}
              >
                <Button variant="outline" size="sm">
                  <IconDownload className="size-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                id={exportContentId}
                aria-labelledby={exportTriggerId}
                align="end"
              >
                <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#help">
                      <IconHelpCircle className="size-4" />
                      <span className="hidden sm:inline">Help</span>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Customer management help</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <CustomersSummaryCards
        totalCustomers={totalCustomers}
        totalSeats={totalSeats}
        upcomingRenewals={upcomingRenewals}
        atRiskCustomers={atRiskCustomers}
        healthyCustomers={healthyCustomers}
      />

      {/* Customers Table */}
      <CustomersTable data={data} />

      {/* Micro-Help Section */}
      <div className="px-4 lg:px-6" id="help">
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <IconHeartHandshake className="size-5 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Customer Success Tips</h3>
              <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="font-medium text-foreground">Adoption Health</p>
                  <p>Health is based on active users trend, feature usage, and admin activity signals.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Expansion Signals</p>
                  <p>Look for customers with high seat utilization and good adoption for upsell opportunities.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Renewal Prep</p>
                  <p>Start renewal conversations 60-90 days before contract end. Check health scores first.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Risk Mitigation</p>
                  <p>At-risk accounts need immediate attention. Schedule a check-in call and review usage.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
