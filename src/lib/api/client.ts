import { ApiResponse } from "@/types";

export class ApiError extends Error {
  code: string;
  statusCode: number;
  details?: unknown;

  constructor(message: string, code: string = "API_ERROR", statusCode: number = 500, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface RequestOptions extends RequestInit {
  tenantHost?: string;
  token?: string;
}

function formatErrorMessage(rawMessage?: string, details?: unknown): string {
  if (details && typeof details === "object" && !Array.isArray(details)) {
    const errorEntries = Object.entries(details as Record<string, unknown>);
    if (errorEntries.length > 0) {
      const formatted = errorEntries.map(([field, err]) => {
        const fieldName = field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const errText = Array.isArray(err) ? err.join(", ") : String(err);
        return `${fieldName}: ${errText}`;
      });
      return formatted.join(" | ");
    }
  }

  if (rawMessage) {
    if (rawMessage.includes("ErrorDetail")) {
      const cleaned = rawMessage
        .replace(/ErrorDetail\(string=['"](.*?)['"], code=['"].*?['"]\)/g, "$1")
        .replace(/\{|\}|\[|\]|'/g, "")
        .trim();
      if (cleaned) return cleaned;
    }
    return rawMessage;
  }

  return "Request failed";
}

/**
 * Enterprise API client that attaches tenant hostname routing headers,
 * auto-resolves authentication tokens, and unwraps standardized response envelopes.
 */
export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { tenantHost, token, headers: customHeaders, ...restOptions } = options;

  const resolvedHost =
    tenantHost ||
    (typeof window !== "undefined" ? window.location.host : "localhost:3000");

  let authToken = token;
  if (!authToken && typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("apex_saas_auth_session");
      if (stored) {
        const session = JSON.parse(stored);
        if (session?.access_token) {
          authToken = session.access_token;
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Forwarded-Host": resolvedHost,
    ...((customHeaders as Record<string, string>) || {}),
  };

  // The 'Host' header is forbidden in browser fetch() specifications; only attach on SSR
  if (typeof window === "undefined") {
    headers.Host = resolvedHost;
  }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const cleanEndpoint = endpoint.replace(/^\/api\/v1/, "");
  const path = cleanEndpoint.startsWith("/") ? cleanEndpoint : `/${cleanEndpoint}`;
  const url = `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers,
    });

    let json: ApiResponse<T>;
    try {
      json = await response.json();
    } catch {
      if (!response.ok) {
        throw new ApiError(response.statusText || "Server error", `HTTP_${response.status}`, response.status);
      }
      return undefined as unknown as T;
    }

    if (!response.ok || !json.success) {
      const code = json.error?.code || `HTTP_${response.status}`;
      const message = formatErrorMessage(json.error?.message, json.error?.details) || response.statusText || "Request failed";
      throw new ApiError(message, code, response.status, json.error?.details);
    }

    return json.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error occurred",
      "NETWORK_ERROR",
      0
    );
  }
}
