"use client";

import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import { TenantLoginGate } from "@/components/dashboard/TenantLoginGate";
import { Loader2 } from "lucide-react";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07080D] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        <span className="text-xs font-mono text-zinc-400">Verifying tenant staff session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <TenantLoginGate />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 antialiased font-sans selection:bg-primary/30">
      <Sidebar />
      <div className="flex flex-col md:pl-64">
        <Topbar />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
