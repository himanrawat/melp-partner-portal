import { redirect, notFound } from "next/navigation"
import { cookies } from "next/headers"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <CustomerDetailClient customer={customer} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
