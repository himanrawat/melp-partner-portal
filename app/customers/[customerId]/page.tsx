import { redirect, notFound } from "next/navigation"
import { cookies } from "next/headers"

import { AppShell } from "@/components/app-shell"
import { CustomerDetailClient } from "./customer-detail-client"

import data from "../data.json"

interface CustomerDetailPageProps {
  params: Promise<{
    customerId: string
  }>
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    redirect("/login")
  }

  const { customerId } = await params
  const customer = data.find((c) => c.customerId === customerId)

  if (!customer) {
    notFound()
  }

  return (
    <AppShell>
      <CustomerDetailClient customer={customer} />
    </AppShell>
  )
}
