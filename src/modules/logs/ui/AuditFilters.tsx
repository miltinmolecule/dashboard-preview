"use client";

import FilterDropdown from "@/shared/forms/FilterDropdown";
import { cn } from "@/utils/cn";
import {
  VALID_ACTIONS,
  VALID_ENTITY_TYPES,
  type AuditAction,
  type AuditEntityType,
  type AuditFilters,
} from "../type/audit-log";

function datePreset(days: number): { from: string; to: string } {
  const to   = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  const fmt = (d: Date): string => d.toISOString().slice(0, 10);
  return { from: fmt(from), to: fmt(to) };
}

const PRESETS = [
  { label: "Today",   days: 0  },
  { label: "7 days",  days: 7  },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
];

const ACTION_OPTIONS = [
  { label: "All Actions", value: "" },
  ...VALID_ACTIONS.map((a) => ({
    label: a.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
    value: a,
  })),
];

const ENTITY_OPTIONS = [
  { label: "All Entities", value: "" },
  ...VALID_ENTITY_TYPES.map((e) => ({
    label: e.charAt(0).toUpperCase() + e.slice(1),
    value: e,
  })),
];

interface Props {
  filters:   AuditFilters;
  onChange:  (f: AuditFilters) => void;
  showCity?: boolean;
}

export default function AuditFilters({
  filters,
  onChange,
  showCity = false,
}: Props): React.ReactNode {
  const set = (patch: Partial<AuditFilters>): void =>
    onChange({ ...filters, ...patch });

  const activePreset = PRESETS.find(({ days }) => {
    const p = datePreset(days);
    return filters.from === p.from && filters.to === p.to;
  })?.days;

  return (
    <div className="space-y-3">
      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map(({ label, days }) => (
          <button
            key={label}
            onClick={() => set(datePreset(days))}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              activePreset === days
                ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
            )}
          >
            {label}
          </button>
        ))}
        {(filters.from || filters.to) && (
          <button
            onClick={() => set({ from: undefined, to: undefined })}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear dates
          </button>
        )}
      </div>

      {/* Custom dates + dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.from ?? ""}
            max={filters.to ?? undefined}
            onChange={(e) => set({ from: e.target.value || undefined })}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            type="date"
            value={filters.to ?? ""}
            min={filters.from ?? undefined}
            onChange={(e) => set({ to: e.target.value || undefined })}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <FilterDropdown
          options={ACTION_OPTIONS}
          value={filters.action ?? ""}
          onChange={(v) => set({ action: (v as AuditAction) || undefined })}
          placeholder="All Actions"
          className="w-48"
        />

        <FilterDropdown
          options={ENTITY_OPTIONS}
          value={filters.entity_type ?? ""}
          onChange={(v) => set({ entity_type: (v as AuditEntityType) || undefined })}
          placeholder="All Entities"
        />

        {(filters.action || filters.entity_type || filters.from || filters.to) && (
          <button
            onClick={() =>
              onChange({ page: 1, limit: 20, is_archived: filters.is_archived })
            }
            className="text-xs text-blue-600 hover:underline"
          >
            Reset all
          </button>
        )}
      </div>
    </div>
  );
}
