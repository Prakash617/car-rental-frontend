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

/**
 * Enterprise API client that attaches tenant hostname routing headers
 * and unwraps standardized response envelopes.
 */
export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { tenantHost, token, headers: customHeaders, ...restOptions } = options;

  const resolvedHost =
    tenantHost ||
    (typeof window !== "undefined" ? window.location.host : "localhost:3000");

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

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.replace(/^\/api\/v1/, "");
  const path = cleanEndpoint.startsWith("/") ? cleanEndpoint : `/${cleanEndpoint}`;
  const url = `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers,
    });

    const json: ApiResponse<T> = await response.json();

    if (!response.ok || !json.success) {
      const code = json.error?.code || `HTTP_${response.status}`;
      const message = json.error?.message || response.statusText || "Request failed";
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
