"use client"

import { IconTrendingUp, IconClock, IconAlertTriangle } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DealsSummaryCardsProps {
  activeDeals: number
  pipelineValue: number
  pendingApproval: number
  atRiskDeals: number
}

export function DealsSummaryCards({
  activeDeals,
  pipelineValue,
  pendingApproval,
  atRiskDeals,
}: DealsSummaryCardsProps) {
  const formattedPipeline = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pipelineValue)

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Deals</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeDeals}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-3" />
              In Progress
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Deals currently in pipeline
          </div>
          <div className="text-muted-foreground">
            Excludes closed successful/unsuccessful
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pipeline Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formattedPipeline}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-3" />
              Total
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total value of active deals
          </div>
          <div className="text-muted-foreground">
            Based on expected close
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Awaiting Approval</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pendingApproval}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-amber-600 dark:text-amber-400">
              <IconClock className="size-3" />
              Pending
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Deals needing review
          </div>
          <div className="text-muted-foreground">
            Avg approval time: 24-48 hrs
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>At-Risk Deals</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {atRiskDeals}
          </CardTitle>
          <CardAction>
            {atRiskDeals > 0 ? (
              <Badge variant="outline" className="text-orange-600 dark:text-orange-400">
                <IconAlertTriangle className="size-3" />
                Attention
              </Badge>
            ) : (
              <Badge variant="outline" className="text-green-600 dark:text-green-400">
                All Clear
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {atRiskDeals > 0 ? "Requires immediate action" : "No deals at risk"}
          </div>
          <div className="text-muted-foreground">
            Conflicts or stalled deals
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
