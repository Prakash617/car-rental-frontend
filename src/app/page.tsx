import React, { Suspense } from "react";
import { headers } from "next/headers";
import { resolveTenant } from "@/lib/tenant/resolver";
import { getThemeDefinition } from "@/lib/themes/registry";
import { SAMPLE_FLEET } from "@/lib/mock-data";
import { Navbar } from "@/components/navigation/Navbar";
import { ThemePreviewBanner } from "@/components/themes/ThemePreviewBanner";
import { FAQSection } from "@/components/storefront/FAQSection";
import { PlatformLanding } from "@/components/platform/PlatformLanding";
import { getPublicFAQs } from "@/lib/api/dashboard";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const headerList = await headers();
  const host = headerList.get("host") || "localhost:3000";

  const rawPreview = resolvedSearchParams.theme_preview;
  const previewThemeId = typeof rawPreview === "string" ? rawPreview : null;

  // Resolve tenant configuration vs Platform Root
  const resolution = await resolveTenant(host, previewThemeId);

  // 1. If accessing the Root SaaS Platform Domain (localhost:3000 / platform.localhost)
  // render the Platform Marketing Portal & Super-Admin Launchpad
  if (resolution.isPlatform) {
    return <PlatformLanding />;
  }

  // 2. If accessing a Tenant Subdomain (e.g. apex.localhost:3000) or Custom Domain
  // render that specific tenant's branded customer storefront
  const { branding, isPreview } = resolution;

  // Dynamically resolve the theme definition (luxury, modern, adventure, urban, classic, minimal)
  const theme = getThemeDefinition(branding.active_theme);
  const { HeroSection, FleetGrid, FeaturesSection, Footer } = theme.components;

  // Fetch live FAQ items for this tenant
  let faqs: import("@/lib/api/dashboard").FAQItem[] = [];
  try {
    faqs = await getPublicFAQs(host);
  } catch {
    // FAQs are optional
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
