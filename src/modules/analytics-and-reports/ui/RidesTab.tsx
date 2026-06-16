"use client";

import StatCard from "@/shared/cards/StatCard";
import { StatCardSkeleton } from "@/shared/loaders/LoadingSkeleton";
import { cn } from "@/utils/cn";
import { useRideStats } from "../hooks/useAnalytics";
import type { AnalyticsFilters } from "../type/analytics";
import TrendChart from "./TrendChart";

interface Props { filters: AnalyticsFilters }

export default function RidesTab({ filters }: Props): React.ReactNode {
  const { data, isLoading } = useRideStats(filters);

  const completionRate = data
    ? data.total > 0 ? ((data.completed / data.total) * 100).toFixed(1) : "0.0"
    : null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Rides"
              value={(data?.total ?? 0).toLocaleString()}
              iconBg="bg-blue-50"
              icon={<svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
            <StatCard
              title="Completed"
              value={(data?.completed ?? 0).toLocaleString()}
              description={completionRate ? `${completionRate}% completion rate` : undefined}
              iconBg="bg-emerald-50"
              icon={<svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              title="Cancelled"
              value={(data?.cancelled ?? 0).toLocaleString()}
              iconBg="bg-red-50"
              icon={<svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
            />
            <StatCard
              title="In Progress"
              value={(data?.in_progress ?? 0).toLocaleString()}
              trendValue="Live"
              trend="neutral"
              description="right now"
              iconBg="bg-amber-50"
              icon={<svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </>
        )}
      </div>

      <div className={cn("rounded-xl border border-gray-100 bg-white p-5 shadow-sm", isLoading && "animate-pulse")}>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Ride Activity Over Time</h3>
        {!isLoading && data?.series && data.series.length > 0 ? (
          <TrendChart
            data={data.series}
            type="bar"
            series={[
              { key: "completed", name: "Completed", color: "#3b82f6" },
              { key: "cancelled", name: "Cancelled", color: "#fca5a5" },
            ]}
          />
        ) : !isLoading ? (
          <p className="py-8 text-center text-sm text-gray-400">No data for the selected range.</p>
        ) : (
          <div className="h-[220px] rounded-lg bg-gray-100" />
        )}
      </div>
    </div>
  );
}
