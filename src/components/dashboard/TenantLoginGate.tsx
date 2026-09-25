"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, KeyRound, Loader2, AlertTriangle, UserCheck, ShieldCheck, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/AuthContext";

export function TenantLoginGate() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoStaff = () => {
    setEmail("concierge@apex-fleet.com");
    setPassword("concierge123");
  };

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* Top Header */}
      <header className="w-full border-b border-white/[0.08] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-black font-bold text-xs shadow-md shadow-amber-500/20">
            <Car className="w-4 h-4 text-black" />
          </div>
          <div>
            <span className="font-serif font-bold text-white text-sm tracking-wide">
              APEX CONCIERGE OS
            </span>
            <span className="text-[10px] text-zinc-500 block font-mono">
              PostgreSQL Schema-Isolated Tenant
            </span>
          </div>
        </div>

        <Link href="/">
          <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white">
            ← Return to Storefront
          </Button>
        </Link>
      </header>

      {/* Login Box */}
      <div className="max-w-md w-full mx-auto px-4 py-12">
        <div className="rounded-2xl border border-white/[0.1] bg-zinc-950/80 p-8 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-serif text-white tracking-tight">
              Tenant Staff Authentication
            </h1>
            <p className="text-xs text-zinc-400">
              Sign in to manage fleet inventory, reservations, and customer telemetry.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Staff Email Address
              </label>
              <Input
                required
                type="email"
                placeholder="concierge@apex-fleet.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/50 border-white/[0.1] text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <Input
                required
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/50 border-white/[0.1] text-white text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D4AF37] hover:bg-[#e2bd46] text-black font-semibold text-xs py-2.5 shadow-lg shadow-amber-500/20"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Verifying Credentials...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5" />
                  Sign In to Concierge OS
                </span>
              )}
            </Button>
          </form>

          {/* Quick Demo Helper */}
          <div className="pt-4 border-t border-white/[0.08] text-center space-y-2">
            <p className="text-[11px] text-zinc-500">Demo Staff Credentials:</p>
            <button
              type="button"
              onClick={fillDemoStaff}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D4AF37] hover:underline px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Fill: concierge@apex-fleet.com / concierge123
            </button>
          </div>
        </div>
      </div>

      <footer className="text-center py-6 text-[11px] text-zinc-600 font-mono flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Schema-Level Security &middot; Apex Luxury Concierge</span>
      </footer>
    </div>
  );
}
