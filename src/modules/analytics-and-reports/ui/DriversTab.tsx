"use client";

import StatCard from "@/shared/cards/StatCard";
import { StatCardSkeleton } from "@/shared/loaders/LoadingSkeleton";
import { cn } from "@/utils/cn";
import { useDriverPerformance } from "../hooks/useAnalytics";
import type { AnalyticsFilters } from "../type/analytics";

interface Props { filters: AnalyticsFilters }

export default function DriversTab({ filters }: Props): React.ReactNode {
  const { data, isLoading } = useDriverPerformance(filters);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Drivers"
              value={(data?.total_drivers ?? 0).toLocaleString()}
              iconBg="bg-violet-50"
              icon={<svg className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            />
            <StatCard
              title="Active Drivers"
              value={(data?.active_drivers ?? 0).toLocaleString()}
              trendValue="Live"
              trend="neutral"
              description="in period"
              iconBg="bg-emerald-50"
              icon={<svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M12 12a3 3 0 100-6 3 3 0 000 6z" /></svg>}
            />
            <StatCard
              title="Avg Rating"
              value={(data?.avg_rating ?? 0).toFixed(2)}
              description="Platform average"
              iconBg="bg-amber-50"
              icon={<svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
            />
            <StatCard
              title="Avg Acceptance"
              value={`${((data?.avg_acceptance ?? 0) * 100).toFixed(1)}%`}
              description="Ride acceptance rate"
              iconBg="bg-blue-50"
              icon={<svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </>
        )}
      </div>

      {/* Top drivers table — name only, no PII */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Top Drivers by Rides Completed</h3>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : !data?.top_drivers?.length ? (
          <p className="py-6 text-center text-sm text-gray-400">No data for the selected range.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-2 text-left text-xs font-medium text-gray-400">#</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-400">Driver</th>
                  <th className="pb-2 text-right text-xs font-medium text-gray-400">Rides</th>
                  <th className="pb-2 text-right text-xs font-medium text-gray-400">Rating</th>
                </tr>
              </thead>
              <tbody>
                {data.top_drivers.map((d, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5 text-xs text-gray-400">{i + 1}</td>
                    <td className="py-2.5 font-medium text-gray-900">{d.name}</td>
                    <td className="py-2.5 text-right text-gray-700">{d.rides.toLocaleString()}</td>
                    <td className="py-2.5 text-right">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                        d.rating >= 4.5 ? "bg-emerald-50 text-emerald-700" :
                        d.rating >= 4   ? "bg-blue-50 text-blue-700" :
                        d.rating >= 3   ? "bg-amber-50 text-amber-700" :
                                          "bg-red-50 text-red-700",
                      )}>
                        ★ {d.rating.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
