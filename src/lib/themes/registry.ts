export interface ThemeMeta {
  id: string;
  name: string;
  description: string;
  category: "luxury" | "modern" | "classic" | "adventure" | "urban" | "minimal";
  previewImage: string;
  accentColor: string;
}

export const THEME_REGISTRY: Record<string, ThemeMeta> = {
  luxury: {
    id: "luxury",
    name: "Luxury Concierge",
    description: "Cinematic, editorial styling with champagne gold accents, rich dark palettes, and refined typography.",
    category: "luxury",
    previewImage: "/themes/previews/luxury.jpg",
    accentColor: "#D4AF37",
  },
  modern: {
    id: "modern",
    name: "Modern Mobility",
    description: "High-contrast Scandinavian design with crisp geometric layouts, rapid filters, and vibrant cobalt touches.",
    category: "modern",
    previewImage: "/themes/previews/modern.jpg",
    accentColor: "#2563EB",
  },
  classic: {
    id: "classic",
    name: "Heritage Classic",
    description: "Timeless traditional car hire elegance with warm leather tones and balanced proportions.",
    category: "classic",
    previewImage: "/themes/previews/classic.jpg",
    accentColor: "#8B5A2B",
  },
  adventure: {
    id: "adventure",
    name: "All-Terrain Adventure",
    description: "Rugged outdoorsy aesthetic optimized for 4x4s, expedition vehicles, and camper conversions.",
    category: "adventure",
    previewImage: "/themes/previews/adventure.jpg",
    accentColor: "#2D5A27",
  },
  urban: {
    id: "urban",
    name: "Urban Pulse",
    description: "Dynamic city mobility theme tailored for electric fleets, micro-rentals, and daily commuters.",
    category: "urban",
    previewImage: "/themes/previews/urban.jpg",
    accentColor: "#06B6D4",
  },
  minimal: {
    id: "minimal",
    name: "Pure Minimal",
    description: "Ultra-lean, content-first layout with clean whitespace, typography focus, and maximum speed.",
    category: "minimal",
    previewImage: "/themes/previews/minimal.jpg",
    accentColor: "#18181B",
  },
};

export function getThemeMeta(themeId: string): ThemeMeta {
  return THEME_REGISTRY[themeId] || THEME_REGISTRY.luxury;
}
