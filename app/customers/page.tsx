import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import { AppShell } from "@/components/app-shell"
import { CustomersPageClient } from "./customers-page-client"

import data from "./data.json"

export default async function CustomersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    redirect("/login")
  }

  return (
    <AppShell>
      <CustomersPageClient data={data} />
    </AppShell>
  )
}
