"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { requestPasswordReset } from "@/lib/api"
import { ArrowLeft, Mail } from "lucide-react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await requestPasswordReset(email)
      setSubmitted(true)
      toast({
        title: "Reset link sent",
        description: "If an account exists with this email, you'll receive a password reset link",
      })
    } catch (error) {
      console.error("Password reset request failed:", error)
      // We don't show an error to prevent email enumeration
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background">
      <div className="w-full max-w-md p-4 animate-fade-up">
        <Card className="border-green-100 dark:border-green-900">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              {!submitted
                ? "Enter your email address and we'll send you a link to reset your password"
                : "Check your email for a password reset link"}
            </CardDescription>
          </CardHeader>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
                <div className="text-center text-sm">
                  <Link
                    href="/auth/login"
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium inline-flex items-center"
                  >
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    Back to login
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-6 pt-4">
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-center">
                <p className="text-green-800 dark:text-green-300">
                  If an account exists with the email <span className="font-medium">{email}</span>, you'll receive a
                  password reset link shortly.
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Didn't receive an email?</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Check your spam or junk folder</li>
                  <li>Verify you entered the correct email address</li>
                  <li>Wait a few minutes for the email to arrive</li>
                </ul>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setSubmitted(false)}>
                Try again
              </Button>
              <div className="text-center text-sm">
                <Link
                  href="/auth/login"
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium inline-flex items-center justify-center"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Back to login
                </Link>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
