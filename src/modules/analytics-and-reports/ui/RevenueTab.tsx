"use client";

import StatCard from "@/shared/cards/StatCard";
import { StatCardSkeleton } from "@/shared/loaders/LoadingSkeleton";
import { formatKobo } from "@/modules/pricing/lib/format";
import { useRevenueStats } from "../hooks/useAnalytics";
import type { AnalyticsFilters } from "../type/analytics";
import TrendChart from "./TrendChart";

const fmtK = (v: number): string => {
  if (v >= 1_000_000_00) return `₦${(v / 1_000_000_00).toFixed(1)}M`;
  if (v >= 1_000_00) return `₦${(v / 1_000_00).toFixed(0)}K`;
  return formatKobo(v);
};

interface Props { filters: AnalyticsFilters }

export default function RevenueTab({ filters }: Props): React.ReactNode {
  const { data, isLoading } = useRevenueStats(filters);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Gross Revenue"
              value={formatKobo(data?.total_revenue ?? 0)}
              iconBg="bg-emerald-50"
              icon={<svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              title="Net Revenue"
              value={formatKobo(data?.net_revenue ?? 0)}
              description="After refunds"
              iconBg="bg-blue-50"
              icon={<svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
            />
            <StatCard
              title="Average Fare"
              value={formatKobo(data?.average_fare ?? 0)}
              description="Per completed ride"
              iconBg="bg-violet-50"
              icon={<svg className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}
            />
            <StatCard
              title="Total Refunds"
              value={formatKobo(data?.total_refunds ?? 0)}
              iconBg="bg-red-50"
              icon={<svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>}
            />
          </>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Revenue vs Refunds Over Time</h3>
        {!isLoading && data?.series && data.series.length > 0 ? (
          <TrendChart
            data={data.series}
            type="area"
            series={[
              { key: "revenue", name: "Revenue", color: "#3b82f6" },
              { key: "refunds", name: "Refunds", color: "#fca5a5" },
            ]}
            valueFormatter={fmtK}
          />
        ) : !isLoading ? (
          <p className="py-8 text-center text-sm text-gray-400">No data for the selected range.</p>
        ) : (
          <div className="h-[220px] animate-pulse rounded-lg bg-gray-100" />
        )}
      </div>
    </div>
  );
}
