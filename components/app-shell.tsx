import type { CSSProperties, ReactNode } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Default sidebar width; override via `sidebarWidth` prop if needed.
// const DEFAULT_SIDEBAR_WIDTH = "calc(var(--spacing) * 72)";
const DEFAULT_SIDEBAR_WIDTH = "15rem";
const DEFAULT_HEADER_HEIGHT = "calc(var(--spacing) * 12)";
const DEFAULT_CONTENT_CLASSNAME = "flex flex-col gap-4 py-4 md:gap-6 md:py-6";

type AppShellProps = {
	children: ReactNode;
	sidebarWidth?: string;
	headerHeight?: string;
	containerClassName?: string;
	contentClassName?: string;
};

export function AppShell({
	children,
	sidebarWidth = DEFAULT_SIDEBAR_WIDTH,
	headerHeight = DEFAULT_HEADER_HEIGHT,
	containerClassName,
	contentClassName = DEFAULT_CONTENT_CLASSNAME,
}: AppShellProps) {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": sidebarWidth,
					"--header-height": headerHeight,
				} as CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				<div className="flex flex-1 flex-col">
					<div
						className={cn(
							"@container/main flex flex-1 flex-col gap-2",
							containerClassName
						)}
					>
						<div className={contentClassName}>{children}</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
