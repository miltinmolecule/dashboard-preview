"use client";

import StatCard from "@/shared/cards/StatCard";
import { StatCardSkeleton } from "@/shared/loaders/LoadingSkeleton";
import { usePassengerActivity } from "../hooks/useAnalytics";
import type { AnalyticsFilters } from "../type/analytics";
import TrendChart from "./TrendChart";

interface Props { filters: AnalyticsFilters }

export default function PassengersTab({ filters }: Props): React.ReactNode {
  const { data, isLoading } = usePassengerActivity(filters);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Passengers"
              value={(data?.total_passengers ?? 0).toLocaleString()}
              iconBg="bg-blue-50"
              icon={<svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            />
            <StatCard
              title="Active"
              value={(data?.active_passengers ?? 0).toLocaleString()}
              description="Took a ride in period"
              iconBg="bg-emerald-50"
              icon={<svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M12 12a3 3 0 100-6 3 3 0 000 6z" /></svg>}
            />
            <StatCard
              title="New Passengers"
              value={(data?.new_passengers ?? 0).toLocaleString()}
              description="First ride in period"
              iconBg="bg-violet-50"
              icon={<svg className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
            />
            <StatCard
              title="Churn Rate"
              value={`${((data?.churn_rate ?? 0) * 100).toFixed(1)}%`}
              description="Inactive this period"
              iconBg="bg-red-50"
              icon={<svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
            />
          </>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Active vs New Passengers Over Time</h3>
        {!isLoading && data?.series && data.series.length > 0 ? (
          <TrendChart
            data={data.series}
            type="line"
            series={[
              { key: "active", name: "Active", color: "#3b82f6" },
              { key: "new",    name: "New",    color: "#8b5cf6" },
            ]}
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
