"use client"

import * as React from "react"
import {
  IconCertificate,
  IconCircleCheckFilled,
  IconCircleDashed,
  IconClock,
  IconDownload,
  IconPlayerPlay,
  IconBook,
  IconVideo,
  IconChevronDown,
  IconChevronRight,
  IconTrophy,
  IconTargetArrow,
  IconProgress,
  IconAlertCircle,
  IconSparkles,
  IconAward,
  IconCalendar,
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
import { Progress } from "@/components/ui/progress"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface Module {
  id: string
  title: string
  description: string
  type: string
  duration: string
  status: string
  requiredForTier: boolean
  objectives: string[]
}

interface Track {
  id: string
  title: string
  description: string
  requiredForTier: boolean
  status: string
  completedDate?: string
  expiryDate?: string
  badge: string
  modules: Module[]
}

interface EarnedBadge {
  id: string
  name: string
  earnedDate: string
  expiryDate: string
  track: string
}

interface PartnerProgress {
  completedCertifications: number
  inProgressCertifications: number
  totalCertifications: number
  nextTierRequirement: string
}

interface TrainingData {
  partnerProgress: PartnerProgress
  tracks: Track[]
  earnedBadges: EarnedBadge[]
}

interface TrainingPageClientProps {
  readonly data: TrainingData
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <IconCircleCheckFilled className="size-5 text-green-500" />
    case "in_progress":
      return <IconProgress className="size-5 text-blue-500" />
    case "not_started":
      return <IconCircleDashed className="size-5 text-muted-foreground" />
    default:
      return <IconCircleDashed className="size-5 text-muted-foreground" />
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
          Completed
        </Badge>
      )
    case "in_progress":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
          In Progress
        </Badge>
      )
    case "not_started":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Not Started
        </Badge>
      )
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "video":
      return <IconVideo className="size-4 text-purple-500" />
    case "reading":
      return <IconBook className="size-4 text-blue-500" />
    default:
      return <IconBook className="size-4 text-muted-foreground" />
  }
}

function ProgressSummaryCards({ progress, tracks }: { progress: PartnerProgress; tracks: Track[] }) {
  const totalModules = tracks.reduce((acc, track) => acc + track.modules.length, 0)
  const completedModules = tracks.reduce(
    (acc, track) => acc + track.modules.filter((m) => m.status === "completed").length,
    0
  )
  const requiredTracks = tracks.filter((t) => t.requiredForTier)
  const completedRequiredTracks = requiredTracks.filter((t) => t.status === "completed")

  return (
    <div className="px-4 lg:px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconTrophy className="size-4 text-green-600" />
              Certifications Earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {progress.completedCertifications}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {progress.totalCertifications} available
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconProgress className="size-4 text-blue-600" />
              In Progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {progress.inProgressCertifications}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              certification{progress.inProgressCertifications !== 1 ? "s" : ""} underway
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconTargetArrow className="size-4 text-purple-600" />
              Modules Completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {completedModules}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {totalModules} total modules
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconCertificate className="size-4 text-amber-600" />
              Tier Progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
              {completedRequiredTracks.length}/{requiredTracks.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              required certifications
            </p>
          </CardContent>
        </Card>
      </div>

      {progress.nextTierRequirement && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
          <IconAlertCircle className="size-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <span className="font-medium">Next tier requirement:</span> {progress.nextTierRequirement}
          </p>
        </div>
      )}
    </div>
  )
}

function ModuleCard({ module }: { module: Module }) {
  return (
    <div className="flex items-start gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0 mt-0.5">{getStatusIcon(module.status)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-medium">{module.title}</h4>
          {module.requiredForTier && (
            <Badge variant="secondary" className="text-xs">
              Required
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            {getTypeIcon(module.type)}
            {module.type === "video" ? "Video" : "Reading"}
          </span>
          <span className="flex items-center gap-1">
            <IconClock className="size-3" />
            {module.duration}
          </span>
        </div>
        {module.objectives.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Learning Objectives:</p>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {module.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex-shrink-0">
        {module.status === "completed" ? (
          <Button variant="ghost" size="sm" disabled>
            <IconCircleCheckFilled className="size-4 mr-1" />
            Done
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <IconPlayerPlay className="size-4 mr-1" />
            {module.status === "in_progress" ? "Continue" : "Start"}
          </Button>
        )}
      </div>
    </div>
  )
}

function TrackCard({ track }: { track: Track }) {
  const [isOpen, setIsOpen] = React.useState(track.status === "in_progress")

  const completedModules = track.modules.filter((m) => m.status === "completed").length
  const totalModules = track.modules.length
  const progressPercent = (completedModules / totalModules) * 100

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                <IconCertificate className="size-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-lg">{track.title}</CardTitle>
                  {track.requiredForTier ? (
                    <Badge variant="default" className="text-xs">
                      Required for Tier
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Optional
                    </Badge>
                  )}
                  {getStatusBadge(track.status)}
                </div>
                <CardDescription className="mt-1">{track.description}</CardDescription>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex-1 max-w-xs">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        {completedModules} of {totalModules} modules
                      </span>
                      <span className="font-medium">{Math.round(progressPercent)}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>
                  {track.completedDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <IconCalendar className="size-3" />
                      Completed: {new Date(track.completedDate).toLocaleDateString()}
                    </div>
                  )}
                  {track.expiryDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <IconClock className="size-3" />
                      Expires: {new Date(track.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {track.status === "completed" && (
                  <Button variant="outline" size="sm">
                    <IconDownload className="size-4 mr-1" />
                    Certificate
                  </Button>
                )}
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
          <CardContent className="pt-0">
            <div className="space-y-3">
              {track.modules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

function BadgesSection({ badges }: { badges: EarnedBadge[] }) {
  if (badges.length === 0) return null

  return (
    <div className="px-4 lg:px-6">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconAward className="size-5 text-primary" />
            <CardTitle className="text-base">Earned Badges & Certificates</CardTitle>
          </div>
          <CardDescription>
            Download your certificates and share your achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-3 rounded-lg border bg-background p-3"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <IconSparkles className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Earned {new Date(badge.earnedDate).toLocaleDateString()}
                  </p>
                  {badge.expiryDate && (
                    <p className="text-xs text-muted-foreground">
                      Expires {new Date(badge.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="size-8">
                  <IconDownload className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function TrainingPageClient({ data }: TrainingPageClientProps) {
  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Training</h1>
            <p className="text-muted-foreground">
              Complete these trainings to sell, demo, and implement MELP effectively
            </p>
          </div>
          <Badge variant="outline" className="w-fit">
            {data.partnerProgress.completedCertifications} of {data.partnerProgress.totalCertifications} certifications
          </Badge>
        </div>
      </div>

      {/* Progress Summary Cards */}
      <ProgressSummaryCards progress={data.partnerProgress} tracks={data.tracks} />

      {/* Earned Badges Section */}
      <BadgesSection badges={data.earnedBadges} />

      {/* Training Tracks */}
      <div className="px-4 lg:px-6">
        <h2 className="text-lg font-semibold mb-4">Certification Tracks</h2>
        <div className="space-y-4">
          {data.tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="px-4 lg:px-6">
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Training Help</CardTitle>
            <CardDescription>
              Need assistance with your certifications?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">Certification Support</p>
                <p className="text-xs text-muted-foreground">
                  Contact partner training team for questions about modules or assessments.
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Certificate Issues</p>
                <p className="text-xs text-muted-foreground">
                  Having trouble downloading certificates? Check your completed modules.
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Tier Requirements</p>
                <p className="text-xs text-muted-foreground">
                  Required certifications must be completed to advance to the next partner tier.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
