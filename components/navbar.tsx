import Link from "next/link"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center">
          <img src="/logo.svg" alt="MelpApp" className="h-8" />
        </Link>
      </div>
    </nav>
  )
}
