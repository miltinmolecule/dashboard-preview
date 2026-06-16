"use client";

import { useMemo, useState } from "react";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import { cn } from "@/utils/cn";
import { CITIES, MOCK_SURGE_CONFIGS, VEHICLE_TYPES, VEHICLE_TYPE_LABELS, cityName, genSurgeId } from "../data/mock";
import type { SurgeConfig, VehicleType } from "../type/pricing";

// ─── Filter options ─────────────────────────────────────────────────────────

const VEHICLE_TYPE_FILTERS = (Object.keys(VEHICLE_TYPE_LABELS) as VehicleType[]).map((vt) => ({
  label: VEHICLE_TYPE_LABELS[vt],
  value: vt,
}));

const CITY_FILTERS = [{ label: "Global", value: "global" }, ...CITIES.map((c) => ({ label: c.name, value: c.id }))];

// ─── Badge helper (per skill §5) ─────────────────────────────────────────────

function surgeBadge(config: SurgeConfig): { label: string; className: string } {
  if (!config.is_active) return { label: "OFF", className: "border-gray-200 bg-gray-100 text-gray-500" };
  if (config.trigger_mode === "manual") {
    return { label: "LIVE — MANUAL", className: "border-red-200 bg-red-50 text-red-700" };
  }
  return { label: "LIVE — AUTO", className: "border-orange-200 bg-orange-50 text-orange-700" };
}

// ─── Surge config form (create / edit thresholds) ───────────────────────────

interface SurgeFormState {
  vehicle_type: VehicleType;
  city_id: string; // "" = global
  multiplier: string;
  trigger_mode: "auto" | "manual";
  demand_ratio_threshold: string;
}

function configToForm(config: SurgeConfig): SurgeFormState {
  return {
    vehicle_type: config.vehicle_type,
    city_id: config.city_id ?? "",
    multiplier: String(config.multiplier),
    trigger_mode: config.trigger_mode,
    demand_ratio_threshold: String(config.demand_ratio_threshold),
  };
}

const EMPTY_SURGE_FORM: SurgeFormState = {
  vehicle_type: "standard",
  city_id: "",
  multiplier: "1.5",
  trigger_mode: "manual",
  demand_ratio_threshold: "0.3",
};

function SurgeFormModal({
  config,
  onClose,
  onSave,
}: {
  config: SurgeConfig | null;
  onClose: () => void;
  onSave: (form: SurgeFormState, id?: string) => void;
}): React.ReactNode {
  const isEdit = config !== null;
  const [form, setForm] = useState<SurgeFormState>(isEdit ? configToForm(config) : EMPTY_SURGE_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof SurgeFormState, string>>>({});

  const set = <K extends keyof SurgeFormState>(key: K, value: SurgeFormState[K]): void =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const errs: Partial<Record<keyof SurgeFormState, string>> = {};
    const m = Number(form.multiplier);
    if (!form.multiplier.trim() || isNaN(m) || m < 1) errs.multiplier = "Must be ≥ 1.0";
    const t = Number(form.demand_ratio_threshold);
    if (!form.demand_ratio_threshold.trim() || isNaN(t) || t < 0 || t > 1) {
      errs.demand_ratio_threshold = "Must be between 0 and 1";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form, config?.id);
  };

  const inputClass = (hasError: boolean): string =>
    cn(
      "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-900 outline-none",
      "focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
      hasError ? "border-red-400" : "border-gray-200",
    );

  return (
    <ModalWrapper open onClose={onClose} title={isEdit ? "Edit Surge Config" : "Create Surge Config"} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isEdit && (
          <>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Vehicle Type</label>
              <div className="flex gap-2">
                {VEHICLE_TYPES.map((vt) => (
                  <button
                    key={vt}
                    type="button"
                    onClick={() => set("vehicle_type", vt)}
                    className={cn(
                      "flex-1 rounded-lg border py-2 text-xs font-medium transition-all",
                      form.vehicle_type === vt
                        ? "border-blue-400 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50",
                    )}
                  >
                    {VEHICLE_TYPE_LABELS[vt]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                City <span className="text-gray-400 font-normal">(optional — leave blank for global)</span>
              </label>
              <select value={form.city_id} onChange={(e) => set("city_id", e.target.value)} className={inputClass(false)}>
                <option value="">Global (all cities)</option>
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.country})
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Surge Multiplier</label>
          <input
            type="number"
            min="1"
            step="0.1"
            value={form.multiplier}
            onChange={(e) => set("multiplier", e.target.value)}
            placeholder="1.5"
            className={inputClass(!!errors.multiplier)}
          />
          {errors.multiplier && <p className="mt-1 text-xs text-red-500">{errors.multiplier}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Trigger Mode</label>
          <div className="flex gap-3">
            {(["manual", "auto"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => set("trigger_mode", m)}
                className={cn(
                  "flex-1 rounded-lg border py-2 text-xs font-medium capitalize transition-all",
                  form.trigger_mode === m
                    ? "border-blue-400 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            Demand Ratio Threshold <span className="text-gray-400 font-normal">(driver:rider, 0–1)</span>
          </label>
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={form.demand_ratio_threshold}
            onChange={(e) => set("demand_ratio_threshold", e.target.value)}
            placeholder="0.3"
            className={inputClass(!!errors.demand_ratio_threshold)}
          />
          {errors.demand_ratio_threshold && (
            <p className="mt-1 text-xs text-red-500">{errors.demand_ratio_threshold}</p>
          )}
        </div>

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
            {isEdit ? "Save Changes" : "Create Config"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

// ─── Main view ──────────────────────────────────────────────────────────────

export default function SurgeView(): React.ReactNode {
  // swap with real query: useSurgeConfigs(filters)
  const [data, setData] = useState<SurgeConfig[]>(MOCK_SURGE_CONFIGS);
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<SurgeConfig | null>(null);

  const filtered = useMemo(() => {
    return data.filter((c) => {
      const matchVehicle = !vehicleFilter || c.vehicle_type === vehicleFilter;
      const matchCity = !cityFilter || (cityFilter === "global" ? c.city_id === null : c.city_id === cityFilter);
      return matchVehicle && matchCity;
    });
  }, [data, vehicleFilter, cityFilter]);

  const stats = useMemo(
    () => ({
      total: data.length,
      live: data.filter((c) => c.is_active).length,
      manual: data.filter((c) => c.trigger_mode === "manual").length,
      auto: data.filter((c) => c.trigger_mode === "auto").length,
    }),
    [data],
  );

  // Optimistic toggle — flips immediately; rolls back if the mutation fails.
  const handleToggle = (config: SurgeConfig): void => {
    if (config.trigger_mode === "auto") return; // auto surge toggle is read-only
    const nextActive = !config.is_active;
    // swap with real mutation: useToggleSurge().mutate({ id: config.id, is_active: nextActive })
    setData((prev) =>
      prev.map((c) =>
        c.id === config.id
          ? {
              ...c,
              is_active: nextActive,
              manually_activated_by: nextActive ? "Fatima Bello" : c.manually_activated_by,
              manually_activated_at: nextActive ? new Date().toISOString() : c.manually_activated_at,
              updated_at: new Date().toISOString(),
            }
          : c,
      ),
    );
  };

  const openCreate = (): void => {
    setEditTarget(null);
    setModal("create");
  };

  const openEdit = (config: SurgeConfig): void => {
    setEditTarget(config);
    setModal("edit");
  };

  const closeModal = (): void => {
    setModal(null);
    setEditTarget(null);
  };

  const handleSave = (form: SurgeFormState, id?: string): void => {
    const now = new Date().toISOString();
    if (id) {
      // swap with real mutation: useUpdateSurgeConfig().mutate({ id, payload })
      setData((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                multiplier: Number(form.multiplier),
                trigger_mode: form.trigger_mode,
                demand_ratio_threshold: Number(form.demand_ratio_threshold),
                updated_at: now,
              }
            : c,
        ),
      );
    } else {
      // swap with real mutation: useCreateSurgeConfig().mutate(payload)
      const newConfig: SurgeConfig = {
        id: genSurgeId(),
        vehicle_type: form.vehicle_type,
        city_id: form.city_id || null,
        multiplier: Number(form.multiplier),
        trigger_mode: form.trigger_mode,
        demand_ratio_threshold: Number(form.demand_ratio_threshold),
        is_active: false,
        created_at: now,
        updated_at: now,
      };
      setData((prev) => [newConfig, ...prev]);
    }
    closeModal();
  };

  return (
    <div className="space-y-5">
      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Configs", value: stats.total, color: "text-gray-900", bg: "bg-gray-50" },
          { label: "Live Now", value: stats.live, color: "text-red-700", bg: "bg-red-50" },
          { label: "Manual Triggers", value: stats.manual, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Auto Triggers", value: stats.auto, color: "text-orange-700", bg: "bg-orange-50" },
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
          Add Surge Config
        </button>
      </div>

      {/* Surge cards */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((config) => {
          const badge = surgeBadge(config);
          return (
            <div key={config.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{VEHICLE_TYPE_LABELS[config.vehicle_type]}</p>
                  <p className="text-xs text-gray-400">{cityName(config.city_id)}</p>
                </div>
                <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide", badge.className)}>
                  {badge.label}
                </span>
              </div>

              <div className="mb-3 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">{config.multiplier.toFixed(1)}×</span>
                <span className="text-xs text-gray-400">multiplier</span>
              </div>

              <div className="mb-3 space-y-1 text-xs text-gray-500">
                <p>
                  Trigger: <span className="font-medium capitalize text-gray-700">{config.trigger_mode}</span>
                </p>
                <p>
                  Demand threshold: <span className="font-medium text-gray-700">{config.demand_ratio_threshold.toFixed(2)}</span>
                </p>
                {config.time_windows && config.time_windows.length > 0 && (
                  <p>
                    Scheduled windows:{" "}
                    <span className="font-medium text-gray-700">{config.time_windows.length}</span>
                  </p>
                )}
                {config.manually_activated_by && config.is_active && config.trigger_mode === "manual" && (
                  <p className="text-gray-400">
                    Activated by {config.manually_activated_by}
                    {config.manually_activated_at &&
                      ` · ${new Date(config.manually_activated_at).toLocaleString("en-NG", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}`}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <button onClick={() => openEdit(config)} className="text-xs font-medium text-blue-600 hover:underline">
                  Edit thresholds
                </button>
                <button
                  onClick={() => handleToggle(config)}
                  disabled={config.trigger_mode === "auto"}
                  title={
                    config.trigger_mode === "auto"
                      ? "Auto surge is read-only — adjust thresholds instead"
                      : config.is_active
                        ? "Turn off"
                        : "Turn on"
                  }
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    config.is_active ? "bg-red-500" : "bg-gray-300",
                    config.trigger_mode === "auto" && "cursor-not-allowed opacity-50",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                      config.is_active && "translate-x-5",
                    )}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {(modal === "create" || modal === "edit") && (
        <SurgeFormModal config={modal === "edit" ? editTarget : null} onClose={closeModal} onSave={handleSave} />
      )}
    </div>
  );
}
