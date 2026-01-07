"use client"

import {
  IconUsers,
  IconArmchair,
  IconCalendarDue,
  IconAlertTriangle,
  IconCircleCheck,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CustomersSummaryCardsProps {
  totalCustomers: number
  totalSeats: number
  upcomingRenewals: number
  atRiskCustomers: number
  healthyCustomers: number
}

export function CustomersSummaryCards({
  totalCustomers,
  totalSeats,
  upcomingRenewals,
  atRiskCustomers,
  healthyCustomers,
}: CustomersSummaryCardsProps) {
  const formattedSeats = new Intl.NumberFormat("en-US").format(totalSeats)

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCustomers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers className="size-3" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {formattedSeats} total seats
          </div>
          <div className="text-muted-foreground">
            Across all customer accounts
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Upcoming Renewals</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {upcomingRenewals}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-amber-600 dark:text-amber-400">
              <IconCalendarDue className="size-3" />
              90 days
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Renewals in next 90 days
          </div>
          <div className="text-muted-foreground">
            Start conversations early
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>At-Risk Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {atRiskCustomers}
          </CardTitle>
          <CardAction>
            {atRiskCustomers > 0 ? (
              <Badge variant="outline" className="text-red-600 dark:text-red-400">
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
            {atRiskCustomers > 0 ? "Needs immediate attention" : "No at-risk accounts"}
          </div>
          <div className="text-muted-foreground">
            Low adoption or usage decline
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Healthy Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {healthyCustomers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600 dark:text-green-400">
              <IconCircleCheck className="size-3" />
              Good
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong adoption signals
          </div>
          <div className="text-muted-foreground">
            Consider expansion opportunities
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
