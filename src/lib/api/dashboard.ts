import { apiFetch } from "./client";
import { AuthSession, Customer, DashboardOverview, TenantBranding, Vehicle, VehicleStatus } from "@/types";

export interface UpdateThemePayload {
  active_theme?: string;
  primary_color?: string;
  accent_color?: string;
  font_heading?: string;
  support_email?: string;
  support_phone?: string;
  hero_title?: string;
  hero_subtitle?: string;
  seo_meta_title?: string;
  seo_meta_description?: string;
}

/**
  * Authenticate staff or admin user for tenant management operations
  */
export async function loginUser(email: string, password: string, tenantHost?: string): Promise<AuthSession> {
  return apiFetch<AuthSession>("/auth/login/", {
    method: "POST",
    tenantHost,
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Fetch executive dashboard KPIs and fleet utilization metrics
 */
export async function getDashboardOverview(token?: string, tenantHost?: string): Promise<DashboardOverview> {
  return apiFetch<DashboardOverview>("/dashboard/overview/", {
    token,
    tenantHost,
    cache: "no-store",
  });
}

/**
 * Update vehicle operational status (e.g. available, maintenance, inactive)
 */
export async function updateVehicleStatus(
  vehicleId: string,
  status: VehicleStatus,
  token?: string,
  tenantHost?: string
): Promise<Vehicle> {
  return apiFetch<Vehicle>(`/vehicles/${vehicleId}/set_status/`, {
    method: "POST",
    token,
    tenantHost,
    body: JSON.stringify({ status }),
  });
}

/**
 * Fetch verified customer directory
 */
export async function getCustomers(token?: string, tenantHost?: string): Promise<Customer[]> {
  return apiFetch<Customer[]>("/customers/", {
    token,
    tenantHost,
    cache: "no-store",
  });
}

/**
 * Fetch current website and theme configuration for editing
 */
export async function getManageableWebsiteConfig(token?: string, tenantHost?: string): Promise<TenantBranding> {
  return apiFetch<TenantBranding>("/dashboard/theme/", {
    token,
    tenantHost,
    cache: "no-store",
  });
}

/**
 * Save updated theme, branding, or copywriting changes
 */
export async function updateTenantThemeConfig(
  payload: UpdateThemePayload,
  token?: string,
  tenantHost?: string
): Promise<TenantBranding> {
  return apiFetch<TenantBranding>("/dashboard/theme/", {
    method: "PATCH",
    token,
    tenantHost,
    body: JSON.stringify(payload),
  });
}
