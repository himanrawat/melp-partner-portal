"use client"

import * as React from "react"
import {
  IconHeadset,
  IconPlus,
  IconSearch,
  IconClock,
  IconCircleCheckFilled,
  IconCircleDashed,
  IconLoader,
  IconAlertCircle,
  IconChevronDown,
  IconChevronRight,
  IconBriefcase,
  IconCode,
  IconCoin,
  IconHelp,
  IconBook,
  IconFilter,
  IconExternalLink,
  IconPaperclip,
  IconSend,
  IconInfoCircle,
  IconShieldCheck,
  IconMessageCircle,
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SLAResponseTime {
  category: string
  priority: string
  responseTime: string
  resolutionTime: string
}

interface SLA {
  businessHours: string
  responseTimesByCategory: SLAResponseTime[]
  escalation: string
}

interface TicketUpdate {
  date: string
  author: string
  message: string
}

interface Ticket {
  id: string
  category: string
  subject: string
  description: string
  priority: string
  status: string
  relatedDealId?: string
  relatedCustomer?: string
  createdDate: string
  lastUpdated: string
  resolvedDate?: string
  assignedTo?: string
  updates: TicketUpdate[]
}

interface KBArticle {
  id: string
  title: string
  category: string
  summary: string
  content: string
  relatedLinks: string[]
}

interface Category {
  id: string
  name: string
  description: string
  icon: string
}

interface SupportData {
  sla: SLA
  tickets: Ticket[]
  knowledgeBase: KBArticle[]
  categories: Category[]
}

interface SupportPageClientProps {
  readonly data: SupportData
}

function getCategoryIcon(iconName: string) {
  switch (iconName) {
    case "briefcase":
      return <IconBriefcase className="size-5" />
    case "code":
      return <IconCode className="size-5" />
    case "coin":
      return <IconCoin className="size-5" />
    case "help":
      return <IconHelp className="size-5" />
    case "book":
      return <IconBook className="size-5" />
    default:
      return <IconHeadset className="size-5" />
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "resolved":
      return <IconCircleCheckFilled className="size-4 text-green-500" />
    case "in_progress":
      return <IconLoader className="size-4 text-blue-500" />
    case "waiting":
      return <IconClock className="size-4 text-amber-500" />
    case "open":
      return <IconCircleDashed className="size-4 text-muted-foreground" />
    default:
      return <IconCircleDashed className="size-4 text-muted-foreground" />
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "resolved":
      return (
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
          Resolved
        </Badge>
      )
    case "in_progress":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
          In Progress
        </Badge>
      )
    case "waiting":
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
          Waiting on You
        </Badge>
      )
    case "open":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Open
        </Badge>
      )
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

function getPriorityBadge(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return (
        <Badge variant="destructive" className="text-xs">
          High
        </Badge>
      )
    case "normal":
      return (
        <Badge variant="secondary" className="text-xs">
          Normal
        </Badge>
      )
    default:
      return <Badge variant="secondary" className="text-xs">{priority}</Badge>
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatShortDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function SLASection({ sla }: { sla: SLA }) {
  const groupedSLA = React.useMemo(() => {
    const groups: Record<string, SLAResponseTime[]> = {}
    sla.responseTimesByCategory.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
    })
    return groups
  }, [sla.responseTimesByCategory])

  return (
    <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <IconShieldCheck className="size-5 text-primary" />
          <CardTitle className="text-base">Support SLA & Expectations</CardTitle>
        </div>
        <CardDescription>
          Our commitment to resolving your issues quickly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg bg-background/80 p-3 border">
          <IconClock className="size-5 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Business Hours</p>
            <p className="text-xs text-muted-foreground">{sla.businessHours}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Response Times by Category</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedSLA).map(([category, times]) => (
              <div key={category} className="rounded-lg border bg-background/80 p-3 space-y-2">
                <p className="text-sm font-medium">{category}</p>
                {times.map((time) => (
                  <div key={`${category}-${time.priority}`} className="text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{time.priority} Priority:</span>
                      <span className="font-medium">{time.responseTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 border border-amber-200 dark:border-amber-800">
          <IconAlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Escalation</p>
            <p className="text-xs text-amber-700 dark:text-amber-300">{sla.escalation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CreateTicketSection({ categories }: { categories: Category[] }) {
  const [selectedCategory, setSelectedCategory] = React.useState("")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <IconPlus className="size-5 text-primary" />
          <CardTitle className="text-base">Create Support Ticket</CardTitle>
        </div>
        <CardDescription>
          Describe your issue and we&apos;ll help you resolve it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(cat.icon)}
                        <span>{cat.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCategory && (
                <p className="text-xs text-muted-foreground">
                  {categories.find((c) => c.id === selectedCategory)?.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select defaultValue="normal">
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High - Blocking Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Brief description of your issue" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="related-deal">Related Deal (Optional)</Label>
              <Select>
                <SelectTrigger id="related-deal">
                  <SelectValue placeholder="Link to a deal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No related deal</SelectItem>
                  <SelectItem value="d-2024-089">D-2024-089 - Acme Corp</SelectItem>
                  <SelectItem value="d-2024-092">D-2024-092 - TechStart Inc</SelectItem>
                  <SelectItem value="d-2024-095">D-2024-095 - GlobalHealth</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Linking helps us resolve issues faster
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide details about your issue..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Attachments (Optional)</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" type="button">
                  <IconPaperclip className="size-4 mr-1" />
                  Add Files
                </Button>
                <span className="text-xs text-muted-foreground">
                  Max 10MB per file
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button>
            <IconSend className="size-4 mr-2" />
            Submit Ticket
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function TicketDetailCard({ ticket }: { ticket: Ticket }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">{getStatusIcon(ticket.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm text-muted-foreground">{ticket.id}</span>
                  {getPriorityBadge(ticket.priority)}
                  {getStatusBadge(ticket.status)}
                </div>
                <p className="font-medium mt-1">{ticket.subject}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>{ticket.category}</span>
                  {ticket.relatedCustomer && (
                    <span className="flex items-center gap-1">
                      <IconBriefcase className="size-3" />
                      {ticket.relatedCustomer}
                    </span>
                  )}
                  <span>Updated {formatShortDate(ticket.lastUpdated)}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {isOpen ? (
                  <IconChevronDown className="size-5 text-muted-foreground" />
                ) : (
                  <IconChevronRight className="size-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 border-t">
            <div className="space-y-4 pt-4">
              <div>
                <p className="text-sm font-medium mb-1">Description</p>
                <p className="text-sm text-muted-foreground">{ticket.description}</p>
              </div>

              {ticket.relatedDealId && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Related Deal:</span>
                  <Button variant="link" size="sm" className="h-auto p-0">
                    {ticket.relatedDealId}
                    <IconExternalLink className="size-3 ml-1" />
                  </Button>
                </div>
              )}

              {ticket.assignedTo && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Assigned to:</span>{" "}
                  <span className="font-medium">{ticket.assignedTo}</span>
                </div>
              )}

              {ticket.updates.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Updates</p>
                  <div className="space-y-3 border-l-2 pl-4">
                    {ticket.updates.map((update, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-medium">{update.author}</span>
                            <span className="text-muted-foreground">
                              {formatDate(update.date)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{update.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {ticket.status !== "resolved" && (
                <div className="flex items-center gap-2 pt-2">
                  <Input placeholder="Add a reply..." className="flex-1" />
                  <Button size="sm">
                    <IconSend className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

function TicketListSection({ tickets }: { tickets: Ticket[] }) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")

  const filteredTickets = React.useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        searchQuery === "" ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.relatedCustomer?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && ticket.status !== "resolved") ||
        ticket.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [tickets, searchQuery, statusFilter])

  const statusCounts = React.useMemo(() => {
    return {
      open: tickets.filter((t) => t.status === "open").length,
      in_progress: tickets.filter((t) => t.status === "in_progress").length,
      waiting: tickets.filter((t) => t.status === "waiting").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      active: tickets.filter((t) => t.status !== "resolved").length,
    }
  }, [tickets])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <IconFilter className="size-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tickets</SelectItem>
              <SelectItem value="active">Active ({statusCounts.active})</SelectItem>
              <SelectItem value="open">Open ({statusCounts.open})</SelectItem>
              <SelectItem value="in_progress">In Progress ({statusCounts.in_progress})</SelectItem>
              <SelectItem value="waiting">Waiting ({statusCounts.waiting})</SelectItem>
              <SelectItem value="resolved">Resolved ({statusCounts.resolved})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <IconSearch className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg">No tickets found</h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't created any support tickets yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <TicketDetailCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  )
}

function KnowledgeBaseSection({ articles }: { articles: KBArticle[] }) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")

  const categories = React.useMemo(() => {
    const cats = new Set(articles.map((a) => a.category))
    return Array.from(cats)
  }, [articles])

  const filteredArticles = React.useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === "all" || article.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [articles, searchQuery, selectedCategory])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{article.title}</CardTitle>
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  {article.category}
                </Badge>
              </div>
              <CardDescription>{article.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{article.content}</p>
              <Button variant="link" size="sm" className="px-0 mt-2">
                Read more
                <IconChevronRight className="size-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <IconBook className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg">No articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or category filter
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function SupportPageClient({ data }: SupportPageClientProps) {
  const [activeTab, setActiveTab] = React.useState("tickets")

  const ticketStats = React.useMemo(() => {
    return {
      total: data.tickets.length,
      active: data.tickets.filter((t) => t.status !== "resolved").length,
      resolved: data.tickets.filter((t) => t.status === "resolved").length,
    }
  }, [data.tickets])

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Support</h1>
            <p className="text-muted-foreground">
              Get help when you need it - we&apos;re here for you
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-blue-600">
              {ticketStats.active} active
            </Badge>
            <Badge variant="outline" className="text-green-600">
              {ticketStats.resolved} resolved
            </Badge>
          </div>
        </div>
      </div>

      {/* SLA Section - Always visible at top */}
      <div className="px-4 lg:px-6">
        <SLASection sla={data.sla} />
      </div>

      {/* Tabs */}
      <div className="px-4 lg:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="tickets">
              My Tickets
              <Badge variant="secondary" className="ml-2">
                {ticketStats.total}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="create">Create Ticket</TabsTrigger>
            <TabsTrigger value="kb">
              Knowledge Base
              <Badge variant="secondary" className="ml-2">
                {data.knowledgeBase.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="mt-6">
            <TicketListSection tickets={data.tickets} />
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <CreateTicketSection categories={data.categories} />
          </TabsContent>

          <TabsContent value="kb" className="mt-6">
            <KnowledgeBaseSection articles={data.knowledgeBase} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Help */}
      <div className="px-4 lg:px-6">
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Quick Help</CardTitle>
            <CardDescription>
              Common questions and quick actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">Urgent Issues</p>
                <p className="text-xs text-muted-foreground">
                  For blocking issues, mark your ticket as High priority for faster response.
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Partner Manager</p>
                <p className="text-xs text-muted-foreground">
                  Your Partner Manager can escalate issues and provide direct support.
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Office Hours</p>
                <p className="text-xs text-muted-foreground">
                  Join weekly partner office hours for live Q&A with the MELP team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
