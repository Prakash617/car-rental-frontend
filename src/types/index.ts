export type VehicleStatus = "available" | "reserved" | "rented" | "maintenance" | "inactive";
export type VehicleCategory = "economy" | "compact" | "sedan" | "suv" | "luxury" | "sports" | "van" | "electric";
export type TransmissionType = "automatic" | "manual";
export type FuelType = "petrol" | "diesel" | "hybrid" | "electric";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  category: VehicleCategory;
  transmission: TransmissionType;
  fuel_type: FuelType;
  seats: number;
  doors: number;
  mileage: number;
  color: string;
  status: VehicleStatus;
  daily_rate: string;
  weekly_rate?: string | null;
  monthly_rate?: string | null;
  deposit_amount: string;
  features: string[];
  images: { url: string; is_primary?: boolean }[];
  description?: string;
  branch_id: string;
}

export type BookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled" | "rejected";
export type PaymentStatus = "unpaid" | "partially_paid" | "paid" | "refunded";

export interface Booking {
  id: string;
  booking_reference: string;
  vehicle_id: string;
  customer_id: string;
  pickup_branch_id: string;
  return_branch_id: string;
  pickup_datetime: string;
  return_datetime: string;
  status: BookingStatus;
  base_price: string;
  discount_amount: string;
  tax_amount: string;
  deposit_amount: string;
  total_price: string;
  payment_status: PaymentStatus;
  notes?: string;
  created_at: string;
}

export interface TenantBranding {
  name: string;
  logo_url?: string;
  primary_color: string;
  accent_color: string;
  font_heading: string;
  support_email: string;
  support_phone: string;
  currency: string;
  timezone: string;
  active_theme: "luxury" | "modern" | "classic" | "adventure" | "urban" | "minimal";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
  };
  pagination?: {
    count: number;
    limit: number;
    offset: number;
    next: string | null;
    previous: string | null;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
