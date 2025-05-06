"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Copy, RotateCw, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchApiKeys, deleteApiKey, regenerateApiKey } from "@/lib/api"
import type { ApiKey } from "@/lib/types"
import { formatDate } from "@/lib/utils"

export function ApiKeysList() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [regeneratedKey, setRegeneratedKey] = useState<string | null>(null)
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null)
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [keyToRegenerate, setKeyToRegenerate] = useState<string | null>(null)
  const { toast } = useToast()

  const loadApiKeys = async () => {
    setLoading(true)
    try {
      const data = await fetchApiKeys()
      if (data) {
        setApiKeys(data)
      }
    } catch (error) {
      console.error("Failed to fetch API keys:", error)
      toast({
        title: "Error",
        description: "Failed to load API keys. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApiKeys()
  }, [])

  const handleCopyKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey)
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    })
  }

  const handleRegenerateClick = (keyId: string) => {
    setKeyToRegenerate(keyId)
    setShowRegenerateDialog(true)
  }

  const handleDeleteClick = (keyId: string) => {
    setDeleteKeyId(keyId)
    setShowDeleteDialog(true)
  }

  const confirmRegenerate = async () => {
    if (!keyToRegenerate) return

    try {
      const response = await regenerateApiKey(keyToRegenerate)
      setRegeneratedKey(response.api_key)
      await loadApiKeys()
      toast({
        title: "Success",
        description: "API key regenerated successfully",
      })
    } catch (error) {
      console.error("Failed to regenerate API key:", error)
      toast({
        title: "Error",
        description: "Failed to regenerate API key",
        variant: "destructive",
      })
    } finally {
      setShowRegenerateDialog(false)
      setKeyToRegenerate(null)
    }
  }

  const confirmDelete = async () => {
    if (!deleteKeyId) return

    try {
      await deleteApiKey(deleteKeyId)
      await loadApiKeys()
      toast({
        title: "Success",
        description: "API key deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete API key:", error)
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
      setDeleteKeyId(null)
    }
  }

  return (
    <>
      <Card className="animate-fade-up">
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>Manage your API keys for authentication.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No API keys found. Create your first API key to get started.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.key_id} className="animate-fade-in">
                      <TableCell className="font-medium">{key.description || "No description"}</TableCell>
                      <TableCell>{formatDate(key.created_at)}</TableCell>
                      <TableCell>{key.last_used ? formatDate(key.last_used) : "Never"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRegenerateClick(key.key_id)}
                            className="h-8 w-8 transition-all hover:text-green-500 hover:border-green-500"
                          >
                            <RotateCw className="h-4 w-4" />
                            <span className="sr-only">Regenerate</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(key.key_id)}
                            className="h-8 w-8 transition-all hover:text-red-500 hover:border-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {regeneratedKey && (
            <div className="mt-6 p-4 border rounded-md bg-green-50 dark:bg-green-950 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-green-800 dark:text-green-300">New API Key</h3>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Make sure to copy your new API key now. You won't be able to see it again!
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleCopyKey(regeneratedKey)} className="gap-1">
                  <Copy className="h-3 w-3" />
                  Copy
                </Button>
              </div>
              <div className="mt-2 p-2 bg-green-100 dark:bg-green-900 rounded font-mono text-sm break-all">
                {regeneratedKey}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to regenerate this API key? The current key will be invalidated immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRegenerate} className="bg-green-600 hover:bg-green-700">
              Regenerate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this API key? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
