"use client";

import { useState } from "react";
import DashboardHeader from "@/shared/cards/DashboardHeader";
import { cn } from "@/utils/cn";
import type { ActiveTab } from "../type/ratings";
import { useRatings, useRatingAlerts, useRatingThresholds } from "../hooks/useRatings";
import RatingsTablePanel from "./RatingsTablePanel";
import AlertsPanel from "./AlertsPanel";
import ThresholdConfigForm from "./ThresholdConfigForm";

export default function RatingsAndReviewsView(): React.ReactNode {
  const [tab, setTab] = useState<ActiveTab>("drivers");

  const driverHook    = useRatings({ ratee_type: "driver" });
  const passengerHook = useRatings({ ratee_type: "passenger" });
  const alertsHook    = useRatingAlerts();
  const thresholdHook = useRatingThresholds();

  const tabs: Array<{ key: ActiveTab; label: string; badge?: number }> = [
    { key: "drivers",    label: "Driver Reviews" },
    { key: "passengers", label: "Passenger Reviews" },
    { key: "alerts",     label: "Alerts", badge: alertsHook.undismissed_count },
    { key: "settings",   label: "Settings" },
  ];

  return (
    <div className="space-y-5">
      <DashboardHeader
        title="Ratings & Reviews"
        description="Monitor and moderate driver and passenger ratings"
      />

      {/* Tab bar */}
      <div className="flex w-fit gap-1 rounded-lg bg-gray-100 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "relative rounded-md px-5 py-1.5 text-sm font-medium transition-all",
              tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700",
            )}
          >
            {t.label}
            {t.badge != null && t.badge > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "drivers" && (
        <RatingsTablePanel
          data={driverHook.ratings}
          loading={driverHook.isLoading}
          onFlag={(id, reason)   => driverHook.flag.mutate({ id, reason })}
          onRemove={(id)         => driverHook.remove.mutate(id)}
          onRestore={(id)        => driverHook.restore.mutate(id)}
          onRespond={(id, response) => driverHook.respond.mutate({ id, response })}
        />
      )}
      {tab === "passengers" && (
        <RatingsTablePanel
          data={passengerHook.ratings}
          loading={passengerHook.isLoading}
          onFlag={(id, reason)   => passengerHook.flag.mutate({ id, reason })}
          onRemove={(id)         => passengerHook.remove.mutate(id)}
          onRestore={(id)        => passengerHook.restore.mutate(id)}
          onRespond={(id, response) => passengerHook.respond.mutate({ id, response })}
        />
      )}
      {tab === "alerts" && (
        <AlertsPanel
          alerts={alertsHook.alerts}
          undismissed_count={alertsHook.undismissed_count}
          onDismiss={(id) => alertsHook.dismiss.mutate(id)}
        />
      )}
      {tab === "settings" && (
        <ThresholdConfigForm
          thresholds={thresholdHook.thresholds}
          isLoading={thresholdHook.isLoading}
          onSave={(id, body) => thresholdHook.update.mutate({ id, body })}
        />
      )}
    </div>
  );
}
