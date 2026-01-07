import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import { AppShell } from "@/components/app-shell"
import { TrainingPageClient } from "./training-page-client"

import data from "./data.json"

export default async function TrainingPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    redirect("/login")
  }

  return (
    <AppShell>
      <TrainingPageClient data={data} />
    </AppShell>
  )
}
