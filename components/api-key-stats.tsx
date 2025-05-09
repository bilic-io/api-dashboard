"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock, Key } from "lucide-react"
import { fetchApiKeys } from "@/lib/api"

export function ApiKeyStats() {
  const [stats, setStats] = useState({
    totalKeys: 0,
    activeKeys: 0,
    lastUsed: "Never",
  })

  useEffect(() => {
    const getStats = async () => {
      try {
        const apiKeys = await fetchApiKeys()
        if (apiKeys) {
          const activeKeys = apiKeys.length
          let lastUsed = "Never"

          if (activeKeys > 0) {
            const lastUsedDates = apiKeys.filter((key) => key.last_used).map((key) => new Date(key.last_used))

            if (lastUsedDates.length > 0) {
              const mostRecent = new Date(Math.max(...lastUsedDates.map((d) => d.getTime())))
              lastUsed = mostRecent.toLocaleDateString()
            }
          }

          setStats({
            totalKeys: activeKeys,
            activeKeys,
            lastUsed,
          })
        }
      } catch (error) {
        console.error("Failed to fetch API key stats:", error)
      }
    }

    getStats()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="animate-fade-in bg-background border-border text-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 bg-[url('/noise.png')] opacity-5" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium">Total API Keys</CardTitle>
          <Key className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold text-foreground">{stats.totalKeys}</div>
        </CardContent>
      </Card>
      <Card className="animate-fade-in animation-delay-200 bg-background border-border text-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 bg-[url('/noise.png')] opacity-5" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold text-foreground">{stats.activeKeys}</div>
        </CardContent>
      </Card>
      <Card className="animate-fade-in animation-delay-400 bg-background border-border text-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 bg-[url('/noise.png')] opacity-5" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium">Last Used</CardTitle>
          <Clock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold text-foreground">{stats.lastUsed}</div>
        </CardContent>
      </Card>
    </div>
  )
}
