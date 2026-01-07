"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  IconUser,
  IconBell,
  IconShield,
  IconBuilding,
  IconCamera,
  IconDeviceMobile,
  IconMail,
  IconClock,
  IconWorld,
  IconKey,
  IconDevices,
  IconLogout,
  IconUserPlus,
  IconTrash,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
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
  SettingsData,
  timezones,
  languages,
} from "@/lib/mock/settings-data"

interface SettingsPageClientProps {
  data: SettingsData
}

const VALID_TABS = ["account", "notifications", "security", "organization"]

export function SettingsPageClient({ data }: SettingsPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  // Determine valid tab with fallback
  const getValidTab = () => {
    if (!tabParam) return "account"
    if (!VALID_TABS.includes(tabParam)) return "account"
    if (tabParam === "organization" && !data.organization.isAdmin) return "account"
    return tabParam
  }

  const [activeTab, setActiveTab] = React.useState(getValidTab())

  // Account form state
  const [accountForm, setAccountForm] = React.useState({
    name: data.user.name,
    phone: data.user.phone,
    timezone: data.user.timezone,
    language: data.user.language,
  })
  const [accountDirty, setAccountDirty] = React.useState(false)

  // Notifications form state
  const [notificationsForm, setNotificationsForm] = React.useState({
    dealUpdates: data.notifications.dealUpdates,
    conflictAlerts: data.notifications.conflictAlerts,
    quoteApprovals: data.notifications.quoteApprovals,
    commissionUpdates: data.notifications.commissionUpdates,
    supportTickets: data.notifications.supportTickets,
    announcements: data.notifications.announcements,
    emailDigest: data.notifications.emailDigest,
  })
  const [notificationsDirty, setNotificationsDirty] = React.useState(false)

  // Security form state
  const [securityForm, setSecurityForm] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    mfaEnabled: data.security.mfaEnabled,
  })
  const [securityDirty, setSecurityDirty] = React.useState(false)

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/settings?tab=${value}`, { scroll: false })
  }

  // Save handlers
  const handleSaveAccount = () => {
    toast.success("Account settings saved")
    setAccountDirty(false)
  }

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved")
    setNotificationsDirty(false)
  }

  const handleSaveSecurity = () => {
    if (data.user.authProvider === "credentials") {
      if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmPassword) {
        toast.error("Passwords do not match")
        return
      }
    }
    toast.success("Security settings saved")
    setSecurityDirty(false)
    setSecurityForm(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
  }

  const handleRevokeSession = (sessionId: string) => {
    toast.success("Session revoked successfully")
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"
      case "Gold":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
      case "Silver":
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
      case "Sales":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      case "Finance":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      case "Technical":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      case "Invited":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
      case "Inactive":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-1 px-4 lg:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, notifications, and security preferences
        </p>
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="px-4 lg:px-6">
        <TabsList>
          <TabsTrigger value="account" className="gap-2">
            <IconUser className="size-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <IconBell className="size-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <IconShield className="size-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          {data.organization.isAdmin && (
            <TabsTrigger value="organization" className="gap-2">
              <IconBuilding className="size-4" />
              <span className="hidden sm:inline">Organization</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="size-20">
                  <AvatarImage src={data.user.avatar} alt={data.user.name} />
                  <AvatarFallback className="text-lg">
                    {data.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <Button variant="outline" size="sm" disabled>
                    <IconCamera className="size-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Photo upload coming soon
                  </p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={accountForm.name}
                    onChange={(e) => {
                      setAccountForm(prev => ({ ...prev, name: e.target.value }))
                      setAccountDirty(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      value={data.user.email}
                      disabled
                      className="pr-10"
                    />
                    <IconMail className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      value={accountForm.phone}
                      onChange={(e) => {
                        setAccountForm(prev => ({ ...prev, phone: e.target.value }))
                        setAccountDirty(true)
                      }}
                    />
                    <IconDeviceMobile className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select
                    value={accountForm.timezone}
                    onValueChange={(value) => {
                      setAccountForm(prev => ({ ...prev, timezone: value }))
                      setAccountDirty(true)
                    }}
                  >
                    <SelectTrigger id="timezone">
                      <IconClock className="size-4 mr-2 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={accountForm.language}
                    onValueChange={(value) => {
                      setAccountForm(prev => ({ ...prev, language: value }))
                      setAccountDirty(true)
                    }}
                  >
                    <SelectTrigger id="language">
                      <IconWorld className="size-4 mr-2 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                {accountDirty && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <IconAlertCircle className="size-4" />
                    You have unsaved changes
                  </p>
                )}
                <div className="ml-auto">
                  <Button onClick={handleSaveAccount} disabled={!accountDirty}>
                    <IconCheck className="size-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Types */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dealUpdates">Deal Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Stage changes, approvals, and deal activity
                      </p>
                    </div>
                    <Switch
                      id="dealUpdates"
                      checked={notificationsForm.dealUpdates}
                      onCheckedChange={(checked) => {
                        setNotificationsForm(prev => ({ ...prev, dealUpdates: checked }))
                        setNotificationsDirty(true)
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="conflictAlerts">Conflict Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Deal conflicts and territory overlaps
                      </p>
                    </div>
                    <Switch
                      id="conflictAlerts"
                      checked={notificationsForm.conflictAlerts}
                      onCheckedChange={(checked) => {
                        setNotificationsForm(prev => ({ ...prev, conflictAlerts: checked }))
                        setNotificationsDirty(true)
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="quoteApprovals">Quote Approvals</Label>
                      <p className="text-sm text-muted-foreground">
                        Quote submissions and approval status
                      </p>
                    </div>
                    <Switch
                      id="quoteApprovals"
                      checked={notificationsForm.quoteApprovals}
                      onCheckedChange={(checked) => {
                        setNotificationsForm(prev => ({ ...prev, quoteApprovals: checked }))
                        setNotificationsDirty(true)
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="commissionUpdates">Commission & Payouts</Label>
                      <p className="text-sm text-muted-foreground">
                        Commission calculations and payout notifications
                      </p>
                    </div>
                    <Switch
                      id="commissionUpdates"
                      checked={notificationsForm.commissionUpdates}
                      onCheckedChange={(checked) => {
                        setNotificationsForm(prev => ({ ...prev, commissionUpdates: checked }))
                        setNotificationsDirty(true)
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="supportTickets">Support Tickets</Label>
                      <p className="text-sm text-muted-foreground">
                        Updates on your support requests
                      </p>
                    </div>
                    <Switch
                      id="supportTickets"
                      checked={notificationsForm.supportTickets}
                      onCheckedChange={(checked) => {
                        setNotificationsForm(prev => ({ ...prev, supportTickets: checked }))
                        setNotificationsDirty(true)
                      }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Announcements */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Announcements</h3>
                <div className="space-y-2">
                  <Label htmlFor="announcements">Receive announcements</Label>
                  <Select
                    value={notificationsForm.announcements}
                    onValueChange={(value: "all" | "important" | "none") => {
                      setNotificationsForm(prev => ({ ...prev, announcements: value }))
                      setNotificationsDirty(true)
                    }}
                  >
                    <SelectTrigger id="announcements">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All announcements</SelectItem>
                      <SelectItem value="important">Important only</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Email Digest */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Email Digest</h3>
                <div className="space-y-2">
                  <Label htmlFor="emailDigest">Email frequency</Label>
                  <Select
                    value={notificationsForm.emailDigest}
                    onValueChange={(value: "immediate" | "daily" | "weekly" | "none") => {
                      setNotificationsForm(prev => ({ ...prev, emailDigest: value }))
                      setNotificationsDirty(true)
                    }}
                  >
                    <SelectTrigger id="emailDigest">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="daily">Daily digest</SelectItem>
                      <SelectItem value="weekly">Weekly digest</SelectItem>
                      <SelectItem value="none">No emails</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose how often you want to receive email notifications
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                {notificationsDirty && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <IconAlertCircle className="size-4" />
                    You have unsaved changes
                  </p>
                )}
                <div className="ml-auto">
                  <Button onClick={handleSaveNotifications} disabled={!notificationsDirty}>
                    <IconCheck className="size-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-6">
          {/* Password Section */}
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                {data.user.authProvider === "credentials"
                  ? "Change your password to keep your account secure"
                  : "Your password is managed by your sign-in provider"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.user.authProvider === "credentials" ? (
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={(e) => {
                        setSecurityForm(prev => ({ ...prev, currentPassword: e.target.value }))
                        setSecurityDirty(true)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={securityForm.newPassword}
                      onChange={(e) => {
                        setSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))
                        setSecurityDirty(true)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) => {
                        setSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))
                        setSecurityDirty(true)
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <IconKey className="size-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Your password is managed by{" "}
                    <span className="font-medium text-foreground">
                      {data.user.authProvider === "google" ? "Google" : "Microsoft"}
                    </span>
                    . To change your password, visit your provider&apos;s account settings.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* MFA Section */}
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mfa">Enable MFA</Label>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code when signing in
                  </p>
                </div>
                <Switch
                  id="mfa"
                  checked={securityForm.mfaEnabled}
                  onCheckedChange={(checked) => {
                    setSecurityForm(prev => ({ ...prev, mfaEnabled: checked }))
                    setSecurityDirty(true)
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage your active sessions across devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.security.activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <IconDevices className="size-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium flex items-center gap-2">
                          {session.device}
                          {session.current && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.location} • Last active{" "}
                          {new Date(session.lastActive).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                      >
                        <IconLogout className="size-4 mr-1" />
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          {(data.user.authProvider === "credentials" || securityDirty) && (
            <div className="flex items-center justify-between">
              {securityDirty && (
                <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <IconAlertCircle className="size-4" />
                  You have unsaved changes
                </p>
              )}
              <div className="ml-auto">
                <Button onClick={handleSaveSecurity} disabled={!securityDirty}>
                  <IconCheck className="size-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Organization Tab (Admin Only) */}
        {data.organization.isAdmin && (
          <TabsContent value="organization" className="mt-6 space-y-6">
            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>Partner Organization</CardTitle>
                <CardDescription>
                  View your organization details and manage team members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input value={data.organization.companyName} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Partner ID</Label>
                    <Input value={data.organization.partnerId} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Partner Tier</Label>
                    <div className="flex items-center h-9">
                      <Badge className={getTierColor(data.organization.tier)}>
                        {data.organization.tier} Partner
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Regions Covered</Label>
                    <div className="flex flex-wrap gap-1 h-9 items-center">
                      {data.organization.regions.map((region) => (
                        <Badge key={region} variant="outline">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Manage users in your organization
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <IconUserPlus className="size-4 mr-2" />
                    Invite User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.organization.users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.role)} variant="secondary">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)} variant="secondary">
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.email !== data.user.email && (
                            <Button variant="ghost" size="icon" className="size-8">
                              <IconTrash className="size-4 text-muted-foreground" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </>
  )
}
