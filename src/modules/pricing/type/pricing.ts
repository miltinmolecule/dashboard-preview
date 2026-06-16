export interface MetricPricingRule {
  id: string;
  vehicle_type: "standard" | "premium" | "executive";
  city_id: string | null; // null = global fallback
  base_fare: number; // kobo
  per_km: number; // kobo per km
  per_minute: number; // kobo per minute
  min_fare: number; // kobo — floor price
  cancellation_fee: number; // kobo
  is_active: boolean;
  effective_from: string; // ISO 8601
  created_by: string; // admin user id
  created_at: string;
  updated_at: string;
}

export interface ZonePricingRule {
  id: string;
  vehicle_type: "standard" | "premium" | "executive";
  city_id: string; // zone pricing always city-scoped
  origin_zone_id: string;
  destination_zone_id: string;
  flat_fare: number; // kobo
  is_symmetric: boolean; // true = same price A→B and B→A
  is_active: boolean;
  effective_from: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SurgeConfig {
  id: string;
  vehicle_type: "standard" | "premium" | "executive";
  city_id: string | null;
  multiplier: number; // e.g. 1.5 = 1.5× fare
  trigger_mode: "auto" | "manual";
  // auto trigger thresholds
  demand_ratio_threshold: number; // driver:rider ratio below which surge kicks in
  time_windows?: {
    // optional scheduled surge windows
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sun
    start_time: string; // "HH:MM"
    end_time: string;
  }[];
  is_active: boolean;
  manually_activated_by?: string;
  manually_activated_at?: string;
  created_at: string;
  updated_at: string;
}

export type VehicleType = "standard" | "premium" | "executive";

// ─── List filters ───────────────────────────────────────────────────────────

export interface MetricFilters {
  vehicle_type?: VehicleType;
  city_id?: string;
  is_active?: boolean;
}

export interface ZoneFilters {
  vehicle_type?: VehicleType;
  city_id?: string;
  is_active?: boolean;
}

export interface SurgeFilters {
  vehicle_type?: VehicleType;
  city_id?: string;
  is_active?: boolean;
}

export interface HistoryParams {
  page?: number;
  limit?: number;
  entity_type?: "metric" | "zone" | "surge";
}

export interface SimulateParams {
  pickup_lat: number;
  pickup_lng: number;
  dropoff_lat: number;
  dropoff_lng: number;
  vehicle_type: VehicleType;
  city_id: string;
}

// ─── Create / update payloads ───────────────────────────────────────────────

export type CreateMetricDto = Omit<MetricPricingRule, "id" | "is_active" | "created_by" | "created_at" | "updated_at">;

export type CreateZoneDto = Omit<ZonePricingRule, "id" | "is_active" | "created_by" | "created_at" | "updated_at">;

export type CreateSurgeDto = Omit<
  SurgeConfig,
  "id" | "is_active" | "manually_activated_by" | "manually_activated_at" | "created_at" | "updated_at"
>;

// ─── Audit log ───────────────────────────────────────────────────────────────

export interface PricingHistoryEntry {
  id: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "SURGE_TOGGLE";
  entity_type: "metric" | "zone" | "surge";
  entity_id: string;
  changed_by: { id: string; name: string };
  diff: Record<string, { before: unknown; after: unknown }>;
  created_at: string;
}

// ─── Fare simulation ─────────────────────────────────────────────────────────

export interface FareSimulationResult {
  metric: { base_fare: number; distance_charge: number; time_charge: number; total: number };
  zone: { flat_fare: number; zone_match: boolean };
  applied: "metric" | "zone";
  surge_multiplier: number;
  final_fare: number;
  formatted: string;
}
