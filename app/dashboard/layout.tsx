import type React from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { AuthGuard } from "@/components/auth-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <MainNav />
            <div className="flex flex-1 items-center justify-end space-x-4">
              <div className="md:hidden">
                <MobileNav />
              </div>
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  )
}
