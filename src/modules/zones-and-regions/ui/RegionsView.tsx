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
import type { Region, RegionStatus } from "../services/region.service";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_REGIONS: Region[] = [
  { id: "reg_001", name: "Lagos", country: "Nigeria", status: "active", createdAt: "2024-01-10" },
  { id: "reg_002", name: "Abuja", country: "Nigeria", status: "active", createdAt: "2024-01-12" },
  { id: "reg_003", name: "Accra", country: "Ghana", status: "active", createdAt: "2024-02-01" },
  { id: "reg_004", name: "Nairobi", country: "Kenya", status: "active", createdAt: "2024-03-05" },
  { id: "reg_005", name: "Port Harcourt", country: "Nigeria", status: "inactive", createdAt: "2024-03-18" },
  { id: "reg_006", name: "Kumasi", country: "Ghana", status: "inactive", createdAt: "2024-04-02" },
  { id: "reg_007", name: "Ibadan", country: "Nigeria", status: "active", createdAt: "2024-04-15" },
  { id: "reg_008", name: "Mombasa", country: "Kenya", status: "active", createdAt: "2024-05-01" },
  { id: "reg_009", name: "Enugu", country: "Nigeria", status: "inactive", createdAt: "2024-05-20" },
  { id: "reg_010", name: "Cape Coast", country: "Ghana", status: "active", createdAt: "2024-06-01" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genId(): string {
  return `reg_${Date.now().toString(36)}`;
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Region Form Modal ─────────────────────────────────────────────────────

interface RegionFormState {
  name: string;
  country: string;
  status: RegionStatus;
}

const EMPTY_FORM: RegionFormState = { name: "", country: "", status: "active" };

function RegionFormModal({
  region,
  onClose,
  onSave,
}: {
  region: Region | null;
  onClose: () => void;
  onSave: (data: RegionFormState, id?: string) => void;
}): React.ReactNode {
  const isEdit = region !== null;
  const [form, setForm] = useState<RegionFormState>(
    isEdit ? { name: region.name, country: region.country, status: region.status } : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<Partial<RegionFormState>>({});

  const set = (key: keyof RegionFormState, value: string): void =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const errs: Partial<RegionFormState> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.country.trim()) errs.country = "Country is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form, region?.id);
  };

  return (
    <ModalWrapper open onClose={onClose} title={isEdit ? "Edit Region" : "Create Region"} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Region Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Lagos"
            className={cn(
              "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-900 outline-none",
              "placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
              errors.name ? "border-red-400" : "border-gray-200",
            )}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Country */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Country</label>
          <input
            type="text"
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
            placeholder="e.g. Nigeria"
            className={cn(
              "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-900 outline-none",
              "placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
              errors.country ? "border-red-400" : "border-gray-200",
            )}
          />
          {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Status</label>
          <div className="flex gap-3">
            {(["active", "inactive"] as RegionStatus[]).map((s) => (
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
            {isEdit ? "Save Changes" : "Create Region"}
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

export default function RegionsView(): React.ReactNode {
  const [data, setData] = useState<Region[]>(MOCK_REGIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Region | null>(null);
  const loading = false;

  const countryOptions = useMemo(
    () =>
      [...new Set(data.map((r) => r.country))]
        .sort()
        .map((c) => ({ label: c, value: c })),
    [data],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((r) => {
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.country.toLowerCase().includes(q);
      const matchStatus = !statusFilter || r.status === statusFilter;
      const matchCountry = !countryFilter || r.country === countryFilter;
      return matchSearch && matchStatus && matchCountry;
    });
  }, [data, search, statusFilter, countryFilter]);

  const stats = useMemo(
    () => ({
      total: data.length,
      active: data.filter((r) => r.status === "active").length,
      inactive: data.filter((r) => r.status === "inactive").length,
    }),
    [data],
  );

  const openEdit = (region: Region): void => {
    setEditTarget(region);
    setModal("edit");
  };

  const handleToggleStatus = (id: string): void => {
    setData((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === "active" ? "inactive" : "active" } : r,
      ),
    );
  };

  const handleSave = (form: { name: string; country: string; status: RegionStatus }, id?: string): void => {
    if (id) {
      setData((prev) => prev.map((r) => (r.id === id ? { ...r, ...form } : r)));
    } else {
      const newRegion: Region = {
        id: genId(),
        ...form,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [newRegion, ...prev]);
    }
    setModal(null);
    setEditTarget(null);
  };

  const columns: ColumnDef<Region, unknown>[] = [
    {
      id: "name",
      header: "Region",
      accessorKey: "name",
      cell: ({ getValue }) => (
        <span className="text-sm font-medium text-gray-900">{getValue() as string}</span>
      ),
    },
    {
      id: "country",
      header: "Country",
      accessorKey: "country",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">{getValue() as string}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      id: "createdAt",
      header: "Created",
      accessorKey: "createdAt",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-500">{formatDate(getValue() as string)}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const r = row.original;
        return (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => openEdit(r)}
              title="Edit"
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => handleToggleStatus(r.id)}
              title={r.status === "active" ? "Deactivate" : "Activate"}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                r.status === "active"
                  ? "text-red-400 hover:bg-red-50 hover:text-red-600"
                  : "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700",
              )}
            >
              {r.status === "active" ? (
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
      <div className="grid grid-cols-3 gap-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-6 w-10" />
              </div>
            ))
          : [
              { label: "Total Regions", value: stats.total, color: "text-gray-900" },
              { label: "Active", value: stats.active, color: "text-emerald-700" },
              { label: "Inactive", value: stats.inactive, color: "text-gray-500" },
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
          placeholder="Search by region name..."
          className="w-64"
        />
        <FilterDropdown
          options={STATUS_FILTERS}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Status"
        />
        <FilterDropdown
          options={countryOptions}
          value={countryFilter}
          onChange={setCountryFilter}
          placeholder="Country"
        />
        {(search || statusFilter || countryFilter) && (
          <button
            onClick={() => { setSearch(""); setStatusFilter(""); setCountryFilter(""); }}
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
          Add Region
        </button>
      </div>

      {/* Table */}
      <DataTable<Region>
        data={filtered}
        columns={columns}
        loading={loading}
        pageSize={10}
      />

      {/* Modal */}
      {(modal === "create" || modal === "edit") && (
        <RegionFormModal
          region={modal === "edit" ? editTarget : null}
          onClose={() => { setModal(null); setEditTarget(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
