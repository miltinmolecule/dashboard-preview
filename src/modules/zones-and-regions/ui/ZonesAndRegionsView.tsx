"use client";

import { useState } from "react";
import DashboardHeader from "@/shared/cards/DashboardHeader";
import { cn } from "@/utils/cn";
import RegionsView from "./RegionsView";
import ZonesView from "./ZonesView";

type ActiveTab = "regions" | "zones";

export default function ZonesAndRegionsView(): React.ReactNode {
  const [tab, setTab] = useState<ActiveTab>("regions");

  return (
    <div className="space-y-5">
      <DashboardHeader
        title="Zones & Regions"
        description="Configure service zones and geographic regions"
      />

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {(["regions", "zones"] as ActiveTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md px-5 py-1.5 text-sm font-medium capitalize transition-all",
              tab === t
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "regions" ? <RegionsView /> : <ZonesView />}
    </div>
  );
}
