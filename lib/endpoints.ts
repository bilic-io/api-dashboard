import type { Endpoint } from "./types"

export const endpoints: Endpoint[] = [
  {
    path: "/api-keys",
    method: "POST",
    description: "Create a new API key for authentication.",
    category: "API Keys",
    requestBody: JSON.stringify({
      description: "My API Key",
    }),
    responseExample: JSON.stringify({
      key_id: "uuid-example",
      api_key: "your-api-key-value",
      created_at: "2023-01-01T00:00:00Z",
      description: "My API Key",
    }),
    defaultBody: JSON.stringify(
      {
        description: "My API Key",
      },
      null,
      2,
    ),
  },
  {
    path: "/api-keys",
    method: "GET",
    description: "List all active API keys for the authenticated user.",
    category: "API Keys",
    responseExample: JSON.stringify([
      {
        key_id: "uuid-example-1",
        created_at: "2023-01-01T00:00:00Z",
        description: "Production API Key",
        last_used: "2023-01-02T00:00:00Z",
      },
      {
        key_id: "uuid-example-2",
        created_at: "2023-01-03T00:00:00Z",
        description: "Development API Key",
        last_used: null,
      },
    ]),
  },
  {
    path: "/api-keys/{key_id}/regenerate",
    method: "POST",
    description: "Regenerate an existing API key. The old key will be invalidated immediately.",
    category: "API Keys",
    pathParams: ["key_id"],
    responseExample: JSON.stringify({
      key_id: "uuid-example",
      api_key: "new-api-key-value",
      created_at: "2023-01-04T00:00:00Z",
      description: "My API Key",
    }),
    defaultBody: JSON.stringify(
      {
        key_id: "your-key-id",
      },
      null,
      2,
    ),
  },
  {
    path: "/api-keys/{key_id}",
    method: "DELETE",
    description: "Delete an API key. The key will be immediately invalidated.",
    category: "API Keys",
    pathParams: ["key_id"],
    defaultBody: JSON.stringify(
      {
        key_id: "your-key-id",
      },
      null,
      2,
    ),
  },
  {
    path: "/signup",
    method: "POST",
    description: "Register a new user account.",
    category: "API Keys",
    requestBody: JSON.stringify({
      email: "user@example.com",
      password: "your-secure-password",
    }),
    responseExample: JSON.stringify({
      access_token: "jwt-token-example",
      token_type: "bearer",
    }),
    defaultBody: JSON.stringify(
      {
        email: "user@example.com",
        password: "your-secure-password",
      },
      null,
      2,
    ),
  },
  {
    path: "/signin",
    method: "POST",
    description: "Authenticate and get an access token.",
    category: "API Keys",
    requestBody: JSON.stringify({
      email: "user@example.com",
      password: "your-secure-password",
    }),
    responseExample: JSON.stringify({
      access_token: "jwt-token-example",
      token_type: "bearer",
    }),
    defaultBody: JSON.stringify(
      {
        email: "user@example.com",
        password: "your-secure-password",
      },
      null,
      2,
    ),
  },
]
