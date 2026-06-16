import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";
import {
  VALID_GRANULARITIES,
  VALID_VEHICLE_TYPES,
  type AnalyticsFilters,
  type DriverPerformance,
  type PassengerActivity,
  type ReportFormat,
  type ReportMeta,
  type ReportType,
  type RevenueStats,
  type RideStats,
  type SurgeAnalytics,
} from "../type/analytics";

function sanitiseFilters(f: AnalyticsFilters): Record<string, unknown> {
  const from = new Date(f.from);
  const to = new Date(f.to);
  if (isNaN(from.getTime()) || isNaN(to.getTime()) || from > to)
    throw new Error("Invalid date range");
  if ((to.getTime() - from.getTime()) / 86_400_000 > 365)
    throw new Error("Date range cannot exceed 365 days");
  return {
    from: f.from,
    to: f.to,
    ...(f.granularity  && VALID_GRANULARITIES.includes(f.granularity)   && { granularity:  f.granularity }),
    ...(f.vehicle_type && VALID_VEHICLE_TYPES.includes(f.vehicle_type)  && { vehicle_type: f.vehicle_type }),
    ...(f.city_id && { city_id: f.city_id }),
  };
}

export const fetchRideStats = async (f: AnalyticsFilters): Promise<RideStats> => {
  const { data } = await api.get<ApiResponse<RideStats>>(API_URLS.ANALYTICS.RIDES, { params: sanitiseFilters(f) });
  return data.data;
};

export const fetchRevenueStats = async (f: AnalyticsFilters): Promise<RevenueStats> => {
  const { data } = await api.get<ApiResponse<RevenueStats>>(API_URLS.ANALYTICS.REVENUE, { params: sanitiseFilters(f) });
  return data.data;
};

export const fetchDriverPerformance = async (f: AnalyticsFilters): Promise<DriverPerformance> => {
  const { data } = await api.get<ApiResponse<DriverPerformance>>(API_URLS.ANALYTICS.DRIVERS, { params: sanitiseFilters(f) });
  return data.data;
};

export const fetchPassengerActivity = async (f: AnalyticsFilters): Promise<PassengerActivity> => {
  const { data } = await api.get<ApiResponse<PassengerActivity>>(API_URLS.ANALYTICS.PASSENGERS, { params: sanitiseFilters(f) });
  return data.data;
};

export const fetchSurgeAnalytics = async (f: AnalyticsFilters): Promise<SurgeAnalytics> => {
  const { data } = await api.get<ApiResponse<SurgeAnalytics>>(API_URLS.ANALYTICS.SURGE, { params: sanitiseFilters(f) });
  return data.data;
};

export const requestReport = async (
  type: ReportType,
  format: ReportFormat,
  filters: AnalyticsFilters,
): Promise<ReportMeta> => {
  const { data } = await api.post<ApiResponse<ReportMeta>>(API_URLS.REPORTS.LIST, {
    type,
    format,
    filters: sanitiseFilters(filters),
  });
  return data.data;
};

export const fetchReports = async (page = 1, limit = 20): Promise<PaginatedResponse<ReportMeta>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<ReportMeta>>>(API_URLS.REPORTS.LIST, {
    params: { page: Math.min(page, 10_000), limit: Math.min(limit, 100) },
  });
  return data.data;
};

export const fetchReport = async (id: string): Promise<ReportMeta> => {
  const { data } = await api.get<ApiResponse<ReportMeta>>(API_URLS.REPORTS.DETAIL(id));
  return data.data;
};
