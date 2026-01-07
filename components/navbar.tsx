import Link from "next/link"

import { Logo } from "@/components/logo"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center">
          <Logo className="h-8 w-auto text-foreground" aria-label="MELP" />
        </Link>
      </div>
    </nav>
  )
}
