import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import { AppShell } from "@/components/app-shell"
import { RevenuePageClient } from "./revenue-page-client"

import data from "./data.json"

export default async function RevenuePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    redirect("/login")
  }

  return (
    <AppShell>
      <RevenuePageClient data={data} />
    </AppShell>
  )
}
