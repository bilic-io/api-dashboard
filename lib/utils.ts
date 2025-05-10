import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function getErrorMessage(error: unknown, fallback = "There was an error.") {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    // Axios error
    if (
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "detail" in error.response.data &&
      typeof error.response.data.detail === "string"
    ) {
      return error.response.data.detail;
    }
    // Direct detail
    if ("detail" in error && typeof error.detail === "string") {
      return error.detail;
    }
    // Message
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return fallback;
}
