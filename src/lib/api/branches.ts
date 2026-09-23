import { apiFetch } from "./client";

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
  address_line1?: string;
  phone: string;
  email: string;
  latitude?: string;
  longitude?: string;
  is_active: boolean;
}

export async function fetchBranches(tenantHost?: string): Promise<Branch[]> {
  return apiFetch<Branch[]>("/api/v1/branches/", {
    method: "GET",
    tenantHost,
    next: { revalidate: 3600 },
  });
}
