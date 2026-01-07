"use client";

import * as React from "react";
import {
	IconSearch,
	IconPresentation,
	IconSwords,
	IconDeviceDesktop,
	IconReceipt,
	IconCode,
	IconSpeakerphone,
	IconBell,
	IconDownload,
	IconExternalLink,
	IconFileText,
	IconVideo,
	IconTemplate,
	IconChecklist,
	IconBook,
	IconFileDescription,
	IconClock,
	IconSparkles,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Resource {
	id: string;
	title: string;
	description: string;
	type: string;
	format?: string;
	updatedAt?: string;
	date?: string;
	downloadUrl: string;
	duration?: string;
	highlights?: string[];
}

interface ResourcesData {
	sales: Resource[];
	competitive: Resource[];
	demo: Resource[];
	pricing: Resource[];
	technical: Resource[];
	marketing: Resource[];
	updates: Resource[];
}

interface ResourcesPageClientProps {
	data: ResourcesData;
}

const CATEGORY_CONFIG = {
	sales: {
		title: "Sales Resources",
		description:
			"Pitch decks, one-pagers, discovery guides, and email templates",
		icon: IconPresentation,
	},
	competitive: {
		title: "Competitive Resources",
		description: "Battle cards, objection handling, and talk tracks",
		icon: IconSwords,
	},
	demo: {
		title: "Demo & Product",
		description: "Demo scripts, videos, and product walkthroughs",
		icon: IconDeviceDesktop,
	},
	pricing: {
		title: "Pricing & Packaging",
		description: "Plans overview, discount rules, and quote process",
		icon: IconReceipt,
	},
	technical: {
		title: "Technical & Implementation",
		description: "Security docs, SSO guides, and implementation checklists",
		icon: IconCode,
	},
	marketing: {
		title: "Marketing Resources",
		description: "Case studies, logos, and co-branding materials",
		icon: IconSpeakerphone,
	},
	updates: {
		title: "Release & Updates",
		description: "What's new, what to pitch, and pricing changes",
		icon: IconBell,
	},
};

function getFormatIcon(format?: string) {
	if (!format) return null;
	switch (format.toUpperCase()) {
		case "PDF":
			return <IconFileText className="size-4" />;
		case "PPTX":
			return <IconPresentation className="size-4" />;
		case "MP4":
			return <IconVideo className="size-4" />;
		case "DOCX":
			return <IconTemplate className="size-4" />;
		case "ZIP":
			return <IconFileDescription className="size-4" />;
		default:
			return <IconFileText className="size-4" />;
	}
}

function getTypeIcon(type: string) {
	switch (type.toLowerCase()) {
		case "presentation":
			return <IconPresentation className="size-4 text-blue-500" />;
		case "one-pager":
			return <IconFileText className="size-4 text-green-500" />;
		case "battle card":
			return <IconSwords className="size-4 text-red-500" />;
		case "video":
			return <IconVideo className="size-4 text-purple-500" />;
		case "script":
			return <IconBook className="size-4 text-amber-500" />;
		case "checklist":
			return <IconChecklist className="size-4 text-teal-500" />;
		case "guide":
			return <IconBook className="size-4 text-indigo-500" />;
		case "template":
			return <IconTemplate className="size-4 text-pink-500" />;
		case "case study":
			return <IconFileDescription className="size-4 text-emerald-500" />;
		case "release notes":
			return <IconSparkles className="size-4 text-violet-500" />;
		default:
			return <IconFileText className="size-4 text-muted-foreground" />;
	}
}

function ResourceCard({ resource }: { resource: Resource }) {
	const displayDate = resource.updatedAt || resource.date;

	return (
		<Card className="group hover:shadow-md transition-shadow">
			<CardContent className="px-4">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-1">
							{getTypeIcon(resource.type)}
							<Badge variant="outline" className="text-xs">
								{resource.type}
							</Badge>
							{resource.duration && (
								<Badge variant="secondary" className="text-xs">
									<IconClock className="size-3 mr-1" />
									{resource.duration}
								</Badge>
							)}
						</div>
						<h3 className="font-medium truncate">{resource.title}</h3>
						<p className="text-sm text-muted-foreground line-clamp-2 mt-1">
							{resource.description}
						</p>
						{resource.highlights && resource.highlights.length > 0 && (
							<div className="flex flex-wrap gap-1 mt-2">
								{resource.highlights.map((highlight, idx) => (
									<Badge key={idx} variant="secondary" className="text-xs">
										{highlight}
									</Badge>
								))}
							</div>
						)}
						<div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
							{resource.format && (
								<span className="flex items-center gap-1">
									{getFormatIcon(resource.format)}
									{resource.format}
								</span>
							)}
							{displayDate && (
								<span>
									Updated{" "}
									{new Date(displayDate).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</span>
							)}
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<Button
							variant="ghost"
							size="icon"
							className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<IconDownload className="size-4" />
							<span className="sr-only">Download</span>
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<IconExternalLink className="size-4" />
							<span className="sr-only">Open</span>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function CategorySection({
	category,
	resources,
	searchQuery,
}: {
	category: keyof typeof CATEGORY_CONFIG;
	resources: Resource[];
	searchQuery: string;
}) {
	const config = CATEGORY_CONFIG[category];
	const Icon = config.icon;

	const filteredResources = searchQuery
		? resources.filter(
				(r) =>
					r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
					r.type.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: resources;

	if (searchQuery && filteredResources.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<Icon className="size-5" />
				</div>
				<div>
					<h2 className="font-semibold">{config.title}</h2>
					<p className="text-sm text-muted-foreground">{config.description}</p>
				</div>
				<Badge variant="secondary" className="ml-auto">
					{filteredResources.length} resources
				</Badge>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{filteredResources.map((resource) => (
					<ResourceCard key={resource.id} resource={resource} />
				))}
			</div>
		</div>
	);
}

export function ResourcesPageClient({ data }: ResourcesPageClientProps) {
	const [searchQuery, setSearchQuery] = React.useState("");
	const [activeTab, setActiveTab] = React.useState("all");

	const totalResources =
		data.sales.length +
		data.competitive.length +
		data.demo.length +
		data.pricing.length +
		data.technical.length +
		data.marketing.length +
		data.updates.length;

	const categories = [
		"sales",
		"competitive",
		"demo",
		"pricing",
		"technical",
		"marketing",
		"updates",
	] as const;

	return (
		<>
			{/* Page Header */}
			<div className="flex flex-col gap-1 px-4 lg:px-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">
							Resources
						</h1>
						<p className="text-muted-foreground">
							Resources to sell, position, and deliver MELP
						</p>
					</div>
					<Badge variant="outline" className="w-fit">
						{totalResources} resources available
					</Badge>
				</div>
			</div>

			{/* Search */}
			<div className="px-4 lg:px-6">
				<div className="relative max-w-md">
					<IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						placeholder="Search resources..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			{/* Tabbed Content */}
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="px-4 lg:px-6"
			>
				<TabsList className="flex-wrap h-auto gap-2">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="sales">Sales</TabsTrigger>
					<TabsTrigger value="competitive">Competitive</TabsTrigger>
					<TabsTrigger value="demo">Demo</TabsTrigger>
					<TabsTrigger value="pricing">Pricing</TabsTrigger>
					<TabsTrigger value="technical">Technical</TabsTrigger>
					<TabsTrigger value="marketing">Marketing</TabsTrigger>
					<TabsTrigger value="updates">
						Updates
						{data.updates.length > 0 && (
							<Badge variant="secondary" className="ml-1">
								{data.updates.length}
							</Badge>
						)}
					</TabsTrigger>
				</TabsList>

				{/* All Categories View */}
				<TabsContent value="all" className="mt-6 space-y-8">
					{categories.map((category) => (
						<CategorySection
							key={category}
							category={category}
							resources={data[category]}
							searchQuery={searchQuery}
						/>
					))}
					{searchQuery &&
						categories.every((cat) => {
							const filtered = data[cat].filter(
								(r) =>
									r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
									r.description
										.toLowerCase()
										.includes(searchQuery.toLowerCase()) ||
									r.type.toLowerCase().includes(searchQuery.toLowerCase())
							);
							return filtered.length === 0;
						}) && (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<IconSearch className="size-12 text-muted-foreground mb-4" />
								<h3 className="text-lg font-medium">No resources found</h3>
								<p className="text-muted-foreground">
									Try adjusting your search query
								</p>
								<Button
									variant="outline"
									className="mt-4"
									onClick={() => setSearchQuery("")}
								>
									Clear search
								</Button>
							</div>
						)}
				</TabsContent>

				{/* Individual Category Views */}
				{categories.map((category) => (
					<TabsContent key={category} value={category} className="mt-6">
						<CategorySection
							category={category}
							resources={data[category]}
							searchQuery={searchQuery}
						/>
					</TabsContent>
				))}
			</Tabs>

			{/* Quick Links Help Section */}
			<div className="px-4 lg:px-6">
				<Card className="bg-muted/30">
					<CardHeader>
						<CardTitle className="text-base">Need Something Else?</CardTitle>
						<CardDescription>
							Can&apos;t find what you&apos;re looking for? Here are some quick
							actions.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2 mt-2">
							<Button variant="outline" size="sm" asChild>
								<a href="#">
									<IconExternalLink className="size-4 mr-1" />
									Request a Quote
								</a>
							</Button>
							<Button variant="outline" size="sm" asChild>
								<a href="#">
									<IconExternalLink className="size-4 mr-1" />
									Book a Demo
								</a>
							</Button>
							<Button variant="outline" size="sm" asChild>
								<a href="#">
									<IconExternalLink className="size-4 mr-1" />
									Contact Partner Team
								</a>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
