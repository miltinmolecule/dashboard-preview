"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import type { ActivityItem, ActivityType } from "./types";

type Filter = "all" | "trip" | "payment" | "profile";

const ICON_BG: Record<ActivityType, string> = {
  trip: "bg-[#1e3a4c] text-white",
  payment: "bg-red-100 text-red-600",
  wallet: "bg-emerald-100 text-emerald-700",
  profile: "bg-gray-100 text-gray-600",
};

function ActivityIcon({ type }: { type: ActivityType }): React.ReactNode {
  if (type === "trip") return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
  if (type === "payment" || type === "wallet") return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export default function ActivityContent({ activities }: { activities: ActivityItem[] }): React.ReactNode {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? activities : activities.filter((a) => {
    if (filter === "profile") return a.type === "profile";
    if (filter === "payment") return a.type === "payment" || a.type === "wallet";
    return a.type === "trip";
  });

  const grouped = filtered.reduce<Record<string, ActivityItem[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Activity Overview</h2>

      <div className="flex items-center gap-2 mb-6">
        {(["all", "trip", "payment", "profile"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-xs font-medium border transition-colors",
              filter === f ? "bg-gray-800 text-white border-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            {f === "all" ? "All activity" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-7">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold text-gray-500">{date}</span>
              <div className="h-1.5 w-1.5 rounded-full bg-gray-800 shrink-0" />
            </div>
            <div className="space-y-3 pl-4 border-l border-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className={cn("mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0", ICON_BG[item.type])}>
                    <ActivityIcon type={item.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <p className="text-center py-8 text-sm text-gray-400">No activity found.</p>
        )}
      </div>
    </div>
  );
}
