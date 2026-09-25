import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { resolveTenant } from "@/lib/tenant/resolver";
import { getCustomPageBySlug } from "@/lib/api/dashboard";
import { TenantBranding } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchPage(slug: string): Promise<import("@/lib/api/dashboard").CustomPage | null> {
  try {
    return await getCustomPageBySlug(slug);
  } catch {
    return null;
  }
}

/** Render simple Markdown-like content as HTML */
function renderMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="underline">$1</a>')
    // Unordered list items
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Horizontal rule
    .replace(/^---$/gm, "<hr />")
    // Paragraphs (double newlines)
    .replace(/\n\n/g, "</p><p>")
    // Single newlines within paragraphs
    .replace(/\n/g, "<br />");
}

export default async function CustomPageRoute({ params }: PageProps) {
  const { slug } = await params;
  const headerList = await headers();
  const host = headerList.get("host") || "localhost:3000";

  const [page, { branding }] = await Promise.all([
    fetchPage(slug),
    resolveTenant(host, null),
  ]);

  if (!page) {
    notFound();
  }

  const seoTitle = page.seo_title || page.title;
  const seoDesc = page.seo_description;

  const renderedHtml = renderMarkdown(page.content);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-slate-100">
      <Navbar branding={branding as TenantBranding} />

      {/* SEO-friendly head metadata is best added via generateMetadata in a real app */}

      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Page breadcrumb */}
          <nav className="mb-8 text-xs text-zinc-500 font-mono">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Home
            </Link>
            <span className="mx-2 text-zinc-700">/</span>
            <span className="text-zinc-400">{page.title}</span>
          </nav>

          {/* Page content */}
          <article
            className="prose prose-invert prose-sm sm:prose-base max-w-none"
            style={
              {
                "--tw-prose-headings": "#ffffff",
                "--tw-prose-body": "#a1a1aa",
                "--tw-prose-bold": "#ffffff",
                "--tw-prose-links": branding.primary_color || "#D4AF37",
                "--tw-prose-hr": "rgba(255,255,255,0.06)",
                "--tw-prose-bullets": branding.primary_color || "#D4AF37",
              } as React.CSSProperties
            }
          >
            <h1 className="text-3xl font-bold tracking-tight text-white mb-8">{seoTitle}</h1>
            <div
              className="text-zinc-400 leading-relaxed space-y-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-200 [&_h3]:mt-4 [&_strong]:text-white [&_li]:ml-4 [&_li]:list-disc [&_a]:text-primary [&_a]:no-underline [&_a:hover]:underline [&_hr]:border-white/[0.08] [&_hr]:my-8"
              dangerouslySetInnerHTML={{ __html: `<p>${renderedHtml}</p>` }}
            />
          </article>

          {/* Metadata footer */}
          <div className="mt-16 pt-8 border-t border-white/[0.06] text-xs text-zinc-600">
            <p>
              {seoDesc && <span className="block mb-2 text-zinc-500 italic">{seoDesc}</span>}
              <span className="font-mono">
                {branding.name || "Apex Luxury Concierge"} · {new Date().getFullYear()}
              </span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4 text-center">
        <p className="text-xs text-zinc-600 font-mono">
          © {new Date().getFullYear()} {branding.name || "Apex Luxury Concierge"}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await fetchPage(slug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: page.seo_title || page.title,
    description: page.seo_description || "",
  };
}
