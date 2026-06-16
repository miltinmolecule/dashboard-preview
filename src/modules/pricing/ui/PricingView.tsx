"use client";

import { useState } from "react";
import DashboardHeader from "@/shared/cards/DashboardHeader";
import { cn } from "@/utils/cn";
import MetricPricingView from "./MetricPricingView";
import ZonePricingView from "./ZonePricingView";
import SurgeView from "./SurgeView";
import FareSimulatorView from "./FareSimulatorView";
import PricingHistoryView from "./PricingHistoryView";

type TabKey = "metric" | "zone" | "surge" | "simulator" | "history";

const TABS: { key: TabKey; label: string }[] = [
  { key: "metric", label: "Metric Pricing" },
  { key: "zone", label: "Zone Pricing" },
  { key: "surge", label: "Surge Management" },
  { key: "simulator", label: "Fare Simulator" },
  { key: "history", label: "History" },
];

export default function PricingView(): React.ReactNode {
  const [tab, setTab] = useState<TabKey>("metric");

  return (
    <div className="space-y-5">
      <DashboardHeader
        title="Pricing"
        description="Configure metric and zone fare rules, manage surge, and simulate fares"
      />

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-md px-5 py-1.5 text-sm font-medium transition-all",
              tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "metric" && <MetricPricingView />}
      {tab === "zone" && <ZonePricingView />}
      {tab === "surge" && <SurgeView />}
      {tab === "simulator" && <FareSimulatorView />}
      {tab === "history" && <PricingHistoryView />}
    </div>
  );
}
