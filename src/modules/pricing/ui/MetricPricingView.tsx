"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "@/shared/common/DataTable";
import StatusBadge from "@/shared/common/StatusBadge";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import { cn } from "@/utils/cn";
import { CITIES, VEHICLE_TYPE_LABELS, cityName } from "../data/mock";
import { formatKobo } from "../lib/format";
import PricingRuleForm from "./PricingRuleForm";
import {
  useMetricRules,
  useCreateMetricRule,
  useUpdateMetricRule,
  useDeleteMetricRule,
} from "../hooks/usePricing";
import type { CreateMetricDto, CreateZoneDto, MetricPricingRule, VehicleType } from "../type/pricing";

const VEHICLE_TYPE_FILTERS = (Object.keys(VEHICLE_TYPE_LABELS) as VehicleType[]).map((vt) => ({
  label: VEHICLE_TYPE_LABELS[vt],
  value: vt,
}));

const CITY_FILTERS = [{ label: "Global", value: "global" }, ...CITIES.map((c) => ({ label: c.name, value: c.id }))];

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });

export default function MetricPricingView(): React.ReactNode {
  const query = useMetricRules();
  const createMutation = useCreateMetricRule();
  const updateMutation = useUpdateMetricRule();
  const deleteMutation = useDeleteMetricRule();

  const allRules = query.data?.data ?? [];
  const loading = query.isLoading;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const [vehicleFilter, setVehicleFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<MetricPricingRule | null>(null);

  const filtered = useMemo(() => {
    return allRules.filter((r) => {
      const matchVehicle = !vehicleFilter || r.vehicle_type === vehicleFilter;
      const matchCity = !cityFilter || (cityFilter === "global" ? r.city_id === null : r.city_id === cityFilter);
      return matchVehicle && matchCity;
    });
  }, [allRules, vehicleFilter, cityFilter]);

  const stats = useMemo(
    () => ({
      total: allRules.length,
      active: allRules.filter((r) => r.is_active).length,
      global: allRules.filter((r) => r.city_id === null).length,
      cities: new Set(allRules.filter((r) => r.city_id !== null).map((r) => r.city_id)).size,
    }),
    [allRules],
  );

  const openCreate = (): void => { setEditTarget(null); setModal("create"); };
  const openEdit = (rule: MetricPricingRule): void => { setEditTarget(rule); setModal("edit"); };
  const closeModal = (): void => { setModal(null); setEditTarget(null); };

  const handleSubmit = (values: CreateMetricDto | CreateZoneDto): void => {
    const payload = values as CreateMetricDto;
    if (modal === "edit" && editTarget) {
      updateMutation.mutate({ id: editTarget.id, payload });
    } else {
      createMutation.mutate(payload);
    }
    closeModal();
  };

  const handleToggleActive = (rule: MetricPricingRule): void => {
    if (rule.is_active) {
      deleteMutation.mutate(rule.id);
    } else {
      updateMutation.mutate({ id: rule.id, payload: { is_active: true } as Partial<CreateMetricDto> });
    }
  };

  const columns: ColumnDef<MetricPricingRule, unknown>[] = [
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
      cell: ({ getValue }) => {
        const id = getValue() as string | null;
        return id ? (
          <span className="text-sm text-gray-600">{cityName(id)}</span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            Global
          </span>
        );
      },
    },
    {
      id: "base_fare",
      header: "Base Fare",
      accessorKey: "base_fare",
      cell: ({ getValue }) => <span className="text-sm text-gray-700">{formatKobo(getValue() as number)}</span>,
    },
    {
      id: "per_km",
      header: "Per KM",
      accessorKey: "per_km",
      cell: ({ getValue }) => <span className="text-sm text-gray-700">{formatKobo(getValue() as number)}</span>,
    },
    {
      id: "per_minute",
      header: "Per Min",
      accessorKey: "per_minute",
      cell: ({ getValue }) => <span className="text-sm text-gray-700">{formatKobo(getValue() as number)}</span>,
    },
    {
      id: "min_fare",
      header: "Min Fare",
      accessorKey: "min_fare",
      cell: ({ getValue }) => <span className="text-sm text-gray-700">{formatKobo(getValue() as number)}</span>,
    },
    {
      id: "cancellation_fee",
      header: "Cancel Fee",
      accessorKey: "cancellation_fee",
      cell: ({ getValue }) => <span className="text-sm text-gray-700">{formatKobo(getValue() as number)}</span>,
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
              onClick={() => handleToggleActive(rule)}
              title={rule.is_active ? "Deactivate" : "Reactivate"}
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
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Rules", value: stats.total, color: "text-gray-900", bg: "bg-gray-50" },
          { label: "Active", value: stats.active, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Cities Covered", value: stats.cities, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Global Fallback Rules", value: stats.global, color: "text-amber-700", bg: "bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className={cn("rounded-xl border border-gray-100 px-4 py-3 shadow-sm", s.bg)}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={cn("mt-1 text-xl font-bold", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

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
            onClick={() => { setVehicleFilter(""); setCityFilter(""); }}
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
          Add Metric Rule
        </button>
      </div>

      <DataTable<MetricPricingRule> data={filtered} columns={columns} loading={loading} pageSize={10} />

      {(modal === "create" || modal === "edit") && (
        <PricingRuleForm
          type="metric"
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
