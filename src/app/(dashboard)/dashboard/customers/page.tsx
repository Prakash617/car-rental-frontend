"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Mail,
  Phone,
} from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/lib/auth/AuthContext";
import { getCustomers } from "@/lib/api/dashboard";
import { Customer } from "@/types";

export default function CustomersDirectoryPage() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadCustomers = useCallback(async () => {
    try {
      const data = await getCustomers(token || undefined);
      setCustomers(data);
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const filteredCustomers = customers.filter((c) => {
    const term = searchQuery.toLowerCase();
    return (
      c.first_name.toLowerCase().includes(term) ||
      c.last_name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.driver_license_number.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Customer Directory
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Verify driver credentials, contact profiles, and rental eligibility.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadCustomers}
          className="border-white/[0.08] text-zinc-300 hover:text-white"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="border-white/[0.08] bg-zinc-950/60 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search by customer name, email, or driver license (e.g. Bruce, DL-GOTHAM)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-black/40 border-white/[0.08] text-sm text-white"
          />
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="border-white/[0.08] bg-zinc-950/60 backdrop-blur-xl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-sm">
              No registered customers found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="text-zinc-400 text-xs">Customer</TableHead>
                  <TableHead className="text-zinc-400 text-xs">Contact Info</TableHead>
                  <TableHead className="text-zinc-400 text-xs">Driver License</TableHead>
                  <TableHead className="text-zinc-400 text-xs">License Expiry</TableHead>
                  <TableHead className="text-zinc-400 text-xs">Status</TableHead>
                  <TableHead className="text-zinc-400 text-xs text-right">Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((c) => (
                  <TableRow key={c.id} className="border-white/[0.06] hover:bg-white/[0.02]">
                    {/* Customer */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08] font-bold text-xs text-white">
                          {c.first_name[0]}{c.last_name[0]}
                        </div>
                        <div>
                          <span className="font-semibold text-white text-sm block">
                            {c.first_name} {c.last_name}
                          </span>
                          <span className="text-[11px] text-zinc-500 font-mono">
                            Country: {c.country}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <Mail className="h-3 w-3 text-zinc-500" />
                          <a href={`mailto:${c.email}`} className="hover:underline">
                            {c.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
                          <Phone className="h-3 w-3 text-zinc-500" />
                          <span>{c.phone}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Driver License */}
                    <TableCell>
                      <span className="inline-block px-2.5 py-1 rounded bg-black/60 border border-white/[0.12] font-mono text-xs font-semibold text-zinc-200">
                        {c.driver_license_number}
                      </span>
                    </TableCell>

                    {/* Expiry */}
                    <TableCell>
                      <span className="font-mono text-xs text-zinc-300">
                        {c.license_expiry_date}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge type="customer" status={c.is_verified ? "verified" : "pending"} />
                    </TableCell>

                    {/* Registration Date */}
                    <TableCell className="text-right font-mono text-xs text-zinc-400">
                      {new Date(c.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
