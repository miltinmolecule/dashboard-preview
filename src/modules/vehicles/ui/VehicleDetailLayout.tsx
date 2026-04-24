"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import StatusBadge from "@/shared/common/StatusBadge";
import DashboardHeader from "@/shared/cards/DashboardHeader";
import type { Vehicle } from "../services/vehicles.service";

const NAV_ITEMS = (id: string) => [
  { label: "Overview", href: `/vehicles/${id}/overview`, iconKey: "overview" },
  { label: "Documents", href: `/vehicles/${id}/documents`, iconKey: "documents" },
  { label: "Driver History", href: `/vehicles/${id}/driver-history`, iconKey: "history" },
  { label: "Logs", href: `/vehicles/${id}/logs`, iconKey: "logs" },
];

const ICONS: Record<string, React.ReactNode> = {
  overview: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h2" />
    </svg>
  ),
  documents: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  history: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  logs: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
};

interface Props {
  id: string;
  vehicle: Vehicle | undefined;
  children: React.ReactNode;
}

export default function VehicleDetailLayout({
  id,
  vehicle,
  children,
}: Props): React.ReactNode {
  const pathname = usePathname();
  const [status, setStatus] = useState(vehicle?.status ?? "pending");
  const navItems = NAV_ITEMS(id);
  const currentTab = navItems.find((n) => pathname.startsWith(n.href));

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-gray-400">Vehicle not found.</p>
        <Link href="/vehicles" className="mt-3 text-sm text-blue-600 hover:underline">
          ← Back to Vehicles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DashboardHeader
        title="Vehicle Details"
        breadcrumbs={
          <nav className="flex items-center gap-1.5 text-gray-400">
            <Link href="/vehicles" className="text-sm hover:text-gray-600 transition-colors">
              Vehicles
            </Link>
            <span>/</span>
            <span className="text-sm text-gray-600">
              {vehicle.make} {vehicle.model}
            </span>
            {currentTab && (
              <>
                <span>/</span>
                <span className="text-sm text-gray-600">{currentTab.label}</span>
              </>
            )}
          </nav>
        }
      />

      <div className="flex gap-5 items-start">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <div className="rounded-xl border border-gray-100 bg-white p-5 space-y-3">
            {/* Vehicle identity */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {vehicle.make} {vehicle.model}
                </p>
                <p className="text-xs text-gray-400">{vehicle.year} · {vehicle.color}</p>
              </div>
            </div>
            <p className="font-mono text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg px-3 py-1.5">
              {vehicle.plateNumber}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <StatusBadge status={status} />
              <StatusBadge
                status={vehicle.verificationStatus}
                label={`Docs: ${vehicle.verificationStatus}`}
              />
            </div>
            {/* Action buttons */}
            <div className="pt-1 space-y-2">
              {status === "pending" && (
                <button
                  onClick={() => setStatus("active")}
                  className="w-full rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                >
                  Approve Vehicle
                </button>
              )}
              {status === "active" && (
                <button
                  onClick={() => setStatus("suspended")}
                  className="w-full rounded-lg bg-red-100 py-2 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
                >
                  Suspend Vehicle
                </button>
              )}
              {status === "suspended" && (
                <button
                  onClick={() => setStatus("active")}
                  className="w-full rounded-lg bg-[var(--primary)] py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Reactivate Vehicle
                </button>
              )}
            </div>
          </div>

          {/* Nav */}
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all",
                    isActive
                      ? "text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                  )}
                  style={
                    isActive
                      ? { background: "linear-gradient(135deg, #1e3a4c 0%, #2d5876 100%)" }
                      : {}
                  }
                >
                  <span className={cn("shrink-0", isActive ? "text-white" : "text-gray-400")}>
                    {ICONS[item.iconKey]}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}