"use client";

import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  Gauge,
  CheckCircle2,
  Search,
} from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/lib/auth/AuthContext";
import { getVehicles } from "@/lib/api/vehicles";
import { updateVehicleStatus } from "@/lib/api/dashboard";
import { Vehicle, VehicleStatus } from "@/types";

export default function FleetManagementPage() {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadFleet() {
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error("Failed to load fleet:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadFleet();
  }, []);

  const handleStatusChange = async (vehicleId: string, newStatus: VehicleStatus) => {
    setUpdatingId(vehicleId);
    setFeedback(null);
    try {
      await updateVehicleStatus(vehicleId, newStatus, token || undefined);
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...v, status: newStatus } : v))
      );
      setFeedback(`Vehicle status updated to ${newStatus.toUpperCase()}`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unauthorized";
      alert(`Status update failed: ${msg}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.license_plate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || v.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Fleet Inventory
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Control vehicle availability, telemetry, and service scheduling across depot branches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {feedback && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-md animate-fade-in">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{feedback}</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={loadFleet}
            className="border-white/[0.08] text-zinc-300 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Fleet
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-white/[0.08] bg-zinc-950/60 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search by brand, model, or plate (e.g. Porsche, LUX-911)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-black/40 border-white/[0.08] text-sm text-white"
            />
          </div>

          <div>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-black/40 border-white/[0.08] text-sm text-white"
            >
              <option value="all">All Categories</option>
              <option value="luxury">Luxury Flagship</option>
              <option value="sports">Exotic Sports</option>
              <option value="suv">Premium SUV</option>
              <option value="electric">Electric / EV</option>
            </Select>
          </div>

          <div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/40 border-white/[0.08] text-sm text-white"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="rented">On Rental</option>
              <option value="maintenance">In Maintenance</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Fleet Table */}
      <Card className="border-white/[0.08] bg-zinc-950/60 backdrop-blur-xl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-sm">
              No vehicles matched your filter parameters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="text-zinc-400 text-xs w-[320px]">Vehicle</TableHead>
                  <TableHead className="text-zinc-400 text-xs">Registration</TableHead>
                  <TableHead className="text-zinc-400 text-xs">Specs & Odometer</TableHead>
                  <TableHead className="text-zinc-400 text-xs">Rate / Day</TableHead>
                  <TableHead className="text-zinc-400 text-xs">Current Status</TableHead>
                  <TableHead className="text-zinc-400 text-xs text-right">Quick Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => {
                  const primaryImg = vehicle.images?.[0]?.url || "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e";

                  return (
                    <TableRow key={vehicle.id} className="border-white/[0.06] hover:bg-white/[0.02]">
                      {/* Vehicle Column */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-18 flex-shrink-0 overflow-hidden rounded-md border border-white/[0.08] bg-zinc-900">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={primaryImg}
                              alt={`${vehicle.brand} ${vehicle.model}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-white text-sm block">
                              {vehicle.brand} {vehicle.model}
                            </span>
                            <span className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                              <span className="capitalize">{vehicle.category}</span>
                              <span>•</span>
                              <span>{vehicle.year}</span>
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* License Plate */}
                      <TableCell>
                        <span className="inline-block px-2.5 py-1 rounded bg-black/60 border border-white/[0.15] font-mono text-xs font-bold text-zinc-200 uppercase tracking-widest">
                          {vehicle.license_plate}
                        </span>
                      </TableCell>

                      {/* Specs */}
                      <TableCell>
                        <div className="text-xs text-zinc-300 font-mono space-y-0.5">
                          <div className="flex items-center gap-1 text-zinc-400">
                            <Gauge className="h-3 w-3" />
                            <span>{vehicle.mileage.toLocaleString()} mi</span>
                          </div>
                          <span className="text-[11px] text-zinc-500 capitalize">
                            {vehicle.transmission} • {vehicle.fuel_type}
                          </span>
                        </div>
                      </TableCell>

                      {/* Rate */}
                      <TableCell>
                        <span className="font-mono text-sm font-bold text-emerald-400">
                          ${vehicle.daily_rate}
                        </span>
                        <span className="text-[11px] text-zinc-500 block">
                          Deposit: ${vehicle.deposit_amount}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge type="vehicle" status={vehicle.status} />
                      </TableCell>

                      {/* Quick Status Control */}
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <select
                            disabled={updatingId === vehicle.id}
                            value={vehicle.status}
                            onChange={(e) =>
                              handleStatusChange(vehicle.id, e.target.value as VehicleStatus)
                            }
                            className="rounded-md border border-white/[0.12] bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                          >
                            <option value="available">Set Available</option>
                            <option value="maintenance">Set Maintenance</option>
                            <option value="reserved">Set Reserved</option>
                            <option value="rented">Set Rented</option>
                            <option value="inactive">Set Inactive</option>
                          </select>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
