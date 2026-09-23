"use client";

import React from "react";
import { FooterProps } from "@/lib/themes/types";
import { Sparkles, Mail, Phone, MapPin } from "lucide-react";

export function LuxuryFooter({ branding }: FooterProps) {
  return (
    <footer className="bg-[#07080B] text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/[0.06]">
        {/* Brand identity */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-serif text-lg tracking-wider text-slate-100 uppercase">{branding.name}</span>
          </div>
          <p className="text-xs text-slate-500 font-light leading-relaxed">
            Exclusive automotive concierge platform providing unparalleled access to the world&apos;s finest vehicles.
          </p>
        </div>

        {/* Fleet Categories */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-medium">Collections</h4>
          <ul className="space-y-2 text-xs font-light text-slate-400">
            <li><a href="#fleet" className="hover:text-slate-100 transition-colors">Supercars & Exotics</a></li>
            <li><a href="#fleet" className="hover:text-slate-100 transition-colors">Chauffeured Sedans</a></li>
            <li><a href="#fleet" className="hover:text-slate-100 transition-colors">Executive SUVs</a></li>
            <li><a href="#fleet" className="hover:text-slate-100 transition-colors">High-Performance EVs</a></li>
          </ul>
        </div>

        {/* Concierge Services */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-medium">Concierge</h4>
          <ul className="space-y-2 text-xs font-light text-slate-400">
            <li><span className="hover:text-slate-100 cursor-pointer">Airport VIP Delivery</span></li>
            <li><span className="hover:text-slate-100 cursor-pointer">Private Security Chauffeur</span></li>
            <li><span className="hover:text-slate-100 cursor-pointer">Multi-Day Corporate Hire</span></li>
            <li><span className="hover:text-slate-100 cursor-pointer">Track Day Logistics</span></li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-medium">Private Office</h4>
          <div className="space-y-2 text-xs font-light text-slate-400">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <a href={`mailto:${branding.support_email}`} className="hover:text-slate-100 transition-colors">
                {branding.support_email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <a href={`tel:${branding.support_phone}`} className="hover:text-slate-100 transition-colors">
                {branding.support_phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Global Private Aviation & Downtown Hubs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 font-light gap-4">
        <div>© {new Date().getFullYear()} {branding.name}. All rights reserved.</div>
        <div className="flex gap-6">
          <span className="hover:text-slate-400 cursor-pointer">Privacy Charter</span>
          <span className="hover:text-slate-400 cursor-pointer">Rental Agreements</span>
          <span className="hover:text-slate-400 cursor-pointer">Insurance Transparency</span>
        </div>
      </div>
    </footer>
  );
}
