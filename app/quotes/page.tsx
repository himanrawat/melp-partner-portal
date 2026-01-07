import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import { AppShell } from "@/components/app-shell"
import { QuotesPageClient } from "./quotes-page-client"

import data from "./data.json"

export default async function QuotesPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    redirect("/login")
  }

  return (
    <AppShell>
      <QuotesPageClient data={data} />
    </AppShell>
  )
}
