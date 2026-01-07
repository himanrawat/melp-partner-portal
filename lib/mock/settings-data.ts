export interface UserSettings {
  name: string
  email: string
  phone: string
  avatar: string
  timezone: string
  language: string
  authProvider: "credentials" | "google" | "microsoft"
}

export interface NotificationSettings {
  dealUpdates: boolean
  conflictAlerts: boolean
  quoteApprovals: boolean
  commissionUpdates: boolean
  supportTickets: boolean
  announcements: "all" | "important" | "none"
  emailDigest: "immediate" | "daily" | "weekly" | "none"
}

export interface OrganizationSettings {
  companyName: string
  tier: "Silver" | "Gold" | "Platinum"
  partnerId: string
  regions: string[]
  isAdmin: boolean
  users: {
    id: string
    name: string
    email: string
    role: "Admin" | "Sales" | "Finance" | "Technical"
    status: "Active" | "Invited" | "Inactive"
  }[]
}

export interface SecuritySettings {
  mfaEnabled: boolean
  lastLogin: string
  activeSessions: {
    id: string
    device: string
    location: string
    lastActive: string
    current: boolean
  }[]
}

export interface SettingsData {
  user: UserSettings
  notifications: NotificationSettings
  organization: OrganizationSettings
  security: SecuritySettings
}

export const settingsData: SettingsData = {
  user: {
    name: "John Doe",
    email: "john.doe@techsolutions.com",
    phone: "+1 (555) 123-4567",
    avatar: "/avatars/user.jpg",
    timezone: "America/New_York",
    language: "en",
    authProvider: "credentials",
  },
  notifications: {
    dealUpdates: true,
    conflictAlerts: true,
    quoteApprovals: true,
    commissionUpdates: true,
    supportTickets: false,
    announcements: "important",
    emailDigest: "daily",
  },
  organization: {
    companyName: "Tech Solutions Inc.",
    tier: "Gold",
    partnerId: "PTR-2024-00847",
    regions: ["North America", "EMEA"],
    isAdmin: true,
    users: [
      {
        id: "usr-001",
        name: "John Doe",
        email: "john.doe@techsolutions.com",
        role: "Admin",
        status: "Active",
      },
      {
        id: "usr-002",
        name: "Sarah Johnson",
        email: "sarah.j@techsolutions.com",
        role: "Sales",
        status: "Active",
      },
      {
        id: "usr-003",
        name: "Mike Chen",
        email: "mike.c@techsolutions.com",
        role: "Technical",
        status: "Active",
      },
      {
        id: "usr-004",
        name: "Emily Davis",
        email: "emily.d@techsolutions.com",
        role: "Finance",
        status: "Invited",
      },
    ],
  },
  security: {
    mfaEnabled: false,
    lastLogin: "2025-01-07T09:30:00Z",
    activeSessions: [
      {
        id: "sess-001",
        device: "Chrome on Windows",
        location: "New York, USA",
        lastActive: "2025-01-07T09:30:00Z",
        current: true,
      },
      {
        id: "sess-002",
        device: "Safari on iPhone",
        location: "New York, USA",
        lastActive: "2025-01-06T18:45:00Z",
        current: false,
      },
    ],
  },
}

export const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Europe/Berlin", label: "Central European Time (CET)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Asia/Singapore", label: "Singapore Time (SGT)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
]

export const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese (Simplified)" },
]
