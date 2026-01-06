import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { LoginForm } from "@/components/login-form"
import { Navbar } from "@/components/navbar"

export default async function LoginPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (token) {
    redirect("/")
  }

  return (
    <>
      <Navbar />
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 pt-20 md:p-10 md:pt-20">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  )
}
