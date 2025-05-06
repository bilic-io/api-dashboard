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
import { endpoints } from "@/lib/endpoints"
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
      setRequestBody(endpoint.defaultBody || "")
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
    <div className="grid gap-6 animate-fade-up">
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>Test and explore available API endpoints with code examples.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endpoint">Select Endpoint</Label>
              <Select onValueChange={handleEndpointChange} defaultValue={selectedEndpoint.path}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an endpoint" />
                </SelectTrigger>
                <SelectContent>
                  {endpoints.map((endpoint) => (
                    <SelectItem key={endpoint.path} value={endpoint.path}>
                      {endpoint.method} {endpoint.path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {selectedEndpoint.method} {selectedEndpoint.path}
                </h3>
                <div className="text-sm px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {selectedEndpoint.category}
                </div>
              </div>
              <p className="text-muted-foreground">{selectedEndpoint.description}</p>
            </div>

            {(selectedEndpoint.method !== "GET" || selectedEndpoint.pathParams) && (
              <div className="grid gap-2">
                <Label htmlFor="request-body">Request Body</Label>
                <Textarea
                  id="request-body"
                  placeholder="Enter request body as JSON"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="font-mono"
                  rows={5}
                />
              </div>
            )}

            <Button
              onClick={handleTestEndpoint}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 transition-all"
            >
              {loading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                  Testing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Test Endpoint
                </>
              )}
            </Button>

            {response && (
              <div className="grid gap-2 animate-fade-in">
                <Label>Response</Label>
                <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-md overflow-auto max-h-60">
                  <pre className="text-sm font-mono">{JSON.stringify(response, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
          <CardDescription>Copy and paste these code snippets to use in your application.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="javascript" value={language} onValueChange={setLanguage}>
            <TabsList className="mb-4">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="go">Go</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
            </TabsList>
            <TabsContent value={language} className="relative">
              <CodeBlock code={getCodeSnippet(language)} language={language} />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 gap-1"
                onClick={() => handleCopyCode(getCodeSnippet(language))}
              >
                <Copy className="h-3 w-3" />
                Copy
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
          <CardDescription>Detailed documentation for all available endpoints.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {endpoints.map((endpoint, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        endpoint.method === "GET"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : endpoint.method === "POST"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : endpoint.method === "PUT"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <span>{endpoint.path}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 pl-2">
                    <div>
                      <h4 className="font-medium">Description</h4>
                      <p className="text-muted-foreground">{endpoint.description}</p>
                    </div>

                    {endpoint.pathParams && endpoint.pathParams.length > 0 && (
                      <div>
                        <h4 className="font-medium">Path Parameters</h4>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {endpoint.pathParams.map((param) => (
                            <li key={param}>{param}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {endpoint.requestBody && (
                      <div>
                        <h4 className="font-medium">Request Body</h4>
                        <pre className="p-2 bg-slate-100 dark:bg-slate-900 rounded-md text-xs font-mono">
                          {JSON.stringify(JSON.parse(endpoint.requestBody), null, 2)}
                        </pre>
                      </div>
                    )}

                    {endpoint.responseExample && (
                      <div>
                        <h4 className="font-medium">Response Example</h4>
                        <pre className="p-2 bg-slate-100 dark:bg-slate-900 rounded-md text-xs font-mono">
                          {JSON.stringify(JSON.parse(endpoint.responseExample), null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
