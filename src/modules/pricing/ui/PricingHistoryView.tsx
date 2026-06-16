"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "@/shared/common/DataTable";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import { cn } from "@/utils/cn";
import { MOCK_HISTORY } from "../data/mock";
import { formatKobo } from "../lib/format";
import type { PricingHistoryEntry } from "../type/pricing";

// ─── Filter options ─────────────────────────────────────────────────────────

const ENTITY_FILTERS = [
  { label: "Metric", value: "metric" },
  { label: "Zone", value: "zone" },
  { label: "Surge", value: "surge" },
];

const ACTION_FILTERS = [
  { label: "Create", value: "CREATE" },
  { label: "Update", value: "UPDATE" },
  { label: "Delete", value: "DELETE" },
  { label: "Surge Toggle", value: "SURGE_TOGGLE" },
];

const ACTION_BADGE: Record<PricingHistoryEntry["action"], string> = {
  CREATE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  UPDATE: "bg-blue-50 text-blue-700 border-blue-200",
  DELETE: "bg-red-50 text-red-700 border-red-200",
  SURGE_TOGGLE: "bg-orange-50 text-orange-700 border-orange-200",
};

const KOBO_FIELDS = new Set(["base_fare", "per_km", "per_minute", "min_fare", "cancellation_fee", "flat_fare"]);

const formatDiffValue = (field: string, value: unknown): string => {
  if (typeof value === "number" && KOBO_FIELDS.has(field)) return formatKobo(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
};

const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString("en-NG", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function PricingHistoryView(): React.ReactNode {
  // swap with real query: usePricingHistory({ page, limit, entity_type })
  const [data] = useState<PricingHistoryEntry[]>(MOCK_HISTORY);
  const [entityFilter, setEntityFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const loading = false;

  const filtered = useMemo(() => {
    return data.filter((h) => {
      const matchEntity = !entityFilter || h.entity_type === entityFilter;
      const matchAction = !actionFilter || h.action === actionFilter;
      return matchEntity && matchAction;
    });
  }, [data, entityFilter, actionFilter]);

  const stats = useMemo(
    () => ({
      total: data.length,
      creates: data.filter((h) => h.action === "CREATE").length,
      updates: data.filter((h) => h.action === "UPDATE").length,
      other: data.filter((h) => h.action === "DELETE" || h.action === "SURGE_TOGGLE").length,
    }),
    [data],
  );

  const columns: ColumnDef<PricingHistoryEntry, unknown>[] = [
    {
      id: "action",
      header: "Action",
      accessorKey: "action",
      cell: ({ getValue }) => {
        const action = getValue() as PricingHistoryEntry["action"];
        return (
          <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide", ACTION_BADGE[action])}>
            {action.replace("_", " ")}
          </span>
        );
      },
    },
    {
      id: "entity",
      header: "Entity",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium capitalize text-gray-900">{row.original.entity_type}</p>
          <p className="text-xs text-gray-400">{row.original.entity_id}</p>
        </div>
      ),
    },
    {
      id: "diff",
      header: "Change",
      cell: ({ row }) => {
        const diff = row.original.diff;
        const keys = Object.keys(diff);
        if (keys.length === 0) {
          return <span className="text-xs text-gray-400">—</span>;
        }
        return (
          <div className="space-y-0.5">
            {keys.map((field) => {
              const { before, after } = diff[field];
              return (
                <p key={field} className="text-xs text-gray-600">
                  <span className="font-medium text-gray-700">{field}</span>:{" "}
                  <span className="text-gray-400">{formatDiffValue(field, before)}</span>{" "}
                  <span className="text-gray-400">→</span> {formatDiffValue(field, after)}
                </p>
              );
            })}
          </div>
        );
      },
    },
    {
      id: "changed_by",
      header: "Changed By",
      cell: ({ row }) => <span className="text-sm text-gray-700">{row.original.changed_by.name}</span>,
    },
    {
      id: "created_at",
      header: "Date",
      accessorKey: "created_at",
      cell: ({ getValue }) => <span className="text-xs text-gray-500">{formatDateTime(getValue() as string)}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Entries", value: stats.total, color: "text-gray-900", bg: "bg-gray-50" },
          { label: "Creates", value: stats.creates, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Updates", value: stats.updates, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Deletes / Toggles", value: stats.other, color: "text-orange-700", bg: "bg-orange-50" },
        ].map((s) => (
          <div key={s.label} className={cn("rounded-xl border border-gray-100 px-4 py-3 shadow-sm", s.bg)}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={cn("mt-1 text-xl font-bold", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterDropdown options={ENTITY_FILTERS} value={entityFilter} onChange={setEntityFilter} placeholder="Entity Type" />
        <FilterDropdown options={ACTION_FILTERS} value={actionFilter} onChange={setActionFilter} placeholder="Action" />
        {(entityFilter || actionFilter) && (
          <button
            onClick={() => {
              setEntityFilter("");
              setActionFilter("");
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">{filtered.length} results</span>
      </div>

      {/* Table */}
      <DataTable<PricingHistoryEntry> data={filtered} columns={columns} loading={loading} pageSize={10} />
    </div>
  );
}
