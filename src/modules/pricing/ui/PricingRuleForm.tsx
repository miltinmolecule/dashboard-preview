"use client";

import { useMemo, useState } from "react";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import { cn } from "@/utils/cn";
import { CITIES, VEHICLE_TYPES, VEHICLE_TYPE_LABELS, ZONES } from "../data/mock";
import { koboToNaira, nairaToKobo } from "../lib/format";
import type { CreateMetricDto, CreateZoneDto, MetricPricingRule, VehicleType, ZonePricingRule } from "../type/pricing";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isoToLocal = (iso: string): string => {
  const d = new Date(iso);
  const pad = (n: number): string => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const localToIso = (local: string): string => new Date(local).toISOString();

const nowLocal = (): string => isoToLocal(new Date().toISOString());

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  vehicle_type: VehicleType;
  city_id: string; // "" = global (metric only)
  base_fare: string; // naira
  per_km: string; // naira
  per_minute: string; // naira
  min_fare: string; // naira
  cancellation_fee: string; // naira
  origin_zone_id: string;
  destination_zone_id: string;
  flat_fare: string; // naira
  is_symmetric: boolean;
  effective_from: string; // datetime-local
}

const EMPTY_FORM: FormState = {
  vehicle_type: "standard",
  city_id: "",
  base_fare: "",
  per_km: "",
  per_minute: "",
  min_fare: "",
  cancellation_fee: "",
  origin_zone_id: "",
  destination_zone_id: "",
  flat_fare: "",
  is_symmetric: true,
  effective_from: nowLocal(),
};

function metricToForm(rule: MetricPricingRule): FormState {
  return {
    ...EMPTY_FORM,
    vehicle_type: rule.vehicle_type,
    city_id: rule.city_id ?? "",
    base_fare: String(koboToNaira(rule.base_fare)),
    per_km: String(koboToNaira(rule.per_km)),
    per_minute: String(koboToNaira(rule.per_minute)),
    min_fare: String(koboToNaira(rule.min_fare)),
    cancellation_fee: String(koboToNaira(rule.cancellation_fee)),
    effective_from: isoToLocal(rule.effective_from),
  };
}

function zoneToForm(rule: ZonePricingRule): FormState {
  return {
    ...EMPTY_FORM,
    vehicle_type: rule.vehicle_type,
    city_id: rule.city_id,
    origin_zone_id: rule.origin_zone_id,
    destination_zone_id: rule.destination_zone_id,
    flat_fare: String(koboToNaira(rule.flat_fare)),
    is_symmetric: rule.is_symmetric,
    effective_from: isoToLocal(rule.effective_from),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PricingRuleFormProps {
  type: "metric" | "zone";
  mode: "create" | "edit";
  initialValues?: MetricPricingRule | ZonePricingRule;
  onSubmit: (values: CreateMetricDto | CreateZoneDto) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const inputClass = (hasError: boolean): string =>
  cn(
    "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-900 outline-none",
    "placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
    hasError ? "border-red-400" : "border-gray-200",
  );

export default function PricingRuleForm({
  type,
  mode,
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
}: PricingRuleFormProps): React.ReactNode {
  const [form, setForm] = useState<FormState>(() => {
    if (!initialValues) return EMPTY_FORM;
    return type === "metric" ? metricToForm(initialValues as MetricPricingRule) : zoneToForm(initialValues as ZonePricingRule);
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const set = <K extends keyof FormState>(key: K, value: FormState[K]): void =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const zonesInCity = useMemo(
    () => ZONES.filter((z) => z.city_id === form.city_id),
    [form.city_id],
  );

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    const nairaFields: (keyof FormState)[] =
      type === "metric"
        ? ["base_fare", "per_km", "per_minute", "min_fare", "cancellation_fee"]
        : ["flat_fare"];

    for (const field of nairaFields) {
      const v = form[field] as string;
      if (!v.trim() || isNaN(Number(v)) || Number(v) < 0) {
        errs[field] = "Enter a valid non-negative amount";
      }
    }

    if (type === "zone") {
      if (!form.city_id) errs.city_id = "City is required";
      if (!form.origin_zone_id) errs.origin_zone_id = "Origin zone is required";
      if (!form.destination_zone_id) errs.destination_zone_id = "Destination zone is required";
      if (
        form.origin_zone_id &&
        form.destination_zone_id &&
        form.origin_zone_id === form.destination_zone_id
      ) {
        errs.destination_zone_id = "Must differ from origin zone";
      }
    }

    if (!form.effective_from) errs.effective_from = "Effective date is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!validate()) return;

    if (type === "metric") {
      const payload: CreateMetricDto = {
        vehicle_type: form.vehicle_type,
        city_id: form.city_id || null,
        base_fare: nairaToKobo(Number(form.base_fare)),
        per_km: nairaToKobo(Number(form.per_km)),
        per_minute: nairaToKobo(Number(form.per_minute)),
        min_fare: nairaToKobo(Number(form.min_fare)),
        cancellation_fee: nairaToKobo(Number(form.cancellation_fee)),
        effective_from: localToIso(form.effective_from),
      };
      onSubmit(payload);
    } else {
      const payload: CreateZoneDto = {
        vehicle_type: form.vehicle_type,
        city_id: form.city_id,
        origin_zone_id: form.origin_zone_id,
        destination_zone_id: form.destination_zone_id,
        flat_fare: nairaToKobo(Number(form.flat_fare)),
        is_symmetric: form.is_symmetric,
        effective_from: localToIso(form.effective_from),
      };
      onSubmit(payload);
    }
  };

  const title =
    type === "metric"
      ? mode === "create" ? "Create Metric Pricing Rule" : "Edit Metric Pricing Rule"
      : mode === "create" ? "Create Zone Pricing Rule" : "Edit Zone Pricing Rule";

  return (
    <ModalWrapper open onClose={onCancel} title={title} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle type */}
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

        {/* City */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            City{type === "metric" && <span className="text-gray-400 font-normal"> (optional — leave blank for global fallback)</span>}
          </label>
          <select
            value={form.city_id}
            onChange={(e) => {
              set("city_id", e.target.value);
              if (type === "zone") {
                set("origin_zone_id", "");
                set("destination_zone_id", "");
              }
            }}
            className={inputClass(!!errors.city_id)}
          >
            <option value="">{type === "metric" ? "Global (all cities)" : "Select city..."}</option>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.country})
              </option>
            ))}
          </select>
          {errors.city_id && <p className="mt-1 text-xs text-red-500">{errors.city_id}</p>}
        </div>

        {type === "metric" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Base Fare (₦)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.base_fare}
                  onChange={(e) => set("base_fare", e.target.value)}
                  placeholder="1500.00"
                  className={inputClass(!!errors.base_fare)}
                />
                {errors.base_fare && <p className="mt-1 text-xs text-red-500">{errors.base_fare}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Per KM (₦)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.per_km}
                  onChange={(e) => set("per_km", e.target.value)}
                  placeholder="150.00"
                  className={inputClass(!!errors.per_km)}
                />
                {errors.per_km && <p className="mt-1 text-xs text-red-500">{errors.per_km}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Per Minute (₦)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.per_minute}
                  onChange={(e) => set("per_minute", e.target.value)}
                  placeholder="50.00"
                  className={inputClass(!!errors.per_minute)}
                />
                {errors.per_minute && <p className="mt-1 text-xs text-red-500">{errors.per_minute}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Minimum Fare (₦)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.min_fare}
                  onChange={(e) => set("min_fare", e.target.value)}
                  placeholder="1000.00"
                  className={inputClass(!!errors.min_fare)}
                />
                {errors.min_fare && <p className="mt-1 text-xs text-red-500">{errors.min_fare}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Cancellation Fee (₦)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.cancellation_fee}
                  onChange={(e) => set("cancellation_fee", e.target.value)}
                  placeholder="500.00"
                  className={inputClass(!!errors.cancellation_fee)}
                />
                {errors.cancellation_fee && <p className="mt-1 text-xs text-red-500">{errors.cancellation_fee}</p>}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Origin Zone</label>
                <select
                  value={form.origin_zone_id}
                  onChange={(e) => set("origin_zone_id", e.target.value)}
                  disabled={!form.city_id}
                  className={inputClass(!!errors.origin_zone_id)}
                >
                  <option value="">Select zone...</option>
                  {zonesInCity.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
                {errors.origin_zone_id && <p className="mt-1 text-xs text-red-500">{errors.origin_zone_id}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Destination Zone</label>
                <select
                  value={form.destination_zone_id}
                  onChange={(e) => set("destination_zone_id", e.target.value)}
                  disabled={!form.city_id}
                  className={inputClass(!!errors.destination_zone_id)}
                >
                  <option value="">Select zone...</option>
                  {zonesInCity.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
                {errors.destination_zone_id && (
                  <p className="mt-1 text-xs text-red-500">{errors.destination_zone_id}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Flat Fare (₦)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.flat_fare}
                onChange={(e) => set("flat_fare", e.target.value)}
                placeholder="2000.00"
                className={inputClass(!!errors.flat_fare)}
              />
              {errors.flat_fare && <p className="mt-1 text-xs text-red-500">{errors.flat_fare}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Direction</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => set("is_symmetric", true)}
                  className={cn(
                    "flex-1 rounded-lg border py-2 text-xs font-medium transition-all",
                    form.is_symmetric
                      ? "border-blue-400 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50",
                  )}
                >
                  Symmetric (A ↔ B)
                </button>
                <button
                  type="button"
                  onClick={() => set("is_symmetric", false)}
                  className={cn(
                    "flex-1 rounded-lg border py-2 text-xs font-medium transition-all",
                    !form.is_symmetric
                      ? "border-blue-400 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50",
                  )}
                >
                  One-way (A → B)
                </button>
              </div>
            </div>
          </>
        )}

        {/* Effective from */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Effective From</label>
          <input
            type="datetime-local"
            value={form.effective_from}
            onChange={(e) => set("effective_from", e.target.value)}
            className={inputClass(!!errors.effective_from)}
          />
          {errors.effective_from && <p className="mt-1 text-xs text-red-500">{errors.effective_from}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-lg bg-[var(--primary)] py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isLoading ? "Saving..." : mode === "create" ? "Create Rule" : "Save Changes"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
