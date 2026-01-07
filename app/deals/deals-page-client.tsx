"use client"

import * as React from "react"
import {
  IconDownload,
  IconHelpCircle,
  IconShieldCheck,
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
import { DealsSummaryCards } from "@/components/deals-summary-cards"
import { DealsTable } from "@/components/deals-table"
import { DealRegistrationSheet } from "@/components/deal-registration-sheet"

interface Deal {
  id: number
  dealId: string
  account: string
  stage: string
  value: number
  closeDate: string
  owner: string
  region: string
  status: string
  package: string
  seats: string
  term: string
  lastActivity: string
  contactEmail: string
}

interface DealsPageClientProps {
  data: Deal[]
}

export function DealsPageClient({ data }: DealsPageClientProps) {
  const [isRegisterSheetOpen, setIsRegisterSheetOpen] = React.useState(false)
  const exportTriggerId = "deals-export-trigger"
  const exportContentId = "deals-export-content"

  // Calculate summary metrics
  const activeDeals = data.filter(
    (d) => d.stage !== "Closed Successful" && d.stage !== "Closed Unsuccessful"
  ).length

  const pipelineValue = data
    .filter((d) => d.stage !== "Closed Successful" && d.stage !== "Closed Unsuccessful")
    .reduce((sum, d) => sum + d.value, 0)

  const pendingApproval = data.filter((d) => d.status === "Pending Approval").length

  const atRiskDeals = data.filter(
    (d) => d.status === "At Risk" || d.status === "Conflict"
  ).length

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Deals</h1>
            <p className="text-muted-foreground">
              All partner-registered opportunities with MELP
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
                      <span className="hidden sm:inline">Guidelines</span>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Deal registration guidelines</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <DealsSummaryCards
        activeDeals={activeDeals}
        pipelineValue={pipelineValue}
        pendingApproval={pendingApproval}
        atRiskDeals={atRiskDeals}
      />

      {/* Deals Table */}
      <DealsTable data={data} onRegisterDeal={() => setIsRegisterSheetOpen(true)} />

      {/* Micro-Help Section */}
      <div className="px-4 lg:px-6" id="help">
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <IconShieldCheck className="size-5 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Deal Registration Help</h3>
              <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="font-medium text-foreground">What is deal registration?</p>
                  <p>Protect your sales opportunity by registering it with MELP before engaging the customer.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">What drives approval?</p>
                  <p>Approvals are based on discount %, deal size, contract length, and strategic account status.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">How are discounts handled?</p>
                  <p>Discounts are seat- or term-based; higher discounts trigger additional review.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">SLA for approvals</p>
                  <p>Standard deals: 24-48 hours. Enterprise deals: 3-5 business days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Registration Sheet */}
      <DealRegistrationSheet
        open={isRegisterSheetOpen}
        onOpenChange={setIsRegisterSheetOpen}
      />
    </>
  )
}
