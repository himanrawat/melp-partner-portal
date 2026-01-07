import Link from "next/link";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2">
						<div className="flex flex-col items-center justify-center gap-6 pt-[calc(var(--header-height)+1rem)] pb-4 md:gap-8 md:pb-6 min-h-[calc(100vh-var(--header-height))]">
							<div className="text-center space-y-4">
								<h1 className="text-8xl font-bold text-muted-foreground">404</h1>
								<h2 className="text-2xl font-semibold">Page Not Found</h2>
								<p className="text-muted-foreground max-w-md">
									Sorry, the page you are looking for doesn&apos;t exist or has been moved.
								</p>
							</div>
							<div className="flex gap-4">
								<Button asChild>
									<Link href="/dashboard">Go to Dashboard</Link>
								</Button>
								<Button variant="outline" asChild>
									<Link href="/">Go Home</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
