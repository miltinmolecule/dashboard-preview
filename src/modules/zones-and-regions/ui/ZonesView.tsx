"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "@/shared/common/DataTable";
import StatusBadge from "@/shared/common/StatusBadge";
import SearchInput from "@/shared/forms/SearchInput";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import { Skeleton } from "@/shared/loaders/LoadingSkeleton";
import { cn } from "@/utils/cn";
import type { Zone, ZoneStatus } from "../services/zone.service";
import type { Region } from "../services/region.service";

// ─── Inline region data (shared mock) ────────────────────────────────────────

const REGIONS: Region[] = [
  { id: "reg_001", name: "Lagos", country: "Nigeria", status: "active", createdAt: "2024-01-10" },
  { id: "reg_002", name: "Abuja", country: "Nigeria", status: "active", createdAt: "2024-01-12" },
  { id: "reg_003", name: "Accra", country: "Ghana", status: "active", createdAt: "2024-02-01" },
  { id: "reg_004", name: "Nairobi", country: "Kenya", status: "active", createdAt: "2024-03-05" },
  { id: "reg_007", name: "Ibadan", country: "Nigeria", status: "active", createdAt: "2024-04-15" },
  { id: "reg_008", name: "Mombasa", country: "Kenya", status: "active", createdAt: "2024-05-01" },
];

// ─── Mock zones ───────────────────────────────────────────────────────────────

const MOCK_ZONES: Zone[] = [
  { id: "zon_001", name: "Victoria Island", regionId: "reg_001", status: "active", surgeMultiplier: 1.5 },
  { id: "zon_002", name: "Lekki Phase 1", regionId: "reg_001", status: "active", surgeMultiplier: 1.2 },
  { id: "zon_003", name: "Surulere", regionId: "reg_001", status: "active" },
  { id: "zon_004", name: "Ikeja", regionId: "reg_001", status: "inactive" },
  { id: "zon_005", name: "Maitama", regionId: "reg_002", status: "active", surgeMultiplier: 1.3 },
  { id: "zon_006", name: "Wuse II", regionId: "reg_002", status: "active" },
  { id: "zon_007", name: "Gwarinpa", regionId: "reg_002", status: "inactive" },
  { id: "zon_008", name: "Airport Ridge", regionId: "reg_003", status: "active", surgeMultiplier: 1.4 },
  { id: "zon_009", name: "Osu", regionId: "reg_003", status: "active" },
  { id: "zon_010", name: "Westlands", regionId: "reg_004", status: "active", surgeMultiplier: 1.6 },
  { id: "zon_011", name: "Karen", regionId: "reg_004", status: "active" },
  { id: "zon_012", name: "CBD Ibadan", regionId: "reg_007", status: "inactive" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genId(): string {
  return `zon_${Date.now().toString(36)}`;
}

function regionName(regionId: string): string {
  return REGIONS.find((r) => r.id === regionId)?.name ?? regionId;
}

// ─── Zone Form Modal ──────────────────────────────────────────────────────────

interface ZoneFormState {
  name: string;
  regionId: string;
  status: ZoneStatus;
  surgeMultiplier: string;
}

const EMPTY_FORM: ZoneFormState = { name: "", regionId: "", status: "active", surgeMultiplier: "" };

function ZoneFormModal({
  zone,
  onClose,
  onSave,
}: {
  zone: Zone | null;
  onClose: () => void;
  onSave: (data: ZoneFormState, id?: string) => void;
}): React.ReactNode {
  const isEdit = zone !== null;
  const [form, setForm] = useState<ZoneFormState>(
    isEdit
      ? {
          name: zone.name,
          regionId: zone.regionId,
          status: zone.status,
          surgeMultiplier: zone.surgeMultiplier?.toString() ?? "",
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof ZoneFormState, string>>>({});

  const set = <K extends keyof ZoneFormState>(key: K, value: ZoneFormState[K]): void =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const errs: Partial<Record<keyof ZoneFormState, string>> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.regionId) errs.regionId = "Region is required";
    if (form.surgeMultiplier && isNaN(Number(form.surgeMultiplier))) {
      errs.surgeMultiplier = "Must be a valid number";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form, zone?.id);
  };

  return (
    <ModalWrapper open onClose={onClose} title={isEdit ? "Edit Zone" : "Create Zone"} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Zone Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Victoria Island"
            className={cn(
              "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-900 outline-none",
              "placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
              errors.name ? "border-red-400" : "border-gray-200",
            )}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Region */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Region</label>
          <select
            value={form.regionId}
            onChange={(e) => set("regionId", e.target.value)}
            className={cn(
              "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-900 outline-none",
              "focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
              errors.regionId ? "border-red-400" : "border-gray-200",
            )}
          >
            <option value="">Select region...</option>
            {REGIONS.filter((r) => r.status === "active").map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.country})
              </option>
            ))}
          </select>
          {errors.regionId && <p className="mt-1 text-xs text-red-500">{errors.regionId}</p>}
        </div>

        {/* Surge multiplier */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            Surge Multiplier <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="5"
            value={form.surgeMultiplier}
            onChange={(e) => set("surgeMultiplier", e.target.value)}
            placeholder="e.g. 1.5"
            className={cn(
              "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-900 outline-none",
              "placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
              errors.surgeMultiplier ? "border-red-400" : "border-gray-200",
            )}
          />
          {errors.surgeMultiplier && (
            <p className="mt-1 text-xs text-red-500">{errors.surgeMultiplier}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Status</label>
          <div className="flex gap-3">
            {(["active", "inactive"] as ZoneStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set("status", s)}
                className={cn(
                  "flex-1 rounded-lg border py-2 text-xs font-medium capitalize transition-all",
                  form.status === s
                    ? s === "active"
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border-gray-300 bg-gray-100 text-gray-700"
                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-[var(--primary)] py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            {isEdit ? "Save Changes" : "Create Zone"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

const STATUS_FILTERS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function ZonesView(): React.ReactNode {
  const [data, setData] = useState<Zone[]>(MOCK_ZONES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Zone | null>(null);
  const loading = false;

  const regionOptions = useMemo(
    () => REGIONS.map((r) => ({ label: `${r.name} (${r.country})`, value: r.id })),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((z) => {
      const matchSearch = !q || z.name.toLowerCase().includes(q);
      const matchStatus = !statusFilter || z.status === statusFilter;
      const matchRegion = !regionFilter || z.regionId === regionFilter;
      return matchSearch && matchStatus && matchRegion;
    });
  }, [data, search, statusFilter, regionFilter]);

  const stats = useMemo(
    () => ({
      total: data.length,
      active: data.filter((z) => z.status === "active").length,
      inactive: data.filter((z) => z.status === "inactive").length,
      withSurge: data.filter((z) => z.surgeMultiplier !== undefined).length,
    }),
    [data],
  );

  const openEdit = (zone: Zone): void => {
    setEditTarget(zone);
    setModal("edit");
  };

  const handleToggleStatus = (id: string): void => {
    setData((prev) =>
      prev.map((z) =>
        z.id === id ? { ...z, status: z.status === "active" ? "inactive" : "active" } : z,
      ),
    );
  };

  const handleSave = (
    form: ZoneFormState,
    id?: string,
  ): void => {
    const surge = form.surgeMultiplier ? Number(form.surgeMultiplier) : undefined;
    if (id) {
      setData((prev) =>
        prev.map((z) =>
          z.id === id
            ? { ...z, name: form.name, regionId: form.regionId, status: form.status, surgeMultiplier: surge }
            : z,
        ),
      );
    } else {
      const newZone: Zone = {
        id: genId(),
        name: form.name,
        regionId: form.regionId,
        status: form.status,
        surgeMultiplier: surge,
      };
      setData((prev) => [newZone, ...prev]);
    }
    setModal(null);
    setEditTarget(null);
  };

  const columns: ColumnDef<Zone, unknown>[] = [
    {
      id: "name",
      header: "Zone",
      accessorKey: "name",
      cell: ({ getValue }) => (
        <span className="text-sm font-medium text-gray-900">{getValue() as string}</span>
      ),
    },
    {
      id: "region",
      header: "Region",
      accessorKey: "regionId",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">{regionName(getValue() as string)}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      id: "surgeMultiplier",
      header: "Surge",
      accessorKey: "surgeMultiplier",
      cell: ({ getValue }) => {
        const v = getValue() as number | undefined;
        if (!v) return <span className="text-xs text-gray-400">—</span>;
        return (
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
            v >= 1.5 ? "bg-orange-50 text-orange-700" : "bg-yellow-50 text-yellow-700"
          )}>
            ×{v.toFixed(1)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const z = row.original;
        return (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => openEdit(z)}
              title="Edit"
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => handleToggleStatus(z.id)}
              title={z.status === "active" ? "Deactivate" : "Activate"}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                z.status === "active"
                  ? "text-red-400 hover:bg-red-50 hover:text-red-600"
                  : "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700",
              )}
            >
              {z.status === "active" ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-6 w-10" />
              </div>
            ))
          : [
              { label: "Total Zones", value: stats.total, color: "text-gray-900" },
              { label: "Active", value: stats.active, color: "text-emerald-700" },
              { label: "Inactive", value: stats.inactive, color: "text-gray-500" },
              { label: "With Surge", value: stats.withSurge, color: "text-orange-700" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={cn("mt-1 text-xl font-bold", s.color)}>{s.value}</p>
              </div>
            ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by zone name..."
          className="w-64"
        />
        <FilterDropdown
          options={STATUS_FILTERS}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Status"
        />
        <FilterDropdown
          options={regionOptions}
          value={regionFilter}
          onChange={setRegionFilter}
          placeholder="Region"
        />
        {(search || statusFilter || regionFilter) && (
          <button
            onClick={() => { setSearch(""); setStatusFilter(""); setRegionFilter(""); }}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">{filtered.length} results</span>
        <button
          onClick={() => setModal("create")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Zone
        </button>
      </div>

      {/* Table */}
      <DataTable<Zone>
        data={filtered}
        columns={columns}
        loading={loading}
        pageSize={10}
      />

      {/* Modal */}
      {(modal === "create" || modal === "edit") && (
        <ZoneFormModal
          zone={modal === "edit" ? editTarget : null}
          onClose={() => { setModal(null); setEditTarget(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
