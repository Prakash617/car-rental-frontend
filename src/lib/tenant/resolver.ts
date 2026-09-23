import { TenantBranding } from "@/types";
import { THEME_REGISTRY } from "@/lib/themes/registry";

export interface TenantResolution {
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
};

/**
 * Resolves the tenant branding and handles non-destructive ephemeral live theme preview.
 */
export async function resolveTenant(
  hostnameHeader?: string | null,
  previewParam?: string | null
): Promise<TenantResolution> {
  const hostname = hostnameHeader || "localhost:3000";

  // Check if live preview mode is triggered via ephemeral query param or header
  const validPreviewTheme =
    previewParam && previewParam in THEME_REGISTRY
      ? (previewParam as TenantBranding["active_theme"])
      : undefined;

  const isPreview = Boolean(validPreviewTheme);

  // In production, this can also query the backend tenant API or Redis cache.
  // For multi-tenant domain resolution:
  const branding: TenantBranding = {
    ...DEFAULT_BRANDING,
    ...(isPreview && validPreviewTheme ? { active_theme: validPreviewTheme } : {}),
  };

  // Dynamically match primary color to theme accent if in preview mode
  if (isPreview && validPreviewTheme && THEME_REGISTRY[validPreviewTheme]) {
    branding.primary_color = THEME_REGISTRY[validPreviewTheme].accentColor;
  }

  return {
    branding,
    isPreview,
    previewThemeId: validPreviewTheme,
    hostname,
  };
}
