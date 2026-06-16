"use client";

import { useState } from "react";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import { cn } from "@/utils/cn";
import type { AnalyticsFilters, Granularity, VehicleType } from "../type/analytics";

const toISODate = (d: Date): string => d.toISOString().split("T")[0];
const daysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
};

type Preset = "today" | "7d" | "30d" | "90d" | "custom";

const PRESETS: { label: string; value: Preset }[] = [
  { label: "Today",   value: "today" },
  { label: "7 days",  value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
  { label: "Custom",  value: "custom" },
];

const GRANULARITY_OPTIONS: { label: string; value: Granularity }[] = [
  { label: "Daily",   value: "daily" },
  { label: "Weekly",  value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const VEHICLE_TYPE_OPTIONS: { label: string; value: VehicleType }[] = [
  { label: "Standard",  value: "standard" },
  { label: "Premium",   value: "premium" },
  { label: "Executive", value: "executive" },
];

const CITIES = [
  { label: "Lagos",   value: "reg_001" },
  { label: "Abuja",   value: "reg_002" },
  { label: "Accra",   value: "reg_003" },
  { label: "Nairobi", value: "reg_004" },
  { label: "Ibadan",  value: "reg_007" },
];

function presetToRange(preset: Preset): { from: string; to: string } | null {
  const today = toISODate(new Date());
  switch (preset) {
    case "today": return { from: today, to: today };
    case "7d":    return { from: daysAgo(6), to: today };
    case "30d":   return { from: daysAgo(29), to: today };
    case "90d":   return { from: daysAgo(89), to: today };
    default:      return null;
  }
}

interface Props {
  filters: AnalyticsFilters;
  onApply: (filters: AnalyticsFilters) => void;
}

export default function AnalyticsFilterBar({ filters, onApply }: Props): React.ReactNode {
  const [draft, setDraft] = useState<AnalyticsFilters>(filters);
  const [preset, setPreset] = useState<Preset>("30d");
  const [dateError, setDateError] = useState("");

  const applyPreset = (p: Preset): void => {
    setPreset(p);
    const range = presetToRange(p);
    if (!range) return;
    const next = { ...draft, ...range };
    setDraft(next);
    setDateError("");
    onApply(next);
  };

  const handleApply = (): void => {
    const from = new Date(draft.from);
    const to = new Date(draft.to);
    if (isNaN(from.getTime()) || isNaN(to.getTime()) || from > to) {
      setDateError("Start date must be before end date");
      return;
    }
    if ((to.getTime() - from.getTime()) / 86_400_000 > 365) {
      setDateError("Date range cannot exceed 365 days");
      return;
    }
    setDateError("");
    onApply(draft);
  };

  const inputClass = "h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all";

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm space-y-3">
      {/* Preset pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => applyPreset(p.value)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              preset === p.value
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Date inputs + additional filters */}
      <div className="flex items-end gap-3 flex-wrap">
        {/* Date range */}
        <div className="flex items-center gap-2">
          <div>
            <label className="mb-1 block text-xs text-gray-500">From</label>
            <input
              type="date"
              value={draft.from}
              onChange={(e) => { setDraft((p) => ({ ...p, from: e.target.value })); setPreset("custom"); }}
              className={inputClass}
            />
          </div>
          <span className="mt-5 text-xs text-gray-400">—</span>
          <div>
            <label className="mb-1 block text-xs text-gray-500">To</label>
            <input
              type="date"
              value={draft.to}
              onChange={(e) => { setDraft((p) => ({ ...p, to: e.target.value })); setPreset("custom"); }}
              className={inputClass}
            />
          </div>
        </div>

        {/* Granularity */}
        <div>
          <label className="mb-1 block text-xs text-gray-500">Granularity</label>
          <FilterDropdown
            options={GRANULARITY_OPTIONS}
            value={draft.granularity ?? "daily"}
            onChange={(v) => setDraft((p) => ({ ...p, granularity: v as Granularity || undefined }))}
            placeholder="Granularity"
          />
        </div>

        {/* Vehicle type */}
        <div>
          <label className="mb-1 block text-xs text-gray-500">Vehicle Type</label>
          <FilterDropdown
            options={VEHICLE_TYPE_OPTIONS}
            value={draft.vehicle_type ?? ""}
            onChange={(v) => setDraft((p) => ({ ...p, vehicle_type: (v as VehicleType) || undefined }))}
            placeholder="All Vehicles"
          />
        </div>

        {/* City */}
        <div>
          <label className="mb-1 block text-xs text-gray-500">City</label>
          <FilterDropdown
            options={CITIES}
            value={draft.city_id ?? ""}
            onChange={(v) => setDraft((p) => ({ ...p, city_id: v || undefined }))}
            placeholder="All Cities"
          />
        </div>

        {/* Apply button — visible only when preset is "custom" */}
        {preset === "custom" && (
          <button
            onClick={handleApply}
            className="h-9 rounded-lg bg-[var(--primary)] px-4 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Apply
          </button>
        )}

        {/* Clear optional filters */}
        {(draft.vehicle_type || draft.city_id) && (
          <button
            onClick={() => {
              const next = { ...draft, vehicle_type: undefined, city_id: undefined };
              setDraft(next);
              onApply(next);
            }}
            className="h-9 text-xs text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {dateError && <p className="text-xs text-red-500">{dateError}</p>}
    </div>
  );
}
