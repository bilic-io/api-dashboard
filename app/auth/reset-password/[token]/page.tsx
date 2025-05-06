"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { resetPassword } from "@/lib/api"
import { ArrowLeft, Check, Lock } from "lucide-react"

export default function NewPasswordPage({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { token } = params

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await resetPassword(token, password)
      setSuccess(true)
      toast({
        title: "Password reset successful",
        description: "Your password has been reset successfully",
      })

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (error) {
      console.error("Password reset failed:", error)
      toast({
        title: "Password Reset Failed",
        description: "The reset link may be invalid or expired",
        variant: "destructive",
      })
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
                {success ? (
                  <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              {success ? "Password Reset Complete" : "Create New Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {success ? "Your password has been reset successfully" : "Enter your new password below"}
            </CardDescription>
          </CardHeader>

          {!success ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
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
                  Your password has been reset successfully. You will be redirected to the login page shortly.
                </p>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => router.push("/auth/login")}>
                Go to Login
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
