"use client";
import React, { useState, useEffect, useRef } from "react";
import { updatedEndpoints } from "@/lib/endpoints";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, ChevronDown, Code, Terminal, TestTube2, Copy, Folder } from "lucide-react";

// Helper: filter out auth and api key endpoints
const filteredEndpoints = updatedEndpoints.filter(endpoint => {
  const authCategories = [
    "Authentication",
    "API Key Management",
    "User Management"
  ];
  const authPaths = [
    "/api/signup",
    "/api/signin",
    "/api/logout",
    "/api/profile",
    "/api/password/reset-request",
    "/api/password/reset-confirm",
    "/api/api-keys"
  ];
  // Remove any endpoint in an auth category or with a matching path or path prefix
  if (authCategories.includes(endpoint.category)) return false;
  if (authPaths.some(p => endpoint.path.startsWith(p))) return false;
  if (endpoint.path.startsWith("/api/api-keys")) return false;
  if (endpoint.path.startsWith("/api/password")) return false;
  return true;
});

// Group endpoints by category
const groupedEndpoints = filteredEndpoints.reduce((acc, endpoint) => {
  if (!acc[endpoint.category]) acc[endpoint.category] = [];
  acc[endpoint.category].push(endpoint);
  return acc;
}, {} as Record<string, typeof filteredEndpoints>);

const categories = Object.keys(groupedEndpoints);

const ApiDocumentation = () => {
  // Default to first endpoint in first category
  const firstCategory = categories[0];
  const firstEndpoint = groupedEndpoints[firstCategory][0];
  const [selectedEndpoint, setSelectedEndpoint] = useState(firstEndpoint);
  const [apiKey, setApiKey] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [requestParams, setRequestParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    // Open first section by default
    const obj: Record<string, boolean> = {};
    categories.forEach((cat, i) => { obj[cat] = i === 0; });
    return obj;
  });
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const toggleSection = (cat: string) => {
    setOpenSections(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const requiresAuth = (endpoint: any) => {
    const authEndpoints = [
      "/api/signup",
      "/api/signin",
      "/api/logout",
      "/api/profile",
      "/api/api-keys"
    ];
    return authEndpoints.some(path => endpoint.path.startsWith(path));
  };

  const generateCodeSnippet = () => {
    const url = selectedEndpoint.path.replace(/\{(.*?)\}/g, (_, key) => requestParams[key] || `{${key}}`);
    const headers = requiresAuth(selectedEndpoint) 
      ? `"Authorization": "Bearer ${apiKey}"`
      : `"x-api-key": "${apiKey}"`;
    const body = selectedEndpoint.requestBody ? JSON.stringify(JSON.parse(selectedEndpoint.requestBody || '{}'), null, 2) : "";

    if (selectedLanguage === "javascript") {
      return `const axios = require('axios');

const options = {
  method: '${selectedEndpoint.method}',
  url: '${url}',
  headers: {
    ${headers}
  }${body ? `,\n  data: ${body}` : ''}
};

axios.request(options)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });`;
    } else if (selectedLanguage === "typescript") {
      return `import axios, { AxiosRequestConfig } from 'axios';

const options: AxiosRequestConfig = {
  method: '${selectedEndpoint.method}',
  url: '${url}',
  headers: {
    ${headers}
  }${body ? `,\n  data: ${body}` : ''}
};

axios.request(options)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });`;
    } else if (selectedLanguage === "react") {
      return `import React from 'react';

export default function FetchExample() {
  React.useEffect(() => {
    fetch('${url}', {
      method: '${selectedEndpoint.method}',
      headers: {
        ${headers}
      }${body ? `,\n      body: JSON.stringify(${body})` : ''}
    })
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);
  return <div>Check the console for results.</div>;
}`;
    } else if (selectedLanguage === "python") {
      return `import requests

url = "${url}"
headers = {
    ${headers}
}${body ? `\ndata = ${body}` : ''}

response = requests.${selectedEndpoint.method.toLowerCase()}(url, headers=headers${body ? ', json=data' : ''})
print(response.json())`;
    } else if (selectedLanguage === "curl") {
      return `curl -X ${selectedEndpoint.method} \\
  '${url}' \\
  -H '${requiresAuth(selectedEndpoint) ? 'Authorization: Bearer ' + apiKey : 'x-api-key: ' + apiKey}'${
  body ? ` \\
  -d '${body}'` : ''
}`;
    } else if (selectedLanguage === "go") {
      return `package main

import (
  "bytes"
  "fmt"
  "io/ioutil"
  "net/http"
)

func main() {
  url := "${url}"
  method := "${selectedEndpoint.method}"
  client := &http.Client{}
  var reqBody *bytes.Buffer
  ${body ? `reqBody = bytes.NewBufferString(\n${body.split('\n').map(line => '    "' + line.replace(/"/g, '\\"') + '\\n"').join(' +\n')}\n  )` : 'reqBody = nil'}
  req, err := http.NewRequest(method, url, reqBody)
  if err != nil {
    fmt.Println(err)
    return
  }
  req.Header.Add(${requiresAuth(selectedEndpoint) ? '"Authorization", "Bearer ' + apiKey + '"' : '"x-api-key", "' + apiKey + '"'})
  resp, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer resp.Body.Close()
  respBody, _ := ioutil.ReadAll(resp.Body)
  fmt.Println(string(respBody))
}`;
    } else if (selectedLanguage === "ruby") {
      return `require 'net/http'
require 'uri'
require 'json'

uri = URI.parse("${url}")
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = uri.scheme == 'https'
request = Net::HTTP::${selectedEndpoint.method.charAt(0) + selectedEndpoint.method.slice(1).toLowerCase()}.new(uri.request_uri)
request[${requiresAuth(selectedEndpoint) ? '"Authorization"' : '"x-api-key"'}] = ${requiresAuth(selectedEndpoint) ? '"Bearer ' + apiKey + '"' : '"' + apiKey + '"'}
${body ? `request.body = ${body}\n` : ''}response = http.request(request)
puts response.body`;
    }
    return "";
  };

  const handleTestApi = async () => {
    setLoading(true);
    try {
      const url = selectedEndpoint.path.replace(/\{(.*?)\}/g, (_, key) => requestParams[key] || `{${key}}`);
      const headers = {
        "Content-Type": "application/json",
        ...(requiresAuth(selectedEndpoint) 
          ? { "Authorization": `Bearer ${apiKey}` }
          : { "x-api-key": apiKey })
      };
      const response = await fetch(url, {
        method: selectedEndpoint.method,
        headers: headers,
        body: selectedEndpoint.method !== "GET" ? (requestParams.__body || selectedEndpoint.requestBody) : undefined
      });
      const data = await response.json();
      setResponse(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper: check if Send should be disabled
  const sendDisabled = loading || !apiKey || (selectedEndpoint.pathParams?.some(p => !requestParams[p]));

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden relative">
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[url('/noise.png')] opacity-10" />
      {/* Sidebar: API Listing */}
      <div className={`border-r border-border bg-background relative flex-shrink-0 z-10 ${isMobile ? 'hidden' : 'w-64 min-w-56'}`}> 
        <ScrollArea className="h-full relative z-10">
          <div className="p-4">
            <h2 className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">API Reference</h2>
            {categories.map(category => (
              <div key={category} className="mb-2">
                <button
                  className="flex items-center w-full px-2 py-1 rounded-md bg-muted hover:bg-muted/70 text-foreground font-semibold text-sm mb-1 transition"
                  onClick={() => toggleSection(category)}
                  aria-expanded={openSections[category]}
                >
                  <Folder className="w-4 h-4 mr-2 text-primary" />
                  <span className="flex-1 text-left">{category}</span>
                  {openSections[category] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {openSections[category] && (
                  <div className="ml-4 mt-1">
                    {groupedEndpoints[category].map((endpoint, idx) => (
                      <div
                        key={endpoint.path + endpoint.method}
                        className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer mb-1 transition text-sm font-medium border-l-4 ${selectedEndpoint.path === endpoint.path && selectedEndpoint.method === endpoint.method ? "bg-muted border-primary text-foreground" : "border-transparent text-muted-foreground hover:bg-muted/50"}`}
                        onClick={() => setSelectedEndpoint(endpoint)}
                        tabIndex={0}
                        aria-label={`Select endpoint ${endpoint.method} ${endpoint.path}`}
                      >
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${endpoint.method === "GET" ? "bg-blue-700 text-white" : endpoint.method === "POST" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{endpoint.method}</span>
                        <span className="truncate">{endpoint.path}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main 3-column layout */}
      <div ref={mainRef} className={`flex flex-1 h-full min-w-0 z-10 ${isMobile ? 'flex-col' : ''}`}> 
        {/* Middle Panel: Params, Request Body, API Key, Send, and Response (no tabs) */}
        <div className={`flex flex-col border-r border-border bg-background min-h-0 ${isMobile ? 'w-full max-w-full' : 'flex-1 min-w-[320px]'} overflow-auto`}> 
          {/* Endpoint Overview */}
          <div className="p-6 border-b border-border bg-background/80">
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-block px-3 py-1 rounded text-sm font-bold tracking-wide ${selectedEndpoint.method === "GET" ? "bg-blue-700 text-white" : selectedEndpoint.method === "POST" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{selectedEndpoint.method}</span>
              <span className="font-mono text-lg text-foreground bg-muted px-3 py-1 rounded select-all">{selectedEndpoint.path}</span>
            </div>
            <div className="text-base text-foreground font-semibold mb-1">{selectedEndpoint.description}</div>
            {selectedEndpoint.category && (
              <span className="inline-block bg-muted text-primary text-xs font-bold rounded px-2 py-0.5 mt-1">{selectedEndpoint.category}</span>
            )}
          </div>
          <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
            {/* Path Params */}
            {Array.isArray(selectedEndpoint.pathParams) && selectedEndpoint.pathParams.length > 0 && (
              <div>
                <div className="font-semibold text-sm text-primary mb-2">Path Parameters</div>
                <div className="flex flex-col gap-3">
                  {selectedEndpoint.pathParams.map(param => (
                    <div key={param} className="flex items-center gap-4">
                      <label className="w-40 text-sm text-foreground font-medium" htmlFor={`path-param-${param}`}>{param}</label>
                      <Input
                        id={`path-param-${param}`}
                        value={requestParams[param] || ""}
                        onChange={(e) => setRequestParams(prev => ({ ...prev, [param]: e.target.value }))}
                        className="flex-1 bg-background border-border text-foreground text-base px-3 py-2 focus:border-primary focus:ring-primary"
                        placeholder={`Enter ${param}`}
                      />
                      {(
                        (("paramDescriptions" in selectedEndpoint && (selectedEndpoint.paramDescriptions as Record<string, string> | undefined)?.[param]) ||
                        ("paramTypes" in selectedEndpoint && (selectedEndpoint.paramTypes as Record<string, string> | undefined)?.[param])) && (
                          <div className="flex flex-col min-w-[120px]">
                            {"paramTypes" in selectedEndpoint && (selectedEndpoint.paramTypes as Record<string, string> | undefined)?.[param] && (
                              <span className="text-xs text-muted-foreground">{(selectedEndpoint.paramTypes as Record<string, string>)[param]}</span>
                            )}
                            {"paramDescriptions" in selectedEndpoint && (selectedEndpoint.paramDescriptions as Record<string, string> | undefined)?.[param] && (
                              <span className="text-xs text-muted-foreground">{(selectedEndpoint.paramDescriptions as Record<string, string>)[param]}</span>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Query Params */}
            {Array.isArray(selectedEndpoint.queryParams) && selectedEndpoint.queryParams.length > 0 && (
              <div>
                <div className="font-semibold text-sm text-primary mb-2">Query Parameters</div>
                <div className="flex flex-col gap-3">
                  {selectedEndpoint.queryParams.map(param => (
                    <div key={param} className="flex items-center gap-4">
                      <label className="w-40 text-sm text-foreground font-medium" htmlFor={`query-param-${param}`}>{param}</label>
                      <Input
                        id={`query-param-${param}`}
                        value={requestParams[param] || ""}
                        onChange={(e) => setRequestParams(prev => ({ ...prev, [param]: e.target.value }))}
                        className="flex-1 bg-background border-border text-foreground text-base px-3 py-2 focus:border-primary focus:ring-primary"
                        placeholder={`Enter ${param}`}
                      />
                      {(
                        (("paramDescriptions" in selectedEndpoint && (selectedEndpoint.paramDescriptions as Record<string, string> | undefined)?.[param]) ||
                        ("paramTypes" in selectedEndpoint && (selectedEndpoint.paramTypes as Record<string, string> | undefined)?.[param])) && (
                          <div className="flex flex-col min-w-[120px]">
                            {"paramTypes" in selectedEndpoint && (selectedEndpoint.paramTypes as Record<string, string> | undefined)?.[param] && (
                              <span className="text-xs text-muted-foreground">{(selectedEndpoint.paramTypes as Record<string, string>)[param]}</span>
                            )}
                            {"paramDescriptions" in selectedEndpoint && (selectedEndpoint.paramDescriptions as Record<string, string> | undefined)?.[param] && (
                              <span className="text-xs text-muted-foreground">{(selectedEndpoint.paramDescriptions as Record<string, string>)[param]}</span>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Request Body */}
            {selectedEndpoint.requestBody && (
              <div>
                <div className="font-semibold text-sm text-primary mb-2">Request Body (JSON)</div>
                <textarea
                  className="w-full font-mono text-base bg-background border border-border rounded p-3 resize-y max-h-60 min-h-32 focus:outline-primary focus:border-primary text-foreground"
                  value={requestParams.__body ?? JSON.stringify(JSON.parse(selectedEndpoint.requestBody), null, 2)}
                  onChange={e => setRequestParams(prev => ({ ...prev, __body: e.target.value }))}
                  spellCheck={false}
                  aria-label="Request Body"
                />
              </div>
            )}
            {/* API Key and Send Button */}
            <div className="flex flex-col gap-3 border-t border-border pt-6 mt-2">
              <div className="flex items-center gap-4">
                <label htmlFor="api-key-input" className="w-40 text-sm text-foreground font-medium">API Key</label>
                <Input
                  id="api-key-input"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 bg-background border-border text-foreground text-base px-3 py-2 focus:border-primary focus:ring-primary"
                  placeholder="Enter your API key"
                />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleTestApi}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground text-base px-6 py-2 font-semibold rounded disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                  disabled={sendDisabled}
                  aria-busy={loading}
                >
                  {loading ? <span className="animate-spin mr-2 w-5 h-5 border-2 border-t-transparent border-primary-foreground rounded-full inline-block align-middle" /> : null}
                  Send
                </Button>
                {loading && (
                  <span className="text-base text-muted-foreground flex items-center gap-2"><span className="animate-spin w-5 h-5 border-2 border-t-transparent border-primary rounded-full inline-block" /> Loading...</span>
                )}
              </div>
            </div>
            {/* Live Response */}
            <div className="mt-6">
              <div className="font-semibold text-sm text-primary mb-2">Live Response</div>
              {error ? (
                <div className="p-3 bg-destructive/20 border border-destructive rounded-md">
                  <pre className="text-destructive text-sm">{error}</pre>
                </div>
              ) : response ? (
                <div className="overflow-auto max-h-60 border border-border rounded">
                  <CodeBlock language="json" code={JSON.stringify(response, null, 2)} />
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">No response yet. Send a request to see the response.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Code & Example Response Tabs */}
        <div className={`flex flex-col bg-background border-r border-border min-h-0 z-10 ${isMobile ? 'w-full max-w-full' : 'flex-1 min-w-[320px]'}`}>
          <Tabs defaultValue="code" className="flex-1 flex flex-col min-h-0">
            <TabsList className="px-4 pt-2 bg-transparent border-b border-border flex gap-2">
              <TabsTrigger value="code" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground rounded-t-md px-4 py-2 transition-colors">Code</TabsTrigger>
              <TabsTrigger value="example" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground rounded-t-md px-4 py-2 transition-colors">Example Response</TabsTrigger>
            </TabsList>
            {/* Code Tab */}
            <TabsContent value="code" className="flex-1 p-4 min-h-0">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-primary font-bold text-xs">Code Sample</div>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-muted border-border text-foreground p-1 rounded-md text-xs"
                  >
                    <option value="javascript">JavaScript (Axios)</option>
                    <option value="typescript">TypeScript (Axios)</option>
                    <option value="react">React (fetch)</option>
                    <option value="python">Python (requests)</option>
                    <option value="curl">cURL</option>
                    <option value="go">Go</option>
                    <option value="ruby">Ruby</option>
                  </select>
                </div>
                <div className="relative border border-border rounded whitespace-pre-wrap break-words overflow-auto max-h-[35rem] bg-background">
                  <CodeBlock language={selectedLanguage} code={generateCodeSnippet()} />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2 bg-primary hover:bg-primary/80"
                    onClick={() => navigator.clipboard.writeText(generateCodeSnippet())}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            {/* Example Response Tab */}
            <TabsContent value="example" className="flex-1 p-4 overflow-auto min-h-0">
              <div className="flex flex-col gap-2">
                <div className="text-primary font-bold text-xs mb-2">Example Response</div>
                {selectedEndpoint.responseExample ? (
                  <div className="overflow-auto max-h-56 border border-border rounded bg-background">
                    <CodeBlock language="json" code={JSON.stringify(JSON.parse(selectedEndpoint.responseExample), null, 2)} />
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs">No example response available.</span>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// CollapsibleRequestBody component
function CollapsibleRequestBody({ requestBody, value, onChange }: { requestBody: string, value: string, onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-2">
      <button
        className="flex items-center gap-2 text-xs text-green-700 hover:underline mb-1"
        onClick={() => setOpen(v => !v)}
        type="button"
      >
        <span className="font-semibold">Request Body</span>
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
      {open && (
        <textarea
          className="w-full font-mono text-xs bg-green-50 border border-green-200 rounded p-2 resize-y max-h-40 min-h-24 focus:outline-green-600"
          value={value}
          onChange={e => onChange(e.target.value)}
          spellCheck={false}
        />
      )}
    </div>
  );
}

export default ApiDocumentation;
