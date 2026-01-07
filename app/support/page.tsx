import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import { AppShell } from "@/components/app-shell"
import { SupportPageClient } from "./support-page-client"

import data from "./data.json"

export default async function SupportPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    redirect("/login")
  }

  return (
    <AppShell>
      <SupportPageClient data={data} />
    </AppShell>
  )
}
