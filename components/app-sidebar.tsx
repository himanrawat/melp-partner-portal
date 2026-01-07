"use client";

import * as React from "react";
import {
	IconLayoutDashboard,
	IconBriefcase,
	IconUsers,
	IconBook,
	IconCertificate,
	IconReceipt,
	IconCoin,
	IconHeadset,
	IconSpeakerphone,
	IconSettings,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Logo } from "@/components/logo";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	SidebarMenu,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

function SidebarLogo() {
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

	return (
		<a
			href="/dashboard"
			className="cursor-pointer flex items-center justify-center"
		>
			{isCollapsed ? (
				<Image
					src="/logo-short.svg"
					alt="MELP"
					width={32}
					height={32}
					className="h-8 w-8"
				/>
			) : (
				<Logo className="h-auto w-39.5" aria-label="MELP" />
			)}
		</a>
	);
}

const data = {
	user: {
		name: "John Smith",
		email: "john.smith@tatatele.com",
		avatar: "/avatars/partner.svg",
		company: "Tata Teleservices",
		tier: "Gold" as const,
	},
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: IconLayoutDashboard,
		},
		{
			title: "Deals",
			url: "/deals",
			icon: IconBriefcase,
		},
		{
			title: "Customers",
			url: "/customers",
			icon: IconUsers,
		},
		{
			title: "Enablement",
			url: "/enablement",
			icon: IconBook,
		},
		{
			title: "Training",
			url: "/training",
			icon: IconCertificate,
		},
		{
			title: "Quotes & Pricing",
			url: "/quotes",
			icon: IconReceipt,
		},
		{
			title: "Revenue",
			url: "/revenue",
			icon: IconCoin,
		},
		{
			title: "Support",
			url: "/support",
			icon: IconHeadset,
		},
		{
			title: "Announcements",
			url: "/announcements",
			icon: IconSpeakerphone,
		},
		{
			title: "Settings",
			url: "/settings",
			icon: IconSettings,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarLogo />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
