import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "@/config/types/generic";
import {
  MOCK_DRIVER_PERFORMANCE,
  MOCK_PASSENGER_ACTIVITY,
  MOCK_REPORTS,
  MOCK_REVENUE_STATS,
  MOCK_RIDE_STATS,
  MOCK_SURGE_ANALYTICS,
} from "../data/mock";
import { analyticsKeys } from "../services/analytics.keys";
import {
  fetchDriverPerformance,
  fetchPassengerActivity,
  fetchReport,
  fetchReports,
  fetchRevenueStats,
  fetchRideStats,
  fetchSurgeAnalytics,
  requestReport,
} from "../services/analytics.service";
import type {
  AnalyticsFilters,
  ReportFormat,
  ReportMeta,
  ReportType,
} from "../type/analytics";

const STALE_5MIN = 5 * 60 * 1000;

export function useRideStats(filters: AnalyticsFilters) {
  const q = useQuery({
    queryKey:        analyticsKeys.rides(filters),
    queryFn:         () => fetchRideStats(filters),
    staleTime:       STALE_5MIN,
    enabled:         !!filters.from && !!filters.to,
    placeholderData: MOCK_RIDE_STATS,
    retry:           1,
  });
  return { ...q, data: q.data ?? MOCK_RIDE_STATS };
}

export function useRevenueStats(filters: AnalyticsFilters) {
  const q = useQuery({
    queryKey:        analyticsKeys.revenue(filters),
    queryFn:         () => fetchRevenueStats(filters),
    staleTime:       STALE_5MIN,
    enabled:         !!filters.from && !!filters.to,
    placeholderData: MOCK_REVENUE_STATS,
    retry:           1,
  });
  return { ...q, data: q.data ?? MOCK_REVENUE_STATS };
}

export function useDriverPerformance(filters: AnalyticsFilters) {
  const q = useQuery({
    queryKey:        analyticsKeys.drivers(filters),
    queryFn:         () => fetchDriverPerformance(filters),
    staleTime:       STALE_5MIN,
    enabled:         !!filters.from && !!filters.to,
    placeholderData: MOCK_DRIVER_PERFORMANCE,
    retry:           1,
  });
  return { ...q, data: q.data ?? MOCK_DRIVER_PERFORMANCE };
}

export function usePassengerActivity(filters: AnalyticsFilters) {
  const q = useQuery({
    queryKey:        analyticsKeys.passengers(filters),
    queryFn:         () => fetchPassengerActivity(filters),
    staleTime:       STALE_5MIN,
    enabled:         !!filters.from && !!filters.to,
    placeholderData: MOCK_PASSENGER_ACTIVITY,
    retry:           1,
  });
  return { ...q, data: q.data ?? MOCK_PASSENGER_ACTIVITY };
}

export function useSurgeAnalytics(filters: AnalyticsFilters) {
  const q = useQuery({
    queryKey:        analyticsKeys.surge(filters),
    queryFn:         () => fetchSurgeAnalytics(filters),
    staleTime:       STALE_5MIN,
    enabled:         !!filters.from && !!filters.to,
    placeholderData: MOCK_SURGE_ANALYTICS,
    retry:           1,
  });
  return { ...q, data: q.data ?? MOCK_SURGE_ANALYTICS };
}

export function useReports() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: analyticsKeys.reports(),
    queryFn:  () => fetchReports(),
    select:   (d) => d.data,
    refetchInterval: (query) => {
      const raw = query.state.data as PaginatedResponse<ReportMeta> | undefined;
      return raw?.data?.some((r) => r.status === "pending") ? 5000 : false;
    },
    retry: 1,
  });

  const request = useMutation({
    mutationFn: ({ type, format, filters }: { type: ReportType; format: ReportFormat; filters: AnalyticsFilters }) =>
      requestReport(type, format, filters),
    onSuccess: () => qc.invalidateQueries({ queryKey: analyticsKeys.reports() }),
  });

  return {
    reports:   list.data ?? MOCK_REPORTS,
    isLoading: list.isLoading,
    request,
  };
}

export function useReport(id: string) {
  return useQuery({
    queryKey: analyticsKeys.report(id),
    queryFn:  () => fetchReport(id),
    enabled:  !!id,
  });
}
