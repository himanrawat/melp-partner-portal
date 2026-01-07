import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import { AppShell } from "@/components/app-shell"
import { DealsPageClient } from "./deals-page-client"

import data from "./data.json"

export default async function DealsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    redirect("/login")
  }

  return (
    <AppShell>
      <DealsPageClient data={data} />
    </AppShell>
  )
}
