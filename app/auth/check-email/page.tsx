"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MailCheck } from "lucide-react"

export default function CheckEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background">
      <div className="w-full max-w-md p-4 animate-fade-up">
        <div className="flex flex-col items-center bg-white dark:bg-background rounded-lg shadow-md p-8 border border-green-100 dark:border-green-900">
          <MailCheck className="w-12 h-12 text-green-600 dark:text-green-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-center">Check your email</h1>
          <p className="text-center text-muted-foreground mb-6">
            We have sent a confirmation link to your email address. Please check your inbox and follow the instructions to activate your account.
          </p>
          <Link href="/auth/login" passHref>
            <Button className="w-full bg-green-600 hover:bg-green-700">Go to Login</Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 