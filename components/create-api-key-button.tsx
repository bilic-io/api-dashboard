"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createApiKey } from "@/lib/api"

export function CreateApiKeyButton() {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [newApiKey, setNewApiKey] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await createApiKey(description)
      setNewApiKey(response.api_key)
      toast({
        title: "Success",
        description: "API key created successfully",
      })
    } catch (error) {
      console.error("Failed to create API key:", error)
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyKey = () => {
    if (newApiKey) {
      navigator.clipboard.writeText(newApiKey)
      toast({
        title: "Copied!",
        description: "API key copied to clipboard",
      })
    }
  }

  const handleClose = () => {
    setOpen(false)
    setDescription("")
    setNewApiKey(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 transition-all">
          <Plus className="mr-2 h-4 w-4" /> Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {!newApiKey ? (
          <>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>Create a new API key to authenticate your requests.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Production, Development, Testing"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                  {loading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>API Key Created</DialogTitle>
              <DialogDescription>
                Make sure to copy your API key now. You won't be able to see it again!
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-md font-mono text-sm break-all">
                {newApiKey}
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="w-full sm:w-auto gap-1" onClick={handleCopyKey}>
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </Button>
              <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700" onClick={handleClose}>
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
