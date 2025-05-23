"use client"

import type React from "react"

import { useState } from "react"
import { KeyRound, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ApiKeyFormProps {
  onSave: (apiKey: string) => void
  onCancel: () => void
}

export function ApiKeyForm({ onSave, onCancel }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!apiKey.trim()) {
      setError("Please enter your OpenAI API key")
      return
    }

    if (!apiKey.startsWith("sk-")) {
      setError("This doesn't look like a valid OpenAI API key. It should start with 'sk-'")
      return
    }

    setIsSaving(true)

    try {
      // Store in localStorage for this demo
      // In a real app, you'd want to store this more securely
      localStorage.setItem("openai-api-key", apiKey)

      // Validate the key with a simple test call
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error("Invalid API key or API access issue")
      }

      onSave(apiKey)
    } catch (err) {
      console.error("Error validating API key:", err)
      setError(err instanceof Error ? err.message : "Failed to validate API key")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="border-purple-100 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
          Connect Your OpenAI API Key
        </CardTitle>
        <CardDescription>
          Enhance resume parsing and job matching with AI. Your API key is stored locally and never sent to our servers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-sm font-medium">
                OpenAI API Key
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  className="pl-9 border-purple-100 focus:border-purple-300"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500">
                You can find your API key in your{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  OpenAI dashboard
                </a>
                .
              </p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-purple-100 pt-4">
        <Button variant="outline" onClick={onCancel} className="border-purple-200 text-purple-700 hover:bg-purple-50">
          Skip for now
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className="gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save API Key
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
