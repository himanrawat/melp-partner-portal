"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Deal pipeline trend chart"

const chartData = [
  { date: "2024-10-01", pipeline: 425000, successful: 85000 },
  { date: "2024-10-08", pipeline: 448000, successful: 92000 },
  { date: "2024-10-15", pipeline: 472000, successful: 105000 },
  { date: "2024-10-22", pipeline: 495000, successful: 118000 },
  { date: "2024-10-29", pipeline: 520000, successful: 135000 },
  { date: "2024-11-05", pipeline: 545000, successful: 148000 },
  { date: "2024-11-12", pipeline: 580000, successful: 165000 },
  { date: "2024-11-19", pipeline: 615000, successful: 182000 },
  { date: "2024-11-26", pipeline: 650000, successful: 198000 },
  { date: "2024-12-03", pipeline: 695000, successful: 225000 },
  { date: "2024-12-10", pipeline: 742000, successful: 258000 },
  { date: "2024-12-17", pipeline: 798000, successful: 285000 },
  { date: "2024-12-24", pipeline: 825000, successful: 298000 },
  { date: "2024-12-31", pipeline: 847500, successful: 312000 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
  },
  pipeline: {
    label: "Pipeline Value",
    color: "var(--primary)",
  },
  successful: {
    label: "Closed Successful",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("30d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-12-31")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Deal Pipeline Trend</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Pipeline value and closed successful value over time
          </span>
          <span className="@[540px]/card:hidden">Pipeline & Revenue</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Quarter</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Quarter" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Quarter
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPipeline" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pipeline)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pipeline)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSuccessful" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-successful)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-successful)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  formatter={(value, name) => {
                    const formattedValue = new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    }).format(value as number)
                    return [formattedValue, name === "pipeline" ? "Pipeline" : "Closed Successful"]
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="successful"
              type="natural"
              fill="url(#fillSuccessful)"
              stroke="var(--color-successful)"
              stackId="a"
            />
            <Area
              dataKey="pipeline"
              type="natural"
              fill="url(#fillPipeline)"
              stroke="var(--color-pipeline)"
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
