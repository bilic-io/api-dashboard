export interface ApiKey {
  key_id: string
  created_at: string
  description: string | null
  last_used: string | null
}

export interface ApiKeyResponse {
  key_id: string
  api_key: string | null
  created_at: string
  description: string | null
}

export interface Endpoint {
  path: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  description: string
  category: "Agent" | "API Keys" | "Sandbox" | "Health"
  pathParams?: string[]
  requestBody?: string
  responseExample?: string
  defaultBody?: string
}

export interface User {
  id: string
  email: string
}
