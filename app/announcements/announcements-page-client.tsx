"use client"

import * as React from "react"
import {
  IconSpeakerphone,
  IconSearch,
  IconSparkles,
  IconShieldCheck,
  IconCalendar,
  IconAlertTriangle,
  IconChevronRight,
  IconExternalLink,
  IconClock,
  IconFilter,
  IconBox,
  IconHash,
  IconBookmark,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

interface Announcement {
  id: string
  title: string
  category: string
  date: string
  isPinned?: boolean
  summary: string
  content: string
  whatChanged?: string
  whyItMatters?: string
  whatToSay?: string
  appliesTo?: string[]
  actionRequired?: boolean
  actionText?: string
  author: string
  effectiveDate?: string
  eventDate?: string
  eventTime?: string
  eventLocation?: string
  registrationLink?: string
  resourceLink?: string
  tags?: string[]
}

interface AnnouncementsData {
  pinnedAnnouncements: Announcement[]
  announcements: Announcement[]
  categories: Category[]
}

interface AnnouncementsPageClientProps {
  readonly data: AnnouncementsData
}

function getCategoryIcon(iconName: string) {
  switch (iconName) {
    case "sparkles":
      return <IconSparkles className="size-4" />
    case "shield":
      return <IconShieldCheck className="size-4" />
    case "megaphone":
      return <IconSpeakerphone className="size-4" />
    case "calendar":
      return <IconCalendar className="size-4" />
    default:
      return <IconSpeakerphone className="size-4" />
  }
}

function getCategoryColor(color: string) {
  switch (color) {
    case "purple":
      return "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800"
    case "blue":
      return "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800"
    case "green":
      return "text-green-600 bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"
    case "amber":
      return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"
    default:
      return "text-muted-foreground bg-muted"
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })
}

function formatEventDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function PinnedAnnouncementCard({
  announcement,
  categories,
}: {
  announcement: Announcement
  categories: Category[]
}) {
  const category = categories.find((c) => c.id === announcement.category)

  return (
    <Card className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 dark:border-amber-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <IconBookmark className="size-5 text-amber-600" />
            <Badge
              variant="outline"
              className={`${category ? getCategoryColor(category.color) : ""}`}
            >
              {category && getCategoryIcon(category.icon)}
              <span className="ml-1">{category?.name || announcement.category}</span>
            </Badge>
            {announcement.actionRequired && (
              <Badge variant="destructive" className="text-xs">
                Action Required
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatDate(announcement.date)}
          </span>
        </div>
        <CardTitle className="text-lg mt-2">{announcement.title}</CardTitle>
        <CardDescription>{announcement.summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{announcement.content}</p>

        {announcement.effectiveDate && (
          <div className="flex items-center gap-2 text-sm rounded-lg bg-background/80 p-2 border">
            <IconClock className="size-4 text-amber-600" />
            <span className="font-medium">Effective Date:</span>
            <span>{formatEventDate(announcement.effectiveDate)}</span>
          </div>
        )}

        {announcement.actionText && (
          <Button variant="default" size="sm">
            {announcement.actionText}
            <IconChevronRight className="size-4 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function AnnouncementCard({
  announcement,
  categories,
}: {
  announcement: Announcement
  categories: Category[]
}) {
  const category = categories.find((c) => c.id === announcement.category)
  const isEvent = announcement.category === "event"

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={`${category ? getCategoryColor(category.color) : ""}`}
            >
              {category && getCategoryIcon(category.icon)}
              <span className="ml-1">{category?.name || announcement.category}</span>
            </Badge>
            {announcement.actionRequired && (
              <Badge variant="destructive" className="text-xs">
                Action Required
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatDate(announcement.date)}
          </span>
        </div>
        <CardTitle className="text-base mt-2">{announcement.title}</CardTitle>
        <CardDescription>{announcement.summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{announcement.content}</p>

        {/* Event Details */}
        {isEvent && announcement.eventDate && (
          <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <IconCalendar className="size-4 text-primary" />
              <span className="font-medium">{formatEventDate(announcement.eventDate)}</span>
              {announcement.eventTime && (
                <span className="text-muted-foreground">at {announcement.eventTime}</span>
              )}
            </div>
            {announcement.eventLocation && (
              <p className="text-sm text-muted-foreground">{announcement.eventLocation}</p>
            )}
            {announcement.registrationLink && (
              <Button variant="outline" size="sm">
                Register Now
                <IconExternalLink className="size-4 ml-1" />
              </Button>
            )}
          </div>
        )}

        {/* Partner-Friendly Context */}
        {(announcement.whatChanged || announcement.whyItMatters || announcement.whatToSay) && (
          <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
            {announcement.whatChanged && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  What Changed
                </p>
                <p className="text-sm mt-1">{announcement.whatChanged}</p>
              </div>
            )}
            {announcement.whyItMatters && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Why It Matters
                </p>
                <p className="text-sm mt-1">{announcement.whyItMatters}</p>
              </div>
            )}
            {announcement.whatToSay && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  What to Say to Customers
                </p>
                <p className="text-sm mt-1">{announcement.whatToSay}</p>
              </div>
            )}
          </div>
        )}

        {/* Applies To */}
        {announcement.appliesTo && announcement.appliesTo.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Applies to:</span>
            {announcement.appliesTo.map((plan) => (
              <Badge key={plan} variant="secondary" className="text-xs">
                {plan}
              </Badge>
            ))}
          </div>
        )}

        {/* Tags */}
        {announcement.tags && announcement.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <IconHash className="size-3 text-muted-foreground" />
            {announcement.tags.map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Resource Link */}
        {announcement.resourceLink && (
          <Button variant="link" size="sm" className="px-0">
            View related resources
            <IconExternalLink className="size-4 ml-1" />
          </Button>
        )}

        {/* Action Button */}
        {announcement.actionText && !isEvent && (
          <Button variant="outline" size="sm">
            {announcement.actionText}
            <IconChevronRight className="size-4 ml-1" />
          </Button>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">Posted by {announcement.author}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function AnnouncementFeed({
  announcements,
  categories,
  searchQuery,
  categoryFilter,
}: {
  announcements: Announcement[]
  categories: Category[]
  searchQuery: string
  categoryFilter: string
}) {
  const filteredAnnouncements = React.useMemo(() => {
    return announcements.filter((ann) => {
      const matchesSearch =
        searchQuery === "" ||
        ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ann.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ann.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = categoryFilter === "all" || ann.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [announcements, searchQuery, categoryFilter])

  if (filteredAnnouncements.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <IconSearch className="size-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg">No announcements found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or category filter
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {filteredAnnouncements.map((announcement) => (
        <AnnouncementCard
          key={announcement.id}
          announcement={announcement}
          categories={categories}
        />
      ))}
    </div>
  )
}

export function AnnouncementsPageClient({ data }: AnnouncementsPageClientProps) {
  const [activeTab, setActiveTab] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("all")

  const allAnnouncements = React.useMemo(() => {
    return [...data.announcements].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [data.announcements])

  const categoryCounts = React.useMemo(() => {
    return data.categories.reduce(
      (acc, cat) => {
        acc[cat.id] = allAnnouncements.filter((a) => a.category === cat.id).length
        return acc
      },
      {} as Record<string, number>
    )
  }, [data.categories, allAnnouncements])

  // Archive: announcements older than 30 days
  const archiveAnnouncements = React.useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return allAnnouncements.filter((a) => new Date(a.date) < thirtyDaysAgo)
  }, [allAnnouncements])

  const recentAnnouncements = React.useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return allAnnouncements.filter((a) => new Date(a.date) >= thirtyDaysAgo)
  }, [allAnnouncements])

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Announcements</h1>
            <p className="text-muted-foreground">
              Stay informed about product updates, program changes, and partner news
            </p>
          </div>
          <Badge variant="outline" className="w-fit">
            {data.pinnedAnnouncements.length} pinned
          </Badge>
        </div>
      </div>

      {/* Pinned Announcements */}
      {data.pinnedAnnouncements.length > 0 && (
        <div className="px-4 lg:px-6 space-y-4">
          <div className="flex items-center gap-2">
            <IconAlertTriangle className="size-5 text-amber-600" />
            <h2 className="font-semibold">Important Notices</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {data.pinnedAnnouncements.map((announcement) => (
              <PinnedAnnouncementCard
                key={announcement.id}
                announcement={announcement}
                categories={data.categories}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category Quick Filters */}
      <div className="px-4 lg:px-6">
        <div className="flex flex-wrap gap-2">
          {data.categories.map((cat) => (
            <Button
              key={cat.id}
              variant={categoryFilter === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(categoryFilter === cat.id ? "all" : cat.id)}
              className="gap-2"
            >
              {getCategoryIcon(cat.icon)}
              {cat.name}
              <Badge variant="secondary" className="text-xs ml-1">
                {categoryCounts[cat.id] || 0}
              </Badge>
            </Button>
          ))}
          {categoryFilter !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCategoryFilter("all")}
              className="text-muted-foreground"
            >
              Clear filter
            </Button>
          )}
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="px-4 lg:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">
                Recent
                <Badge variant="secondary" className="ml-2">
                  {recentAnnouncements.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="archive">
                <IconBox className="size-4 mr-1" />
                Archive
                <Badge variant="secondary" className="ml-2">
                  {archiveAnnouncements.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <div className="relative max-w-sm">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <AnnouncementFeed
              announcements={recentAnnouncements}
              categories={data.categories}
              searchQuery={searchQuery}
              categoryFilter={categoryFilter}
            />
          </TabsContent>

          <TabsContent value="archive" className="mt-0">
            <AnnouncementFeed
              announcements={archiveAnnouncements}
              categories={data.categories}
              searchQuery={searchQuery}
              categoryFilter={categoryFilter}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Help Section */}
      <div className="px-4 lg:px-6">
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Staying Informed</CardTitle>
            <CardDescription>
              How to make the most of announcements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">Pinned Items</p>
                <p className="text-xs text-muted-foreground">
                  Pinned announcements are critical - don&apos;t miss them.
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Action Required</p>
                <p className="text-xs text-muted-foreground">
                  Items marked &quot;Action Required&quot; need your attention.
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Important announcements are also sent via email.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
