import { IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Pipeline Value</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						$847,500
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							+18.2%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Pipeline growing strong <IconTrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Total value of active deals
					</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Avg Deal Size</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						$92,000
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							+6.1%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Typical deal size trending up <IconTrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">Based on active pipeline</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Avg Seats per Deal</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						240
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							+12
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Higher seat counts this quarter{" "}
						<IconTrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Average seats across active deals
					</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Win Rate</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						31%
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							+2.4%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Successful outcomes improving <IconTrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Closed successful vs total closed
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
