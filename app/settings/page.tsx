import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import { AppShell } from "@/components/app-shell"
import { SettingsPageClient } from "./settings-page-client"

import { settingsData } from "@/lib/mock/settings-data"

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    redirect("/login")
  }

  return (
    <AppShell>
      <SettingsPageClient data={settingsData} />
    </AppShell>
  )
}
