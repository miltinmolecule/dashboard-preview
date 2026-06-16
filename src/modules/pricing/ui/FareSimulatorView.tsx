"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { CITIES, MOCK_METRIC_RULES, MOCK_SURGE_CONFIGS, MOCK_ZONE_RULES, VEHICLE_TYPES, VEHICLE_TYPE_LABELS, ZONES } from "../data/mock";
import { formatKobo } from "../lib/format";
import type { FareSimulationResult, VehicleType } from "../type/pricing";

// ─── Local simulation (mirrors GET /admin/pricing/simulate) ─────────────────

function estimateTrip(originId: string, destId: string): { distanceKm: number; durationMin: number } {
  if (originId === destId) return { distanceKm: 2, durationMin: 8 };
  const a = ZONES.findIndex((z) => z.id === originId);
  const b = ZONES.findIndex((z) => z.id === destId);
  const diff = Math.abs(a - b) || 1;
  return { distanceKm: 4 + diff * 1.5, durationMin: 10 + diff * 3 };
}

function simulateFareLocally(params: {
  city_id: string;
  vehicle_type: VehicleType;
  origin_zone_id: string;
  destination_zone_id: string;
}): FareSimulationResult {
  const { distanceKm, durationMin } = estimateTrip(params.origin_zone_id, params.destination_zone_id);

  const metricRule =
    MOCK_METRIC_RULES.find((r) => r.is_active && r.vehicle_type === params.vehicle_type && r.city_id === params.city_id) ??
    MOCK_METRIC_RULES.find((r) => r.is_active && r.vehicle_type === params.vehicle_type && r.city_id === null);

  const metric = metricRule
    ? {
        base_fare: metricRule.base_fare,
        distance_charge: Math.round(metricRule.per_km * distanceKm),
        time_charge: Math.round(metricRule.per_minute * durationMin),
        total: 0,
      }
    : { base_fare: 0, distance_charge: 0, time_charge: 0, total: 0 };

  if (metricRule) {
    const raw = metric.base_fare + metric.distance_charge + metric.time_charge;
    metric.total = Math.max(raw, metricRule.min_fare);
  }

  const zoneRule = MOCK_ZONE_RULES.find(
    (r) =>
      r.is_active &&
      r.vehicle_type === params.vehicle_type &&
      r.city_id === params.city_id &&
      ((r.origin_zone_id === params.origin_zone_id && r.destination_zone_id === params.destination_zone_id) ||
        (r.is_symmetric &&
          r.origin_zone_id === params.destination_zone_id &&
          r.destination_zone_id === params.origin_zone_id)),
  );

  const zone = { flat_fare: zoneRule?.flat_fare ?? 0, zone_match: !!zoneRule };
  const applied: "metric" | "zone" = zoneRule ? "zone" : "metric";
  const base = applied === "zone" ? zone.flat_fare : metric.total;

  const surgeConfig = MOCK_SURGE_CONFIGS.find(
    (s) => s.is_active && s.vehicle_type === params.vehicle_type && (s.city_id === params.city_id || s.city_id === null),
  );
  const surge_multiplier = surgeConfig?.multiplier ?? 1;
  const final_fare = Math.round(base * surge_multiplier);

  return {
    metric,
    zone,
    applied,
    surge_multiplier,
    final_fare,
    formatted: formatKobo(final_fare),
  };
}

// ─── Main view ──────────────────────────────────────────────────────────────

const inputClass = "h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all";

export default function FareSimulatorView(): React.ReactNode {
  const [cityId, setCityId] = useState(CITIES[0].id);
  const [vehicleType, setVehicleType] = useState<VehicleType>("standard");
  const [originZoneId, setOriginZoneId] = useState("");
  const [destinationZoneId, setDestinationZoneId] = useState("");
  const [result, setResult] = useState<FareSimulationResult | null>(null);

  const zonesInCity = ZONES.filter((z) => z.city_id === cityId);

  const handleCityChange = (id: string): void => {
    setCityId(id);
    setOriginZoneId("");
    setDestinationZoneId("");
    setResult(null);
  };

  const canSimulate = !!originZoneId && !!destinationZoneId;

  const handleSimulate = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!canSimulate) return;
    // swap with real query: useFareSimulator({ pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, vehicle_type, city_id }) — staleTime: 0
    setResult(simulateFareLocally({ city_id: cityId, vehicle_type: vehicleType, origin_zone_id: originZoneId, destination_zone_id: destinationZoneId }));
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Form */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Simulate a Fare</h2>
        <form onSubmit={handleSimulate} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">City</label>
            <select value={cityId} onChange={(e) => handleCityChange(e.target.value)} className={inputClass}>
              {CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.country})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Vehicle Type</label>
            <div className="flex gap-2">
              {VEHICLE_TYPES.map((vt) => (
                <button
                  key={vt}
                  type="button"
                  onClick={() => setVehicleType(vt)}
                  className={cn(
                    "flex-1 rounded-lg border py-2 text-xs font-medium transition-all",
                    vehicleType === vt
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
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Pickup Zone</label>
            <select value={originZoneId} onChange={(e) => setOriginZoneId(e.target.value)} className={inputClass}>
              <option value="">Select zone...</option>
              {zonesInCity.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Dropoff Zone</label>
            <select value={destinationZoneId} onChange={(e) => setDestinationZoneId(e.target.value)} className={inputClass}>
              <option value="">Select zone...</option>
              {zonesInCity.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!canSimulate}
            className="w-full rounded-lg bg-[var(--primary)] py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Run Simulation
          </button>
        </form>
      </div>

      {/* Result */}
      <div className="col-span-2 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Simulation Result</h2>
        {!result ? (
          <p className="text-sm text-gray-400">Select a pickup and dropoff zone, then run a simulation.</p>
        ) : (
          <div className="space-y-5">
            {/* Final fare */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Final Fare</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{result.formatted}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                  result.applied === "zone" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700",
                )}>
                  Applied: {result.applied === "zone" ? "Zone Pricing" : "Metric Pricing"}
                </span>
                {result.surge_multiplier > 1 && (
                  <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                    Surge {result.surge_multiplier.toFixed(1)}×
                  </span>
                )}
              </div>
            </div>

            {/* Metric breakdown */}
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Metric Breakdown</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Base Fare", value: result.metric.base_fare },
                  { label: "Distance Charge", value: result.metric.distance_charge },
                  { label: "Time Charge", value: result.metric.time_charge },
                  { label: "Total", value: result.metric.total },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-gray-100 px-3 py-2">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-900">{formatKobo(item.value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone breakdown */}
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Zone Pricing</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-100 px-3 py-2">
                  <p className="text-xs text-gray-500">Flat Fare</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900">
                    {result.zone.zone_match ? formatKobo(result.zone.flat_fare) : "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-100 px-3 py-2">
                  <p className="text-xs text-gray-500">Zone Match</p>
                  <p className={cn("mt-0.5 text-sm font-semibold", result.zone.zone_match ? "text-emerald-600" : "text-gray-400")}>
                    {result.zone.zone_match ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
