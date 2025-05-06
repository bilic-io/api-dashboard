"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Code, Key } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">API Dashboard</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80 flex items-center gap-1",
            pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
          )}
        >
          <Key className="h-4 w-4" />
          <span>API Keys</span>
        </Link>
        <Link
          href="/dashboard/docs"
          className={cn(
            "transition-colors hover:text-foreground/80 flex items-center gap-1",
            pathname?.startsWith("/dashboard/docs") ? "text-foreground" : "text-foreground/60",
          )}
        >
          <Code className="h-4 w-4" />
          <span>Documentation</span>
        </Link>
      </nav>
    </div>
  )
}
