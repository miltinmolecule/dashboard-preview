import type { HistoryParams, MetricFilters, SimulateParams, SurgeFilters, ZoneFilters } from "../type/pricing";

export const pricingKeys = {
  all: () => ["pricing"] as const,
  metric: (filters?: MetricFilters) => ["pricing", "metric", filters] as const,
  zone: (filters?: ZoneFilters) => ["pricing", "zone", filters] as const,
  surge: (filters?: SurgeFilters) => ["pricing", "surge", filters] as const,
  history: (params?: HistoryParams) => ["pricing", "history", params] as const,
  simulate: (params: SimulateParams) => ["pricing", "simulate", params] as const,
};
