"use client";
import React, { useState } from "react";
import { updatedEndpoints } from "@/lib/endpoints";
import { CodeBlock } from "@/components/code-block";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const copyToClipboard = () => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
      });
    } else {
      alert("Nothing to copy!");
    }
  };

  return <button onClick={copyToClipboard}>Copy to Clipboard</button>;
};

const ApiDocumentation: React.FC = () => {
  const [authToken, setAuthToken] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  const generateCodeSnippet = (endpoint: string, method: string, headers: string[], body: any) => {
    const url = endpoint;
    const headersSnippet = headers
      .map((header) => `"${header}": "${authToken}"`)
      .join(",\n");
    const bodySnippet = body ? JSON.stringify(body, null, 2) : "";

    if (selectedLanguage === "javascript") {
      return `axios({
  method: "${method}",
  url: "${url}",
  headers: {
    ${headersSnippet}
  },
  data: ${bodySnippet}
});`;
    } else if (selectedLanguage === "python") {
      return `import requests

url = "${url}"
headers = {
    ${headersSnippet}
}
data = ${bodySnippet}

response = requests.${method.toLowerCase()}(url, headers=headers, json=data)
print(response.json())`;
    } else if (selectedLanguage === "curl") {
      return `curl -X ${method} \
  "${url}" \
  -H "${headersSnippet}" \
  -d '${bodySnippet}'`;
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Auth Token:</label>
        <input
          type="text"
          value={authToken}
          onChange={(e) => setAuthToken(e.target.value)}
          placeholder="Enter your auth token"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Language:</label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="curl">cURL</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {updatedEndpoints.map((endpoint, index) => (
          <Card key={index} className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{endpoint.method} {endpoint.path}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">{endpoint.description}</p>
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Code Snippet:</h4>
                <CodeBlock language={selectedLanguage} code={generateCodeSnippet(endpoint.path, endpoint.method, endpoint.headers || [], endpoint.requestBody) || ""} />
              </div>
              <CopyButton text={generateCodeSnippet(endpoint.path, endpoint.method, endpoint.headers || [], endpoint.requestBody) || ""} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApiDocumentation;
