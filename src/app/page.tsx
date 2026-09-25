import React, { Suspense } from "react";
import { headers } from "next/headers";
import { resolveTenant } from "@/lib/tenant/resolver";
import { getThemeDefinition } from "@/lib/themes/registry";
import { SAMPLE_FLEET } from "@/lib/mock-data";
import { Navbar } from "@/components/navigation/Navbar";
import { ThemePreviewBanner } from "@/components/themes/ThemePreviewBanner";
import { FAQSection } from "@/components/storefront/FAQSection";
import { getPublicFAQs } from "@/lib/api/dashboard";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TenantHomePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const headerList = await headers();
  const host = headerList.get("host") || "localhost:3000";

  const rawPreview = resolvedSearchParams.theme_preview;
  const previewThemeId = typeof rawPreview === "string" ? rawPreview : null;

  // Resolve tenant configuration & handle ephemeral live theme preview
  const { branding, isPreview } = await resolveTenant(host, previewThemeId);

  // Dynamically resolve the theme definition (luxury, modern, adventure, urban, classic, minimal)
  const theme = getThemeDefinition(branding.active_theme);
  const { HeroSection, FleetGrid, FeaturesSection, Footer } = theme.components;

  // Fetch live FAQ items (silently fallback if API unavailable)
  let faqs: import("@/lib/api/dashboard").FAQItem[] = [];
  try {
    faqs = await getPublicFAQs();
  } catch {
    // FAQs are optional — don't fail the page
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-black text-slate-100"
      style={
        {
          "--brand-primary": branding.primary_color,
          "--brand-accent": branding.accent_color,
        } as React.CSSProperties
      }
    >
      {/* Universal Navigation */}
      <Navbar branding={branding} />

      {/* Dynamic Theme Hero Section */}
      <HeroSection branding={branding} />

      {/* Dynamic Theme Features / Service Standards */}
      <div id="features">
        <FeaturesSection branding={branding} />
      </div>

      {/* Dynamic Theme Fleet Catalog */}
      <div id="fleet">
        <FleetGrid vehicles={SAMPLE_FLEET} branding={branding} />
      </div>

      {/* FAQ Section — live from CMS */}
      {faqs.length > 0 && (
        <div id="faq">
          <FAQSection faqs={faqs} primaryColor={branding.primary_color} />
        </div>
      )}

      {/* Dynamic Theme Footer */}
      <Footer branding={branding} />

      {/* Floating Theme Live Preview & Switcher Dock */}
      <Suspense fallback={null}>
        <ThemePreviewBanner
          currentThemeId={branding.active_theme}
          isPreview={isPreview}
        />
      </Suspense>
    </div>
  );
}
