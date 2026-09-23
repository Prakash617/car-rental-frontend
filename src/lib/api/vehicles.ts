import { apiFetch } from "./client";
import { Vehicle, VehicleCategory, VehicleStatus } from "@/types";

export interface VehicleFilterParams {
  category?: VehicleCategory;
  transmission?: string;
  fuel_type?: string;
  status?: VehicleStatus;
  branch?: string;
  search?: string;
}

export async function fetchVehicles(
  filters?: VehicleFilterParams,
  tenantHost?: string
): Promise<Vehicle[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
  }

  const query = params.toString();
  const endpoint = query ? `/api/v1/vehicles/?${query}` : "/api/v1/vehicles/";

  return apiFetch<Vehicle[]>(endpoint, {
    method: "GET",
    tenantHost,
    cache: "no-store", // Fleet availability is real-time
  });
}

export async function fetchVehicle(id: string, tenantHost?: string): Promise<Vehicle> {
  return apiFetch<Vehicle>(`/api/v1/vehicles/${id}/`, {
    method: "GET",
    tenantHost,
    cache: "no-store",
  });
}

export { fetchVehicles as getVehicles, fetchVehicle as getVehicle };

