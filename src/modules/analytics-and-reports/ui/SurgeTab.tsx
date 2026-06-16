"use client";

import StatCard from "@/shared/cards/StatCard";
import { StatCardSkeleton } from "@/shared/loaders/LoadingSkeleton";
import { formatKobo } from "@/modules/pricing/lib/format";
import { useSurgeAnalytics } from "../hooks/useAnalytics";
import type { AnalyticsFilters } from "../type/analytics";
import TrendChart from "./TrendChart";

interface Props { filters: AnalyticsFilters }

export default function SurgeTab({ filters }: Props): React.ReactNode {
  const { data, isLoading } = useSurgeAnalytics(filters);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Surge Events"
              value={(data?.surge_events ?? 0).toLocaleString()}
              iconBg="bg-red-50"
              icon={<svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
            <StatCard
              title="Avg Multiplier"
              value={`${(data?.avg_multiplier ?? 1).toFixed(2)}×`}
              description="During surge events"
              iconBg="bg-orange-50"
              icon={<svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}
            />
            <StatCard
              title="Peak Multiplier"
              value={`${(data?.peak_multiplier ?? 1).toFixed(2)}×`}
              description="Highest recorded"
              iconBg="bg-amber-50"
              icon={<svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
            />
            <StatCard
              title="Surge Revenue"
              value={formatKobo(data?.surge_revenue ?? 0)}
              description="Extra from multipliers"
              iconBg="bg-emerald-50"
              icon={<svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Surge Events Over Time</h3>
          {!isLoading && data?.series && data.series.length > 0 ? (
            <TrendChart
              data={data.series}
              type="bar"
              series={[{ key: "events", name: "Events", color: "#ef4444" }]}
            />
          ) : !isLoading ? (
            <p className="py-8 text-center text-sm text-gray-400">No data for the selected range.</p>
          ) : (
            <div className="h-[220px] animate-pulse rounded-lg bg-gray-100" />
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Avg Multiplier Over Time</h3>
          {!isLoading && data?.series && data.series.length > 0 ? (
            <TrendChart
              data={data.series}
              type="line"
              series={[{ key: "avg_multiplier", name: "Avg Multiplier", color: "#f97316" }]}
              valueFormatter={(v) => `${v.toFixed(2)}×`}
            />
          ) : !isLoading ? (
            <p className="py-8 text-center text-sm text-gray-400">No data for the selected range.</p>
          ) : (
            <div className="h-[220px] animate-pulse rounded-lg bg-gray-100" />
          )}
        </div>
      </div>
    </div>
  );
}
