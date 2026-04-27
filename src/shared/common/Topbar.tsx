"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/utils/cn";

const ROUTE_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "User Management",
  "/drivers": "Driver Management",
  "/ride-and-trips": "Rides & Trips",
  "/vehicles": "Vehicles",
  "/payments": "Payments",
  "/promotions": "Promotions",
  "/earnings": "Earnings",
  "/pricing": "Pricing",
  "/complaints-and-disputes": "Complaints & Disputes",
  "/ratings-and-reviews": "Ratings & Reviews",
  "/support": "Support",
  "/analytics-and-reports": "Analytics & Reports",
  "/notifications": "Notifications",
  "/admin-management": "Admin Management",
  "/zones-and-regions": "Zones & Regions",
  "/settings": "Settings",
  "/logs": "Audit Logs",
};

export default function Topbar(): React.ReactNode {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const base = "/" + pathname.split("/")[1];
  const pageTitle = ROUTE_LABELS[base] ?? "FleexyTrip Admin";

  const handleSignOut = async (): Promise<void> => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-100 bg-white px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">FleexyTrip</span>
        <svg className="h-3 w-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-sm font-semibold text-gray-800">{pageTitle}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications bell */}
        <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors relative">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? "A"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-gray-800 leading-none">{session?.user?.name ?? "Admin"}</p>
              <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{session?.user?.email ?? ""}</p>
            </div>
            <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
