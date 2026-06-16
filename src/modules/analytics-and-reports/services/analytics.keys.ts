import type { AnalyticsFilters } from "../type/analytics";

export const analyticsKeys = {
  all:        () => ["analytics"] as const,
  rides:      (f: AnalyticsFilters) => ["analytics", "rides",      f] as const,
  revenue:    (f: AnalyticsFilters) => ["analytics", "revenue",    f] as const,
  drivers:    (f: AnalyticsFilters) => ["analytics", "drivers",    f] as const,
  passengers: (f: AnalyticsFilters) => ["analytics", "passengers", f] as const,
  surge:      (f: AnalyticsFilters) => ["analytics", "surge",      f] as const,
  reports:    (p?: object)          => ["analytics", "reports", p] as const,
  report:     (id: string)          => ["analytics", "report", id] as const,
};
