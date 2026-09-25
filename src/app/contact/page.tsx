"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  Car,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { LuxuryFooter } from "@/themes/luxury/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { TenantBranding } from "@/types";

const DEFAULT_BRANDING: TenantBranding = {
  name: "Apex Luxury Concierge",
  logo_url: "",
  primary_color: "#D4AF37",
  accent_color: "#F59E0B",
  font_heading: "serif",
  currency: "USD",
  timezone: "America/Los_Angeles",
  active_theme: "luxury",
  hero_title: "Prestige Automotive Hire",
  hero_subtitle: "Exclusive fleet access with private concierge delivery.",
  support_phone: "+1 (800) 555-APEX",
  support_email: "concierge@apex-fleet.com",
};

export default function ContactPage() {
  const branding = DEFAULT_BRANDING;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "rental", // "rental" | "consignment" | "corporate"
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSent(true);

    toast.success("Concierge Request Received", {
      description: "A private client executive has been assigned and will reply within 30 minutes.",
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-black text-slate-100 font-sans selection:bg-[#D4AF37]/30 selection:text-white"
      style={
        {
          "--brand-primary": branding.primary_color,
          "--brand-accent": branding.accent_color,
        } as React.CSSProperties
      }
    >
      <Navbar branding={branding} />

      {/* Header */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-mono uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>24/7 Executive Desk</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Connect with the Private Office
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light max-w-xl mx-auto leading-relaxed">
            Whether chartering an exotic supercar or inquiring about vehicle consignment and
            revenue sharing, our private client directors are at your disposal.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-white">Direct Communications</h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Our operations desk operates 24 hours a day, 365 days a year across aviation,
                depot logistics, and VIP client dispatch.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/[0.08] flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-zinc-500 font-mono uppercase block">Telephone Hotline</span>
                  <a
                    href={`tel:${branding.support_phone}`}
                    className="font-mono text-sm text-white font-semibold hover:text-[#D4AF37] transition-colors"
                  >
                    {branding.support_phone}
                  </a>
                  <span className="text-[11px] text-zinc-500 block mt-0.5">
                    Direct VIP booking & roadside assistance
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/[0.08] flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-zinc-500 font-mono uppercase block">Electronic Mail</span>
                  <a
                    href={`mailto:${branding.support_email}`}
                    className="font-mono text-sm text-white font-semibold hover:text-[#D4AF37] transition-colors"
                  >
                    {branding.support_email}
                  </a>
                  <span className="text-[11px] text-zinc-500 block mt-0.5">
                    Private client bookings & host acquisition
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/[0.08] flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-zinc-500 font-mono uppercase block">Primary Headquarters</span>
                  <span className="text-zinc-200 block">
                    9400 Wilshire Blvd, Beverly Hills, CA 90212
                  </span>
                  <span className="text-[11px] text-zinc-500 block mt-0.5">
                    Global Concierge Hub & Executive Staging
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-xs space-y-2">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                Are You a Car Owner Looking to Consign?
              </span>
              <p className="text-zinc-400 font-light leading-relaxed">
                You can apply directly to our Vehicle Host Program for an instant revenue forecast
                and $2M commercial coverage.
              </p>
              <Link
                href="/list-your-car"
                className="text-[#D4AF37] font-semibold hover:underline inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-mono pt-1"
              >
                Go to Vehicle Host Program →
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-2xl bg-zinc-950/80 border border-white/[0.1] shadow-2xl">
              {isSent ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">Message Dispatched</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Thank you, <strong className="text-white">{formData.name}</strong>. Your inquiry
                    has been routed directly to our on-duty client director. Expect a response shortly.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSent(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        inquiryType: "rental",
                        message: "",
                      });
                    }}
                    variant="outline"
                    className="border-white/[0.1] text-xs text-zinc-300"
                  >
                    Send Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-white mb-1">
                      Send a Direct Message
                    </h3>
                    <p className="text-xs text-zinc-400">
                      We respond to all VIP inquiries within 30 minutes.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-zinc-300">
                      Inquiry Category *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "rental", label: "Rent a Vehicle" },
                        { id: "consignment", label: "Consign / Host Car" },
                        { id: "corporate", label: "Corporate Charter" },
                      ].map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, inquiryType: type.id })}
                          className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                            formData.inquiryType === type.id
                              ? "bg-[#D4AF37] text-black border-[#D4AF37] font-semibold"
                              : "bg-black/40 text-zinc-400 border-white/[0.08] hover:text-white"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Full Name *
                      </label>
                      <Input
                        required
                        placeholder="Marcus Sterling"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-black/50 border-white/[0.08] text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Email Address *
                      </label>
                      <Input
                        required
                        type="email"
                        placeholder="marcus@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-black/50 border-white/[0.08] text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Phone Number
                    </label>
                    <Input
                      placeholder="+1 (555) 019-2831"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-black/50 border-white/[0.08] text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Detailed Message / Vehicle Requirements *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Specify your vehicle interests, requested charter dates, or consignment vehicle specifications..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-md bg-black/50 border border-white/[0.08] p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 bg-[#D4AF37] hover:bg-[#e2bd46] text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Transmitting Inquiry...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Transmit Concierge Inquiry
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <LuxuryFooter branding={branding} />
    </div>
  );
}
