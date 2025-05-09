// import { endpoints } from "@/lib/endpoints";

export const updatedEndpoints = [
  {
    path: "/api/thread/{thread_id}/agent/start",
    method: "POST",
    description: "Start an agent for a specific thread in the background.",
    category: "Agent Management",
    pathParams: ["thread_id"],
    requestBody: JSON.stringify({
      model_name: "anthropic/claude-3-7-sonnet-latest",
      enable_thinking: false,
      reasoning_effort: "low",
      stream: true,
      enable_context_manager: false,
    }, null, 2),
    responseExample: JSON.stringify({ success: true, message: "Agent started." }, null, 2),
  },
  {
    path: "/api/agent-run/{agent_run_id}/stop",
    method: "POST",
    description: "Stop a running agent.",
    category: "Agent Management",
    pathParams: ["agent_run_id"],
    responseExample: JSON.stringify({ success: true, message: "Agent stopped." }, null, 2),
  },
  {
    path: "/api/thread/{thread_id}/agent-runs",
    method: "GET",
    description: "Get all agent runs for a thread.",
    category: "Agent Management",
    pathParams: ["thread_id"],
    responseExample: JSON.stringify({ agent_runs: [] }, null, 2),
  },
  {
    path: "/api/signup",
    method: "POST",
    description: "Signup a new user.",
    category: "Authentication",
    requestBody: JSON.stringify({ email: "user@example.com", password: "password123" }, null, 2),
    responseExample: JSON.stringify({ access_token: "token", token_type: "bearer" }, null, 2),
  },
  {
    path: "/api/signin",
    method: "POST",
    description: "Signin an existing user.",
    category: "Authentication",
    requestBody: JSON.stringify({ email: "user@example.com", password: "password123" }, null, 2),
    responseExample: JSON.stringify({ access_token: "token", token_type: "bearer" }, null, 2),
  },
];
