"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updatedEndpoints as endpoints } from "@/lib/endpoints"
import { CodeBlock } from "@/components/code-block"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function ApiDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0])
  const [apiKey, setApiKey] = useState("")
  const [requestBody, setRequestBody] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState("javascript")
  const { toast } = useToast()

  const handleEndpointChange = (value: string) => {
    const endpoint = endpoints.find((e) => e.path === value)
    if (endpoint) {
      setSelectedEndpoint(endpoint)
      setRequestBody(endpoint.requestBody || "")
      setResponse(null)
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Copied!",
      description: "Code snippet copied to clipboard",
    })
  }

  const handleTestEndpoint = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your API key to test this endpoint",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      let url = `https://bilic-manus-production.up.railway.app${selectedEndpoint.path}`

      // Replace path parameters if any
      if (selectedEndpoint.pathParams && selectedEndpoint.pathParams.length > 0) {
        const pathParamValues = JSON.parse(requestBody)
        selectedEndpoint.pathParams.forEach((param) => {
          if (pathParamValues[param]) {
            url = url.replace(`{${param}}`, pathParamValues[param])
          }
        })
      }

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }

      if (selectedEndpoint.method !== "GET" && requestBody) {
        options.body = requestBody
      }

      const res = await fetch(url, options)
      const data = await res.json()
      setResponse(data)
    } catch (error) {
      console.error("API request failed:", error)
      toast({
        title: "Request Failed",
        description: "Failed to execute the API request. Check console for details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getCodeSnippet = (language: string) => {
    const baseUrl = "https://bilic-manus-production.up.railway.app"
    const endpoint = selectedEndpoint.path
    const method = selectedEndpoint.method

    switch (language) {
      case "javascript":
        return `// Using fetch API
const apiKey = "YOUR_API_KEY";

fetch("${baseUrl}${endpoint}", {
  method: "${method}",
  headers: {
    "Authorization": \`Bearer \${apiKey}\`,
    "Content-Type": "application/json"
  }${
    method !== "GET"
      ? `,
  body: JSON.stringify(${requestBody || "{}"})`
      : ""
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));`

      case "python":
        return `# Using requests library
import requests

api_key = "YOUR_API_KEY"
url = "${baseUrl}${endpoint}"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

${
  method !== "GET"
    ? `payload = ${requestBody || "{}"}

response = requests.${method.toLowerCase()}(url, json=payload, headers=headers)`
    : `response = requests.${method.toLowerCase()}(url, headers=headers)`
}
print(response.json())`

      case "go":
        return `// Using net/http package
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	apiKey := "YOUR_API_KEY"
	url := "${baseUrl}${endpoint}"

	${
    method !== "GET"
      ? `payload := ${requestBody || '[]byte("{}")'} 
	req, err := http.NewRequest("${method}", url, bytes.NewBuffer(payload))`
      : `req, err := http.NewRequest("${method}", url, nil)`
  }
	if err != nil {
		panic(err)
	}

	req.Header.Set("Authorization", "Bearer " + apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(string(body))
}`

      case "curl":
        return `curl -X ${method} \\
  "${baseUrl}${endpoint}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"${
    method !== "GET"
      ? ` \\
  -d '${requestBody || "{}"}'`
      : ""
  }`

      default:
        return "// Code snippet not available for this language"
    }
  }

  return (
    <div className="grid gap-6 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <div className="grid gap-4">
        <label htmlFor="api-key" className="text-sm font-medium">API Key</label>
        <input
          id="api-key"
          type="password"
          placeholder="Enter your API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="p-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid gap-4">
        <label htmlFor="endpoint" className="text-sm font-medium">Select Endpoint</label>
        <select
          id="endpoint"
          onChange={(e) => handleEndpointChange(e.target.value)}
          value={selectedEndpoint.path}
          className="p-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {endpoints.map((endpoint) => (
            <option key={endpoint.path} value={endpoint.path}>
              {endpoint.method} {endpoint.path}
            </option>
          ))}
        </select>
      </div>

      {selectedEndpoint.method !== "GET" && (
        <div className="grid gap-4">
          <label htmlFor="request-body" className="text-sm font-medium">Request Body</label>
          <textarea
            id="request-body"
            placeholder="Enter request body as JSON"
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            rows={5}
          />
        </div>
      )}

      <button
        onClick={handleTestEndpoint}
        disabled={loading}
        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {loading ? "Testing..." : "Test Endpoint"}
      </button>

      {response && (
        <div className="grid gap-4">
          <label className="text-sm font-medium">Response</label>
          <pre className="p-4 bg-gray-800 border border-gray-700 rounded-md overflow-auto max-h-60">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
