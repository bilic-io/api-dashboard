import type { ApiKey, ApiKeyResponse } from "./types"

const BASE_URL = "http://localhost:8000/api"

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.detail || `API error: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

// Get the JWT token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

// Create a new API key
export async function createApiKey(description?: string): Promise<ApiKeyResponse> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Authentication required")
  }

  const response = await fetch(`${BASE_URL}/api-keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ description }),
  })

  return handleResponse<ApiKeyResponse>(response)
}

// Fetch all API keys
export async function fetchApiKeys(): Promise<ApiKey[]> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Authentication required")
  }

  const response = await fetch(`${BASE_URL}/api-keys`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse<ApiKey[]>(response)
}

// Regenerate an API key
export async function regenerateApiKey(keyId: string): Promise<ApiKeyResponse> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Authentication required")
  }

  const response = await fetch(`${BASE_URL}/api-keys/${keyId}/regenerate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse<ApiKeyResponse>(response)
}

// Delete an API key
export async function deleteApiKey(keyId: string): Promise<void> {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Authentication required")
  }

  const response = await fetch(`${BASE_URL}/api-keys/${keyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.detail || `API error: ${response.status} ${response.statusText}`)
  }
}

// Authentication functions

// Login function
export async function login(email: string, password: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await handleResponse<{ access_token: string; token_type: string }>(response)
  const token = data.access_token

  // Store the token in localStorage
  localStorage.setItem("authToken", token)

  return token
}

// Register function
export async function register(name: string, email: string, password: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await handleResponse<{ access_token: string; token_type: string }>(response)
  const token = data.access_token

  // Store the token in localStorage
  localStorage.setItem("authToken", token)

  return token
}

// Request password reset
export async function requestPasswordReset(email: string): Promise<void> {
  // This endpoint is not implemented in the backend yet
  // In a real app, you would call your password reset endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

// Reset password with token
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  // This endpoint is not implemented in the backend yet
  // In a real app, you would call your password reset confirmation endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

// Logout function
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}
