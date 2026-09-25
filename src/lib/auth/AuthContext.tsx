"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthSession, AuthUser } from "@/types";
import { loginUser } from "@/lib/api/dashboard";

interface AuthContextType {
  user: AuthUser | null;
  role: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  loginAsDemoStaff: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "apex_saas_auth_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore stored session on mount if previously logged in
  useEffect(() => {
    async function initAuth() {
      try {
        const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
        if (stored) {
          const parsed: AuthSession = JSON.parse(stored);
          setSession(parsed);
        } else {
          setSession(null);
        }
      } catch (err) {
        console.error("Failed to restore auth session:", err);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const newSession = await loginUser(email, pass);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      setSession(newSession);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAsDemoStaff = useCallback(async () => {
    return login("concierge@apex-fleet.com", "concierge123");
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        role: session?.role || null,
        token: session?.access_token || null,
        isAuthenticated: !!session?.access_token,
        isLoading,
        login,
        logout,
        loginAsDemoStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
