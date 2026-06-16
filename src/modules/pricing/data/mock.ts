import type {
  MetricPricingRule,
  PricingHistoryEntry,
  SurgeConfig,
  VehicleType,
  ZonePricingRule,
} from "../type/pricing";

// ─── Reference data (cross-referenced with zones-and-regions module) ──────────

export interface PricingCity {
  id: string;
  name: string;
  country: string;
}

export const CITIES: PricingCity[] = [
  { id: "reg_001", name: "Lagos", country: "Nigeria" },
  { id: "reg_002", name: "Abuja", country: "Nigeria" },
  { id: "reg_003", name: "Accra", country: "Ghana" },
  { id: "reg_004", name: "Nairobi", country: "Kenya" },
  { id: "reg_007", name: "Ibadan", country: "Nigeria" },
];

export interface PricingZone {
  id: string;
  name: string;
  city_id: string;
}

export const ZONES: PricingZone[] = [
  { id: "zon_001", name: "Victoria Island", city_id: "reg_001" },
  { id: "zon_002", name: "Lekki Phase 1", city_id: "reg_001" },
  { id: "zon_003", name: "Surulere", city_id: "reg_001" },
  { id: "zon_004", name: "Ikeja", city_id: "reg_001" },
  { id: "zon_005", name: "Maitama", city_id: "reg_002" },
  { id: "zon_006", name: "Wuse II", city_id: "reg_002" },
  { id: "zon_007", name: "Gwarinpa", city_id: "reg_002" },
  { id: "zon_008", name: "Airport Ridge", city_id: "reg_003" },
  { id: "zon_009", name: "Osu", city_id: "reg_003" },
  { id: "zon_010", name: "Westlands", city_id: "reg_004" },
  { id: "zon_011", name: "Karen", city_id: "reg_004" },
  { id: "zon_012", name: "CBD Ibadan", city_id: "reg_007" },
];

export const cityName = (id: string | null): string => {
  if (!id) return "All Cities";
  return CITIES.find((c) => c.id === id)?.name ?? id;
};

export const zoneName = (id: string): string => ZONES.find((z) => z.id === id)?.name ?? id;

export const VEHICLE_TYPES: VehicleType[] = ["standard", "premium", "executive"];

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  standard: "Standard",
  premium: "Premium",
  executive: "Executive",
};

// ─── ID generators ──────────────────────────────────────────────────────────

export const genMetricId = (): string => `mtr_${Date.now().toString(36)}`;
export const genZoneRuleId = (): string => `zpr_${Date.now().toString(36)}`;
export const genSurgeId = (): string => `srg_${Date.now().toString(36)}`;

// ─── Metric pricing rules ───────────────────────────────────────────────────

export const MOCK_METRIC_RULES: MetricPricingRule[] = [
  {
    id: "mtr_001",
    vehicle_type: "standard",
    city_id: "reg_001",
    base_fare: 150_000,
    per_km: 15_000,
    per_minute: 5_000,
    min_fare: 100_000,
    cancellation_fee: 50_000,
    is_active: true,
    effective_from: "2026-01-01T00:00:00Z",
    created_by: "adm_001",
    created_at: "2025-12-15T09:00:00Z",
    updated_at: "2026-04-01T10:00:00Z",
  },
  {
    id: "mtr_002",
    vehicle_type: "premium",
    city_id: "reg_001",
    base_fare: 250_000,
    per_km: 25_000,
    per_minute: 8_000,
    min_fare: 180_000,
    cancellation_fee: 100_000,
    is_active: true,
    effective_from: "2026-01-01T00:00:00Z",
    created_by: "adm_001",
    created_at: "2025-12-15T09:05:00Z",
    updated_at: "2025-12-15T09:05:00Z",
  },
  {
    id: "mtr_003",
    vehicle_type: "executive",
    city_id: "reg_001",
    base_fare: 400_000,
    per_km: 40_000,
    per_minute: 12_000,
    min_fare: 300_000,
    cancellation_fee: 150_000,
    is_active: true,
    effective_from: "2026-01-01T00:00:00Z",
    created_by: "adm_001",
    created_at: "2025-12-15T09:10:00Z",
    updated_at: "2025-12-15T09:10:00Z",
  },
  {
    id: "mtr_004",
    vehicle_type: "standard",
    city_id: "reg_002",
    base_fare: 130_000,
    per_km: 13_000,
    per_minute: 4_500,
    min_fare: 90_000,
    cancellation_fee: 40_000,
    is_active: true,
    effective_from: "2026-01-01T00:00:00Z",
    created_by: "adm_002",
    created_at: "2025-12-20T11:00:00Z",
    updated_at: "2025-12-20T11:00:00Z",
  },
  {
    id: "mtr_005",
    vehicle_type: "premium",
    city_id: "reg_002",
    base_fare: 220_000,
    per_km: 22_000,
    per_minute: 7_000,
    min_fare: 160_000,
    cancellation_fee: 80_000,
    is_active: true,
    effective_from: "2026-01-01T00:00:00Z",
    created_by: "adm_002",
    created_at: "2025-12-20T11:05:00Z",
    updated_at: "2025-12-20T11:05:00Z",
  },
  {
    id: "mtr_006",
    vehicle_type: "standard",
    city_id: null,
    base_fare: 140_000,
    per_km: 14_000,
    per_minute: 5_000,
    min_fare: 95_000,
    cancellation_fee: 45_000,
    is_active: true,
    effective_from: "2025-12-01T00:00:00Z",
    created_by: "adm_001",
    created_at: "2025-12-01T08:00:00Z",
    updated_at: "2025-12-01T08:00:00Z",
  },
  {
    id: "mtr_007",
    vehicle_type: "executive",
    city_id: "reg_003",
    base_fare: 380_000,
    per_km: 38_000,
    per_minute: 11_000,
    min_fare: 280_000,
    cancellation_fee: 140_000,
    is_active: false,
    effective_from: "2026-07-01T00:00:00Z",
    created_by: "adm_003",
    created_at: "2026-05-20T14:00:00Z",
    updated_at: "2026-05-20T14:00:00Z",
  },
  {
    id: "mtr_008",
    vehicle_type: "premium",
    city_id: "reg_004",
    base_fare: 230_000,
    per_km: 23_000,
    per_minute: 7_500,
    min_fare: 165_000,
    cancellation_fee: 85_000,
    is_active: true,
    effective_from: "2026-03-01T00:00:00Z",
    created_by: "adm_002",
    created_at: "2026-02-25T10:00:00Z",
    updated_at: "2026-02-25T10:00:00Z",
  },
];

// ─── Zone pricing rules ──────────────────────────────────────────────────────

export const MOCK_ZONE_RULES: ZonePricingRule[] = [
  {
    id: "zpr_001",
    vehicle_type: "standard",
    city_id: "reg_001",
    origin_zone_id: "zon_001",
    destination_zone_id: "zon_002",
    flat_fare: 200_000,
    is_symmetric: true,
    is_active: true,
    effective_from: "2026-01-15T00:00:00Z",
    created_by: "adm_001",
    created_at: "2026-01-10T09:00:00Z",
    updated_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "zpr_002",
    vehicle_type: "premium",
    city_id: "reg_001",
    origin_zone_id: "zon_001",
    destination_zone_id: "zon_002",
    flat_fare: 320_000,
    is_symmetric: true,
    is_active: true,
    effective_from: "2026-01-15T00:00:00Z",
    created_by: "adm_001",
    created_at: "2026-01-10T09:05:00Z",
    updated_at: "2026-01-10T09:05:00Z",
  },
  {
    id: "zpr_003",
    vehicle_type: "standard",
    city_id: "reg_001",
    origin_zone_id: "zon_004",
    destination_zone_id: "zon_001",
    flat_fare: 350_000,
    is_symmetric: true,
    is_active: true,
    effective_from: "2026-02-01T00:00:00Z",
    created_by: "adm_001",
    created_at: "2026-01-28T12:00:00Z",
    updated_at: "2026-01-28T12:00:00Z",
  },
  {
    id: "zpr_004",
    vehicle_type: "standard",
    city_id: "reg_002",
    origin_zone_id: "zon_005",
    destination_zone_id: "zon_006",
    flat_fare: 180_000,
    is_symmetric: false,
    is_active: true,
    effective_from: "2026-02-01T00:00:00Z",
    created_by: "adm_002",
    created_at: "2026-01-30T09:00:00Z",
    updated_at: "2026-01-30T09:00:00Z",
  },
  {
    id: "zpr_005",
    vehicle_type: "executive",
    city_id: "reg_001",
    origin_zone_id: "zon_001",
    destination_zone_id: "zon_004",
    flat_fare: 600_000,
    is_symmetric: true,
    is_active: true,
    effective_from: "2026-03-01T00:00:00Z",
    created_by: "adm_001",
    created_at: "2026-02-25T15:00:00Z",
    updated_at: "2026-02-25T15:00:00Z",
  },
  {
    id: "zpr_006",
    vehicle_type: "standard",
    city_id: "reg_003",
    origin_zone_id: "zon_008",
    destination_zone_id: "zon_009",
    flat_fare: 250_000,
    is_symmetric: true,
    is_active: false,
    effective_from: "2026-01-01T00:00:00Z",
    created_by: "adm_003",
    created_at: "2025-12-28T10:00:00Z",
    updated_at: "2026-04-10T16:00:00Z",
  },
];

// ─── Surge configs ───────────────────────────────────────────────────────────

export const MOCK_SURGE_CONFIGS: SurgeConfig[] = [
  {
    id: "srg_001",
    vehicle_type: "standard",
    city_id: "reg_001",
    multiplier: 1.5,
    trigger_mode: "manual",
    demand_ratio_threshold: 0.3,
    is_active: true,
    manually_activated_by: "Fatima Bello",
    manually_activated_at: "2026-06-10T17:30:00Z",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-06-10T17:30:00Z",
  },
  {
    id: "srg_002",
    vehicle_type: "premium",
    city_id: "reg_001",
    multiplier: 1.8,
    trigger_mode: "auto",
    demand_ratio_threshold: 0.25,
    time_windows: [
      { day: 5, start_time: "17:00", end_time: "21:00" },
      { day: 6, start_time: "17:00", end_time: "21:00" },
    ],
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-06-11T08:00:00Z",
  },
  {
    id: "srg_003",
    vehicle_type: "standard",
    city_id: "reg_002",
    multiplier: 1.3,
    trigger_mode: "auto",
    demand_ratio_threshold: 0.35,
    is_active: false,
    created_at: "2026-01-05T00:00:00Z",
    updated_at: "2026-06-09T12:00:00Z",
  },
  {
    id: "srg_004",
    vehicle_type: "executive",
    city_id: "reg_001",
    multiplier: 2.0,
    trigger_mode: "manual",
    demand_ratio_threshold: 0.2,
    is_active: false,
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-05-30T09:00:00Z",
  },
  {
    id: "srg_005",
    vehicle_type: "standard",
    city_id: "reg_004",
    multiplier: 1.4,
    trigger_mode: "auto",
    demand_ratio_threshold: 0.3,
    is_active: true,
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-06-11T07:00:00Z",
  },
  {
    id: "srg_006",
    vehicle_type: "premium",
    city_id: null,
    multiplier: 1.6,
    trigger_mode: "manual",
    demand_ratio_threshold: 0.25,
    is_active: false,
    created_at: "2026-01-10T00:00:00Z",
    updated_at: "2026-04-15T10:00:00Z",
  },
];

// ─── Pricing history / audit log ────────────────────────────────────────────

export const MOCK_HISTORY: PricingHistoryEntry[] = [
  {
    id: "log_010",
    action: "UPDATE",
    entity_type: "surge",
    entity_id: "srg_002",
    changed_by: { id: "adm_001", name: "Fatima Bello" },
    diff: { demand_ratio_threshold: { before: 0.3, after: 0.25 } },
    created_at: "2026-06-11T08:00:00Z",
  },
  {
    id: "log_009",
    action: "SURGE_TOGGLE",
    entity_type: "surge",
    entity_id: "srg_001",
    changed_by: { id: "adm_002", name: "Ngozi Eze" },
    diff: { is_active: { before: false, after: true } },
    created_at: "2026-06-10T17:30:00Z",
  },
  {
    id: "log_008",
    action: "SURGE_TOGGLE",
    entity_type: "surge",
    entity_id: "srg_003",
    changed_by: { id: "adm_002", name: "Ngozi Eze" },
    diff: { is_active: { before: true, after: false } },
    created_at: "2026-06-09T12:00:00Z",
  },
  {
    id: "log_007",
    action: "UPDATE",
    entity_type: "metric",
    entity_id: "mtr_001",
    changed_by: { id: "adm_001", name: "Fatima Bello" },
    diff: { per_km: { before: 13_000, after: 15_000 } },
    created_at: "2026-04-01T10:00:00Z",
  },
  {
    id: "log_006",
    action: "DELETE",
    entity_type: "zone",
    entity_id: "zpr_006",
    changed_by: { id: "adm_003", name: "Kelechi Obi" },
    diff: { is_active: { before: true, after: false } },
    created_at: "2026-04-10T16:00:00Z",
  },
  {
    id: "log_005",
    action: "CREATE",
    entity_type: "metric",
    entity_id: "mtr_007",
    changed_by: { id: "adm_003", name: "Kelechi Obi" },
    diff: {},
    created_at: "2026-05-20T14:00:00Z",
  },
  {
    id: "log_004",
    action: "UPDATE",
    entity_type: "metric",
    entity_id: "mtr_008",
    changed_by: { id: "adm_002", name: "Ngozi Eze" },
    diff: { base_fare: { before: 210_000, after: 230_000 }, per_km: { before: 21_000, after: 23_000 } },
    created_at: "2026-02-25T10:00:00Z",
  },
  {
    id: "log_003",
    action: "UPDATE",
    entity_type: "zone",
    entity_id: "zpr_004",
    changed_by: { id: "adm_001", name: "Fatima Bello" },
    diff: { flat_fare: { before: 160_000, after: 180_000 } },
    created_at: "2026-01-30T09:00:00Z",
  },
  {
    id: "log_002",
    action: "CREATE",
    entity_type: "zone",
    entity_id: "zpr_001",
    changed_by: { id: "adm_001", name: "Fatima Bello" },
    diff: {},
    created_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "log_001",
    action: "CREATE",
    entity_type: "metric",
    entity_id: "mtr_001",
    changed_by: { id: "adm_001", name: "Fatima Bello" },
    diff: {},
    created_at: "2025-12-15T09:00:00Z",
  },
];
