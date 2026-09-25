"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Car,
  Search,
  SlidersHorizontal,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  X,
  Gauge,
  Fuel,
  Sparkles,
  ArrowRight,
  User,
  Phone,
  Mail,
  CreditCard,
  Building2,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { LuxuryFooter } from "@/themes/luxury/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { SAMPLE_FLEET } from "@/lib/mock-data";
import { getVehicles } from "@/lib/api/vehicles";
import { fetchBranches, Branch } from "@/lib/api/branches";
import { Vehicle, VehicleCategory, TenantBranding } from "@/types";

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

export default function PublicFleetPage() {
  const branding = DEFAULT_BRANDING;
  const [vehicles, setVehicles] = useState<Vehicle[]>(SAMPLE_FLEET);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Booking Modal State
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<{
    reference: string;
    vehicleName: string;
    totalAmount: string;
    pickupDate: string;
    returnDate: string;
  } | null>(null);

  // Booking Form Fields
  const [pickupDate, setPickupDate] = useState("2026-10-01");
  const [returnDate, setReturnDate] = useState("2026-10-04");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [withChauffeur, setWithChauffeur] = useState(false);
  const [withLossDamageWaiver, setWithLossDamageWaiver] = useState(true);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestLicense, setGuestLicense] = useState("");

  // Load fleet from backend or fallback to SAMPLE_FLEET
  useEffect(() => {
    async function load() {
      try {
        const [apiVehicles, apiBranches] = await Promise.all([
          getVehicles().catch(() => []),
          fetchBranches().catch(() => []),
        ]);
        if (apiVehicles && apiVehicles.length > 0) {
          setVehicles(apiVehicles);
        } else {
          setVehicles(SAMPLE_FLEET);
        }
        if (apiBranches && apiBranches.length > 0) {
          setBranches(apiBranches);
          setSelectedBranch(apiBranches[0].id);
        }
      } catch {
        setVehicles(SAMPLE_FLEET);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Filtered & Sorted Fleet
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        const matchesSearch =
          v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory =
          selectedCategory === "all" || v.category.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") {
          return parseFloat(a.daily_rate) - parseFloat(b.daily_rate);
        }
        if (sortBy === "price_desc") {
          return parseFloat(b.daily_rate) - parseFloat(a.daily_rate);
        }
        if (sortBy === "year") {
          return b.year - a.year;
        }
        return 0;
      });
  }, [vehicles, searchQuery, selectedCategory, sortBy]);

  // Quote Calculation
  const rentalDays = useMemo(() => {
    const start = new Date(pickupDate).getTime();
    const end = new Date(returnDate).getTime();
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [pickupDate, returnDate]);

  const bookingQuote = useMemo(() => {
    if (!selectedVehicle) return null;
    const baseDaily = parseFloat(selectedVehicle.daily_rate) || 850;
    const baseTotal = baseDaily * rentalDays;
    const chauffeurTotal = withChauffeur ? 250 * rentalDays : 0;
    const ldwTotal = withLossDamageWaiver ? 45 * rentalDays : 0;
    const subtotal = baseTotal + chauffeurTotal + ldwTotal;
    const luxuryTax = subtotal * 0.095;
    const deposit = parseFloat(selectedVehicle.deposit_amount || "2000");
    const totalDue = subtotal + luxuryTax;

    return {
      baseDaily,
      baseTotal,
      chauffeurTotal,
      ldwTotal,
      subtotal,
      luxuryTax,
      deposit,
      totalDue,
    };
  }, [selectedVehicle, rentalDays, withChauffeur, withLossDamageWaiver]);

  const handleOpenBooking = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setBookingConfirmed(null);
    setIsBookingOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) {
      toast.error("Please complete all required guest contact fields.");
      return;
    }
    if (!selectedVehicle) return;

    setIsSubmittingBooking(true);
    // Simulate booking reservation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const reference = `APX-RES-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingConfirmed({
      reference,
      vehicleName: `${selectedVehicle.brand} ${selectedVehicle.model}`,
      totalAmount: bookingQuote ? bookingQuote.totalDue.toFixed(2) : "0.00",
      pickupDate,
      returnDate,
    });
    setIsSubmittingBooking(false);

    toast.success("Reservation Confirmed!", {
      description: `Booking #${reference} confirmed. Our private concierge will coordinate your vehicle delivery.`,
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

      {/* Showroom Header */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-7xl mx-auto space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-mono uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premier Fleet Catalog</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
                Curated Luxury & Exotic Fleet
              </h1>
              <p className="mt-1 text-sm text-zinc-400 max-w-2xl font-light">
                Exotic supercars, bespoke SUVs, and chauffeured grand tourers ready for immediate
                private aviation delivery or downtown concierge pickup.
              </p>
            </div>

            {/* Consign CTA for Vehicle Owners */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/list-your-car"
                className="px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-2"
              >
                <span>Own a Luxury Car? Consign & Earn 70%</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </Link>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search by brand, model, or spec (e.g. Porsche, GT3, V8)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-950/80 border-white/[0.1] text-xs text-white h-11 rounded-xl"
              />
            </div>

            {/* Category Tabs */}
            <div className="sm:col-span-5">
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-zinc-950/80 border-white/[0.1] text-xs text-white h-11 rounded-xl"
              >
                <option value="all">All Vehicle Classes ({vehicles.length})</option>
                <option value="sports">Exotic Sports & Supercars</option>
                <option value="luxury">Luxury Flagship Sedans</option>
                <option value="suv">Executive Premium SUVs</option>
                <option value="electric">Electric / Performance EV</option>
              </Select>
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-2">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-zinc-950/80 border-white/[0.1] text-xs text-white h-11 rounded-xl"
              >
                <option value="recommended">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year">Newest Model Year</option>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Catalog Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        {filteredVehicles.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <Car className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-base font-semibold text-white">No Vehicles Match Criteria</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try adjusting your search query or switching categories.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-2 text-xs border-white/[0.1] text-zinc-300"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => {
              const photo =
                vehicle.images && vehicle.images.length > 0
                  ? vehicle.images[0].url
                  : "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80";

              return (
                <div
                  key={vehicle.id}
                  className="group rounded-2xl bg-zinc-950/60 border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:shadow-amber-500/10"
                >
                  <div>
                    {/* Vehicle Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                      <Image
                        src={photo}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-white border border-white/[0.1]">
                          {vehicle.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 backdrop-blur-md text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                          {vehicle.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Bottom Image Overlay Plate */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="text-[11px] font-mono text-zinc-300 bg-black/60 px-2 py-0.5 rounded border border-white/[0.08]">
                          {vehicle.year}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400 capitalize">
                          {vehicle.transmission}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-lg font-bold font-serif text-white group-hover:text-[#D4AF37] transition-colors">
                          {vehicle.brand} {vehicle.model}
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-light leading-relaxed">
                          {vehicle.description ||
                            "Handcrafted precision engineering with bespoke executive interior appointments."}
                        </p>
                      </div>

                      {/* Specs Icons */}
                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/[0.04] text-[11px] font-mono text-zinc-400">
                        <div className="flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{vehicle.mileage.toLocaleString()} mi</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Fuel className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="capitalize">{vehicle.fuel_type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Car className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{vehicle.seats} Seats</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom / Pricing & CTA */}
                  <div className="p-5 pt-0 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-zinc-500 block uppercase font-mono">
                        Base Charter
                      </span>
                      <div className="text-lg font-bold font-mono text-white">
                        ${vehicle.daily_rate}
                        <span className="text-xs text-zinc-500 font-normal"> /day</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleOpenBooking(vehicle)}
                      className="bg-[#D4AF37] hover:bg-[#e2bd46] text-black font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/10"
                    >
                      Reserve Asset
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Interactive Booking Reservation Modal */}
      {isBookingOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-white/[0.12] p-6 space-y-6 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif">
                    Reserve {selectedVehicle.brand} {selectedVehicle.model}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Daily Base Rate: ${selectedVehicle.daily_rate}/day · Year: {selectedVehicle.year}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsBookingOpen(false)}
                className="text-zinc-500 hover:text-white p-1 text-sm rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-bold font-serif text-white">
                    VIP Reservation Confirmed
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Your charter reservation has been staged. A dedicated executive concierge will
                    contact you to finalize delivery logistics and white-glove arrival.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black border border-white/[0.08] text-left font-mono text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Booking Reference:</span>
                    <span className="text-[#D4AF37] font-bold">{bookingConfirmed.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Vehicle:</span>
                    <span className="text-white font-bold">{bookingConfirmed.vehicleName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Rental Period:</span>
                    <span className="text-zinc-300">
                      {bookingConfirmed.pickupDate} to {bookingConfirmed.returnDate}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/[0.06]">
                    <span className="text-zinc-400">Total Charged:</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      ${bookingConfirmed.totalAmount}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsBookingOpen(false)}
                  className="bg-[#D4AF37] hover:bg-[#e2bd46] text-black font-semibold text-xs min-w-[140px]"
                >
                  Return to Fleet
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                {/* Dates & Pickup Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Pickup Date *
                    </label>
                    <Input
                      type="date"
                      required
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="bg-black/50 border-white/[0.08] text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Return Date *
                    </label>
                    <Input
                      type="date"
                      required
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="bg-black/50 border-white/[0.08] text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Depot Hub *
                    </label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full h-9 rounded-md bg-black/50 border border-white/[0.08] text-xs text-white px-2.5"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                      {branches.length === 0 && (
                        <option value="">Downtown Concierge Hub</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Add-ons Checklist */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3">
                  <span className="text-xs font-mono uppercase text-zinc-400 block">
                    Concierge Options & Protection
                  </span>

                  <label className="flex items-center justify-between text-xs cursor-pointer p-2 rounded-lg hover:bg-white/[0.02]">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={withLossDamageWaiver}
                        onChange={(e) => setWithLossDamageWaiver(e.target.checked)}
                        className="rounded border-white/20 bg-black text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <div>
                        <span className="text-white font-medium block">
                          Loss Damage Waiver (Zero Deductible)
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          Comprehensive zero-liability coverage for tire, rim, and glass incidents
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[#D4AF37] font-semibold">+$45/day</span>
                  </label>

                  <label className="flex items-center justify-between text-xs cursor-pointer p-2 rounded-lg hover:bg-white/[0.02]">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={withChauffeur}
                        onChange={(e) => setWithChauffeur(e.target.checked)}
                        className="rounded border-white/20 bg-black text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <div>
                        <span className="text-white font-medium block">
                          Private Executive Chauffeur
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          Discreet armed or suit-and-tie chauffeur certified in evasive security
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[#D4AF37] font-semibold">+$250/day</span>
                  </label>
                </div>

                {/* Guest Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Full Legal Name *
                    </label>
                    <Input
                      required
                      placeholder="Jonathan Vance"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
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
                      placeholder="jonathan@company.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="bg-black/50 border-white/[0.08] text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Phone Number *
                    </label>
                    <Input
                      required
                      placeholder="+1 (212) 555-0144"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="bg-black/50 border-white/[0.08] text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Driver License Number *
                    </label>
                    <Input
                      required
                      placeholder="DL-88291039"
                      value={guestLicense}
                      onChange={(e) => setGuestLicense(e.target.value)}
                      className="bg-black/50 border-white/[0.08] text-white text-xs font-mono uppercase"
                    />
                  </div>
                </div>

                {/* Price Summary Breakdown */}
                {bookingQuote && (
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-xs font-mono space-y-2">
                    <div className="flex justify-between text-zinc-400">
                      <span>
                        Vehicle Base (${bookingQuote.baseDaily} × {rentalDays} days):
                      </span>
                      <span className="text-white">${bookingQuote.baseTotal.toFixed(2)}</span>
                    </div>
                    {withChauffeur && (
                      <div className="flex justify-between text-zinc-400">
                        <span>Chauffeur Service:</span>
                        <span className="text-white">${bookingQuote.chauffeurTotal.toFixed(2)}</span>
                      </div>
                    )}
                    {withLossDamageWaiver && (
                      <div className="flex justify-between text-zinc-400">
                        <span>Loss Damage Waiver:</span>
                        <span className="text-white">${bookingQuote.ldwTotal.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-400">
                      <span>Luxury Surcharge & Taxes (9.5%):</span>
                      <span className="text-white">${bookingQuote.luxuryTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#D4AF37] pt-2 border-t border-white/[0.06]">
                      <span>Total Charter Quote:</span>
                      <span>${bookingQuote.totalDue.toFixed(2)}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 pt-1">
                      * Refundable security deposit of ${bookingQuote.deposit.toFixed(2)} placed as an
                      authorization hold upon vehicle departure.
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsBookingOpen(false)}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="bg-[#D4AF37] hover:bg-[#e2bd46] text-black font-semibold text-xs tracking-wider uppercase min-w-[160px]"
                  >
                    {isSubmittingBooking ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Securing Reservation...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" />
                        Confirm & Reserve
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <LuxuryFooter branding={branding} />
    </div>
  );
}
