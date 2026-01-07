import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import { AppShell } from "@/components/app-shell"
import { AnnouncementsPageClient } from "./announcements-page-client"

import data from "./data.json"

export default async function AnnouncementsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    redirect("/login")
  }

  return (
    <AppShell>
      <AnnouncementsPageClient data={data} />
    </AppShell>
  )
}
