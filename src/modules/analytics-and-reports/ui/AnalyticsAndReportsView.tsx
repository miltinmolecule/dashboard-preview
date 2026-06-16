"use client";

import { useState } from "react";
import DashboardHeader from "@/shared/cards/DashboardHeader";
import { cn } from "@/utils/cn";
import type { AnalyticsFilters, AnalyticsTab } from "../type/analytics";
import AnalyticsFilterBar from "./AnalyticsFilterBar";
import DriversTab from "./DriversTab";
import PassengersTab from "./PassengersTab";
import ReportsPanel from "./ReportsPanel";
import RevenueTab from "./RevenueTab";
import RidesTab from "./RidesTab";
import SurgeTab from "./SurgeTab";

const toISODate = (d: Date): string => d.toISOString().split("T")[0];

function defaultFilters(): AnalyticsFilters {
  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - 29);
  return { from: toISODate(from), to: toISODate(today), granularity: "daily" };
}

const TABS: { key: AnalyticsTab; label: string }[] = [
  { key: "rides",      label: "Rides" },
  { key: "revenue",    label: "Revenue" },
  { key: "drivers",    label: "Drivers" },
  { key: "passengers", label: "Passengers" },
  { key: "surge",      label: "Surge" },
  { key: "reports",    label: "Reports" },
];

export default function AnalyticsAndReportsView(): React.ReactNode {
  const [tab, setTab] = useState<AnalyticsTab>("rides");
  const [filters, setFilters] = useState<AnalyticsFilters>(defaultFilters);

  return (
    <div className="space-y-5">
      <DashboardHeader
        title="Analytics & Reports"
        description="Business insights across rides, revenue, drivers, passengers, and surge"
      />

      {/* Tab bar */}
      <div className="flex w-fit gap-1 rounded-lg bg-gray-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-all",
              tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filter bar — hidden on reports tab */}
      {tab !== "reports" && (
        <AnalyticsFilterBar filters={filters} onApply={setFilters} />
      )}

      {tab === "rides"      && <RidesTab      filters={filters} />}
      {tab === "revenue"    && <RevenueTab    filters={filters} />}
      {tab === "drivers"    && <DriversTab    filters={filters} />}
      {tab === "passengers" && <PassengersTab filters={filters} />}
      {tab === "surge"      && <SurgeTab      filters={filters} />}
      {tab === "reports"    && <ReportsPanel  filters={filters} />}
    </div>
  );
}
