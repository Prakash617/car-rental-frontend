"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TenantBranding } from "@/types";
import { Phone, Menu, X, Car } from "lucide-react";

interface NavbarProps {
  branding: TenantBranding;
}

export function Navbar({ branding }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-black/60 border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand identity */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-105"
            style={{ backgroundColor: branding.primary_color }}
          >
            <Car className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-white tracking-wide block leading-none">
              {branding.name}
            </span>
            <span className="text-[10px] font-sans uppercase tracking-widest text-zinc-400 block mt-0.5">
              Automotive Concierge
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider font-medium text-zinc-300">
          <a href="#fleet" className="hover:text-white transition-colors">
            Fleet Catalog
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Standards & Services
          </a>
          <a href="#locations" className="hover:text-white transition-colors">
            Locations
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact
          </a>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href={`tel:${branding.support_phone}`}
            className="flex items-center gap-2 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-zinc-400" />
            <span>{branding.support_phone}</span>
          </a>

          <a
            href="#fleet"
            className="px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase text-black transition-all duration-200 hover:opacity-90 active:scale-95 shadow-sm"
            style={{ backgroundColor: branding.primary_color }}
          >
            Explore Fleet
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-zinc-950/95 border-b border-zinc-800 space-y-4">
          <div className="flex flex-col space-y-3 text-sm text-zinc-300 font-medium pt-2">
            <a
              href="#fleet"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Fleet Catalog
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Standards & Services
            </a>
            <a
              href={`tel:${branding.support_phone}`}
              className="py-1 text-zinc-400 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" /> {branding.support_phone}
            </a>
          </div>
          <a
            href="#fleet"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full py-3 text-center rounded-xl text-xs font-bold uppercase tracking-wider text-black"
            style={{ backgroundColor: branding.primary_color }}
          >
            Explore Fleet
          </a>
        </div>
      )}
    </header>
  );
}
