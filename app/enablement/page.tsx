import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import { AppShell } from "@/components/app-shell"
import { ResourcesPageClient } from "./resources-page-client"

import data from "./data.json"

export default async function ResourcesPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    redirect("/login")
  }

  return (
    <AppShell>
      <ResourcesPageClient data={data} />
    </AppShell>
  )
}
