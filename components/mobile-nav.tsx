"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Code, Key, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold">API Dashboard</span>
          </Link>
        </div>
        <div className="flex flex-col gap-3 mt-8">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2 px-7 py-2 text-lg font-medium transition-colors hover:text-foreground/80",
              pathname === "/dashboard" ? "text-foreground bg-accent" : "text-foreground/60",
            )}
          >
            <Key className="h-5 w-5" />
            <span>API Keys</span>
          </Link>
          <Link
            href="/dashboard/docs"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2 px-7 py-2 text-lg font-medium transition-colors hover:text-foreground/80",
              pathname?.startsWith("/dashboard/docs") ? "text-foreground bg-accent" : "text-foreground/60",
            )}
          >
            <Code className="h-5 w-5" />
            <span>Documentation</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
