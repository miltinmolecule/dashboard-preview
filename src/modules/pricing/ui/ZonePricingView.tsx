"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "@/shared/common/DataTable";
import StatusBadge from "@/shared/common/StatusBadge";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import { cn } from "@/utils/cn";
import { CITIES, MOCK_ZONE_RULES, VEHICLE_TYPE_LABELS, cityName, genZoneRuleId, zoneName } from "../data/mock";
import { formatKobo } from "../lib/format";
import PricingRuleForm from "./PricingRuleForm";
import type { CreateMetricDto, CreateZoneDto, VehicleType, ZonePricingRule } from "../type/pricing";

// ─── Filter options ─────────────────────────────────────────────────────────

const VEHICLE_TYPE_FILTERS = (Object.keys(VEHICLE_TYPE_LABELS) as VehicleType[]).map((vt) => ({
  label: VEHICLE_TYPE_LABELS[vt],
  value: vt,
}));

const CITY_FILTERS = CITIES.map((c) => ({ label: c.name, value: c.id }));

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });

export default function ZonePricingView(): React.ReactNode {
  // swap with real query: useZoneRules(filters)
  const [data, setData] = useState<ZonePricingRule[]>(MOCK_ZONE_RULES);
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<ZonePricingRule | null>(null);
  const loading = false;
  const isSaving = false;

  const filtered = useMemo(() => {
    return data.filter((r) => {
      const matchVehicle = !vehicleFilter || r.vehicle_type === vehicleFilter;
      const matchCity = !cityFilter || r.city_id === cityFilter;
      return matchVehicle && matchCity;
    });
  }, [data, vehicleFilter, cityFilter]);

  const stats = useMemo(
    () => ({
      total: data.length,
      active: data.filter((r) => r.is_active).length,
      symmetric: data.filter((r) => r.is_symmetric).length,
      cities: new Set(data.map((r) => r.city_id)).size,
    }),
    [data],
  );

  const openCreate = (): void => {
    setEditTarget(null);
    setModal("create");
  };

  const openEdit = (rule: ZonePricingRule): void => {
    setEditTarget(rule);
    setModal("edit");
  };

  const closeModal = (): void => {
    setModal(null);
    setEditTarget(null);
  };

  const handleSubmit = (values: CreateMetricDto | CreateZoneDto): void => {
    const payload = values as CreateZoneDto;
    const now = new Date().toISOString();
    if (modal === "edit" && editTarget) {
      // swap with real mutation: useUpdateZoneRule().mutate({ id: editTarget.id, payload })
      setData((prev) =>
        prev.map((r) => (r.id === editTarget.id ? { ...r, ...payload, updated_at: now } : r)),
      );
    } else {
      // swap with real mutation: useCreateZoneRule().mutate(payload)
      const newRule: ZonePricingRule = {
        ...payload,
        id: genZoneRuleId(),
        is_active: true,
        created_by: "adm_001",
        created_at: now,
        updated_at: now,
      };
      setData((prev) => [newRule, ...prev]);
    }
    closeModal();
  };

  const handleToggleActive = (id: string): void => {
    // swap with real mutation: useDeleteZoneRule() (soft delete) / useUpdateZoneRule() to reactivate
    setData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_active: !r.is_active, updated_at: new Date().toISOString() } : r)),
    );
  };

  const columns: ColumnDef<ZonePricingRule, unknown>[] = [
    {
      id: "vehicle_type",
      header: "Vehicle Type",
      accessorKey: "vehicle_type",
      cell: ({ getValue }) => (
        <span className="text-sm font-medium text-gray-900">{VEHICLE_TYPE_LABELS[getValue() as VehicleType]}</span>
      ),
    },
    {
      id: "city_id",
      header: "City",
      accessorKey: "city_id",
      cell: ({ getValue }) => <span className="text-sm text-gray-600">{cityName(getValue() as string)}</span>,
    },
    {
      id: "route",
      header: "Route",
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">
          {zoneName(row.original.origin_zone_id)}{" "}
          <span className="text-gray-400">{row.original.is_symmetric ? "↔" : "→"}</span>{" "}
          {zoneName(row.original.destination_zone_id)}
        </span>
      ),
    },
    {
      id: "flat_fare",
      header: "Flat Fare",
      accessorKey: "flat_fare",
      cell: ({ getValue }) => (
        <span className="text-sm font-semibold text-gray-900">{formatKobo(getValue() as number)}</span>
      ),
    },
    {
      id: "is_symmetric",
      header: "Direction",
      accessorKey: "is_symmetric",
      cell: ({ getValue }) => (
        <span className="text-xs text-gray-500">{getValue() ? "Symmetric" : "One-way"}</span>
      ),
    },
    {
      id: "effective_from",
      header: "Effective From",
      accessorKey: "effective_from",
      cell: ({ getValue }) => <span className="text-xs text-gray-500">{formatDate(getValue() as string)}</span>,
    },
    {
      id: "is_active",
      header: "Status",
      accessorKey: "is_active",
      cell: ({ getValue }) => <StatusBadge status={getValue() ? "active" : "inactive"} />,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const rule = row.original;
        return (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => openEdit(rule)}
              title="Edit"
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => handleToggleActive(rule.id)}
              title={rule.is_active ? "Deactivate (soft delete)" : "Reactivate"}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                rule.is_active
                  ? "text-red-400 hover:bg-red-50 hover:text-red-600"
                  : "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700",
              )}
            >
              {rule.is_active ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16"
                  />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        {[
          { label: "Total Rules", value: stats.total, color: "text-gray-900", bg: "bg-gray-50" },
          { label: "Active", value: stats.active, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Symmetric Routes", value: stats.symmetric, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Cities Covered", value: stats.cities, color: "text-amber-700", bg: "bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className={cn("rounded-xl border border-gray-100 px-4 py-3 shadow-sm", s.bg)}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={cn("mt-1 text-xl font-bold", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterDropdown
          options={VEHICLE_TYPE_FILTERS}
          value={vehicleFilter}
          onChange={setVehicleFilter}
          placeholder="Vehicle Type"
        />
        <FilterDropdown options={CITY_FILTERS} value={cityFilter} onChange={setCityFilter} placeholder="City" />
        {(vehicleFilter || cityFilter) && (
          <button
            onClick={() => {
              setVehicleFilter("");
              setCityFilter("");
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">{filtered.length} results</span>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Zone Rule
        </button>
      </div>

      {/* Table */}
      <DataTable<ZonePricingRule> data={filtered} columns={columns} loading={loading} pageSize={10} />

      {/* Modal */}
      {(modal === "create" || modal === "edit") && (
        <PricingRuleForm
          type="zone"
          mode={modal}
          initialValues={editTarget ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isLoading={isSaving}
        />
      )}
    </div>
  );
}
