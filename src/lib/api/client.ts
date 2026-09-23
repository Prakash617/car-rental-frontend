import { ApiResponse } from "@/types";

export class ApiError extends Error {
  code: string;
  statusCode: number;
  details?: unknown;

  constructor(code: string, message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  tenantHost?: string;
  authToken?: string;
}

/**
 * Centralized API client for communicating with the Django backend.
 * Automatically injects headers, params, and resolves the standardized envelope.
 */
export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const url = new URL(`/api/v1${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`, baseUrl);

  if (options.params) {
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        url.searchParams.append(key, String(val));
      }
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (options.tenantHost) {
    headers["Host"] = options.tenantHost;
  }

  if (options.authToken) {
    headers["Authorization"] = `Bearer ${options.authToken}`;
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>),
    },
    cache: options.cache ?? "no-store",
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    throw new ApiError(
      json.error?.code || "API_ERROR",
      json.error?.message || `HTTP ${response.status} Error`,
      response.status,
      json.error?.details
    );
  }

  return json.data;
}
