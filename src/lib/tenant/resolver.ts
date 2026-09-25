import { TenantBranding } from "@/types";
import { THEME_REGISTRY } from "@/lib/themes/registry";

export interface TenantResolution {
  isPlatform: boolean;
  subdomain: string | null;
  branding: TenantBranding;
  isPreview: boolean;
  previewThemeId?: string;
  hostname: string;
}

const DEFAULT_BRANDING: TenantBranding = {
  name: "Apex Luxury Concierge",
  logo_url: "/brand/logo.svg",
  primary_color: "#D4AF37",
  accent_color: "#B38F26",
  font_heading: "serif",
  support_email: "concierge@apex-fleet.com",
  support_phone: "+1 (800) 555-APEX",
  currency: "USD",
  timezone: "UTC",
  active_theme: "luxury",
  hero_title: "The Pinnacle of Automotive Luxury",
  hero_subtitle: "Experience peerless performance and white-glove concierge mobility.",
  seo_meta_title: "Apex Luxury Concierge | Exotic & Luxury Automobile Hire",
  seo_meta_description: "Curated exotic fleet, private tarmac delivery, and 24/7 dedicated concierge service.",
};

/**
 * Checks if a hostname belongs to the root SaaS Platform itself
 * (e.g. localhost:3000, 127.0.0.1:3000, platform.localhost)
 */
export function isPlatformRoot(hostname: string): boolean {
  const clean = hostname.split(":")[0].toLowerCase();
  return (
    clean === "localhost" ||
    clean === "127.0.0.1" ||
    clean === "platform.localhost" ||
    clean === "admin.localhost" ||
    clean === "platform.local"
  );
}

/**
 * Extracts tenant subdomain from request host
 * (e.g. "apex.localhost:3000" -> "apex")
 */
export function extractTenantSubdomain(hostname: string): string | null {
  const clean = hostname.split(":")[0].toLowerCase();
  if (clean.endsWith(".localhost")) {
    const sub = clean.slice(0, -".localhost".length);
    if (sub !== "platform" && sub !== "admin" && sub !== "www") {
      return sub;
    }
  }
  return null;
}

/**
 * Resolves the tenant context based on hostname and optional ephemeral live theme preview.
 */
export async function resolveTenant(
  hostnameHeader?: string | null,
  previewParam?: string | null
): Promise<TenantResolution> {
  const hostname = hostnameHeader || "localhost:3000";
  const isPlatform = isPlatformRoot(hostname);
  const subdomain = extractTenantSubdomain(hostname);

  // Check if live preview mode is triggered via ephemeral query param
  const validPreviewTheme =
    previewParam && previewParam in THEME_REGISTRY
      ? (previewParam as TenantBranding["active_theme"])
      : undefined;

  const isPreview = Boolean(validPreviewTheme);

  // Dynamic branding for the resolved tenant
  const branding: TenantBranding = {
    ...DEFAULT_BRANDING,
    ...(isPreview && validPreviewTheme ? { active_theme: validPreviewTheme } : {}),
  };

  // If a specific subdomain was targeted other than apex, customize display name
  if (subdomain && subdomain !== "apex") {
    const formatted = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
    branding.name = `${formatted} Luxury Mobility`;
  }

  // Dynamically match primary color to theme accent if in preview mode
  if (isPreview && validPreviewTheme && THEME_REGISTRY[validPreviewTheme]) {
    branding.primary_color = THEME_REGISTRY[validPreviewTheme].accentColor;
  }

  return {
    isPlatform,
    subdomain,
    branding,
    isPreview,
    previewThemeId: validPreviewTheme,
    hostname,
  };
}
