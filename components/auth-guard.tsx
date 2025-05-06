"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/api"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = () => {
      const authenticated = isAuthenticated()

      // If not authenticated and not on an auth page, redirect to login
      if (!authenticated && !pathname?.startsWith("/auth/")) {
        router.push("/auth/login")
      } else if (authenticated && pathname?.startsWith("/auth/")) {
        // If authenticated and on an auth page, redirect to dashboard
        router.push("/dashboard")
      }

      setLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return <>{children}</>
}
