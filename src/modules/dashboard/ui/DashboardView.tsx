"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import StatCard from "@/shared/cards/StatCard";
import { StatCardSkeleton } from "@/shared/loaders/LoadingSkeleton";
import { cn } from "@/utils/cn";
import type { TimeFilter } from "@/config/types/generic";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_STATS = {
  totalUsers: 48_291,
  totalDrivers: 5_834,
  activeRides: 342,
  completedRides: 182_017,
  cancelledRides: 9_204,
  totalRevenue: 48_620_500,
  pendingKyc: 87,
  onlineDrivers: 1_204,
  activeIncidents: 12,
  userGrowth: 8.4,
  driverGrowth: 3.2,
  revenueGrowth: 12.7,
  ridesGrowth: 6.1,
};

const TRIPS_DATA = [
  { date: "Mon", completed: 1200, cancelled: 95 },
  { date: "Tue", completed: 1850, cancelled: 120 },
  { date: "Wed", completed: 2100, cancelled: 88 },
  { date: "Thu", completed: 1760, cancelled: 102 },
  { date: "Fri", completed: 2400, cancelled: 145 },
  { date: "Sat", completed: 2900, cancelled: 160 },
  { date: "Sun", completed: 2200, cancelled: 130 },
];

const REVENUE_DATA = [
  { date: "Mon", revenue: 1_450_000 },
  { date: "Tue", revenue: 2_310_000 },
  { date: "Wed", revenue: 2_780_000 },
  { date: "Thu", revenue: 2_100_000 },
  { date: "Fri", revenue: 3_200_000 },
  { date: "Sat", revenue: 3_900_000 },
  { date: "Sun", revenue: 3_050_000 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatRevenue = (v: number): string => {
  if (v >= 1_000_000) return `₦${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `₦${(v / 1_000).toFixed(0)}K`;
  return `₦${v}`;
};

const formatNumber = (v: number): string => v.toLocaleString();

// ─── Time filter tabs ─────────────────────────────────────────────────────────

const TIME_FILTERS: { label: string; value: TimeFilter }[] = [
  { label: "Today", value: "today" },
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardView(): React.ReactNode {
  const router = useRouter();
  const [filter, setFilter] = useState<TimeFilter>("7d");
  const loading = false; // swap with real query: useDashboardStats(filter).isLoading

  const stats = MOCK_STATS;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Welcome back. Here is what is happening across the platform.
          </p>
        </div>

        {/* Time filter */}
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
          {TIME_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                filter === f.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={formatNumber(stats.totalUsers)}
              trend="up"
              trendValue={`${stats.userGrowth}%`}
              description="vs last period"
              iconBg="bg-blue-50"
              onClick={() => router.push("/users")}
              icon={
                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <StatCard
              title="Total Drivers"
              value={formatNumber(stats.totalDrivers)}
              trend="up"
              trendValue={`${stats.driverGrowth}%`}
              description="vs last period"
              iconBg="bg-violet-50"
              onClick={() => router.push("/drivers")}
              icon={
                <svg className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            <StatCard
              title="Active Rides"
              value={formatNumber(stats.activeRides)}
              trend="neutral"
              trendValue="Live"
              description="right now"
              iconBg="bg-emerald-50"
              onClick={() => router.push("/ride-and-trips")}
              icon={
                <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
            <StatCard
              title="Total Revenue"
              value={formatRevenue(stats.totalRevenue)}
              trend="up"
              trendValue={`${stats.revenueGrowth}%`}
              description="vs last period"
              iconBg="bg-amber-50"
              onClick={() => router.push("/payments")}
              icon={
                <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Completed Rides"
              value={formatNumber(stats.completedRides)}
              trend="up"
              trendValue={`${stats.ridesGrowth}%`}
              description="vs last period"
              iconBg="bg-teal-50"
              icon={
                <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Online Drivers"
              value={formatNumber(stats.onlineDrivers)}
              trend="neutral"
              trendValue="Live"
              description="currently active"
              iconBg="bg-green-50"
              icon={
                <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M12 12a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              }
            />
            <StatCard
              title="Pending KYC"
              value={formatNumber(stats.pendingKyc)}
              trend={stats.pendingKyc > 50 ? "down" : "neutral"}
              trendValue="Pending"
              description="awaiting review"
              iconBg="bg-orange-50"
              onClick={() => router.push("/drivers")}
              icon={
                <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <StatCard
              title="Active Incidents"
              value={formatNumber(stats.activeIncidents)}
              trend={stats.activeIncidents > 10 ? "down" : "neutral"}
              trendValue={stats.activeIncidents > 10 ? "High" : "Normal"}
              description="open support cases"
              iconBg="bg-red-50"
              onClick={() => router.push("/complaints-and-disputes")}
              icon={
                <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Trips chart */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Trip Activity</h2>
              <p className="text-xs text-gray-400 mt-0.5">Completed vs cancelled rides</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TRIPS_DATA} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
                cursor={{ fill: "#f9fafb" }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="completed" name="Completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" name="Cancelled" fill="#fca5a5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue chart */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Revenue Trend</h2>
              <p className="text-xs text-gray-400 mt-0.5">Platform revenue over time</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v: number) => formatRevenue(v)}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(v) => [formatRevenue(Number(v)), "Revenue"]}
                contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Review KYC", href: "/drivers", color: "text-orange-600 bg-orange-50 hover:bg-orange-100" },
            { label: "View Disputes", href: "/complaints-and-disputes", color: "text-red-600 bg-red-50 hover:bg-red-100" },
            { label: "Send Broadcast", href: "/notifications", color: "text-blue-600 bg-blue-50 hover:bg-blue-100" },
            { label: "View Reports", href: "/analytics-and-reports", color: "text-violet-600 bg-violet-50 hover:bg-violet-100" },
          ].map((action) => (
            <button
              key={action.href}
              onClick={() => router.push(action.href)}
              className={cn(
                "rounded-lg px-4 py-3 text-xs font-semibold transition-colors",
                action.color
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
