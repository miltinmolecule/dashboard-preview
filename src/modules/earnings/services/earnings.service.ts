import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";

export interface DriverEarning {
  id: string;
  driverId: string;
  driverName: string;
  totalTrips: number;
  grossEarnings: number;
  commissionRate: number;
  commission: number;
  netEarnings: number;
  pendingPayout: number;
  lastPayoutDate?: string;
  period: string;
}

export interface EarningsSummary {
  totalGrossEarnings: number;
  totalCommission: number;
  totalNetEarnings: number;
  totalPendingPayouts: number;
}

export interface EarningsFilters {
  search?: string;
  period?: string;
  page?: number;
  limit?: number;
}

export const fetchDriverEarnings = async (filters: EarningsFilters): Promise<PaginatedResponse<DriverEarning>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<DriverEarning>>>(API_URLS.EARNINGS.DRIVERS, {
    params: filters,
  });
  return data.data;
};

export const fetchEarningsSummary = async (filters: EarningsFilters): Promise<EarningsSummary> => {
  const { data } = await api.get<ApiResponse<EarningsSummary>>(API_URLS.EARNINGS.SUMMARY, {
    params: filters,
  });
  return data.data;
};

export const fetchDriverEarningDetail = async (id: string): Promise<DriverEarning> => {
  const { data } = await api.get<ApiResponse<DriverEarning>>(API_URLS.EARNINGS.DRIVER_DETAIL(id));
  return data.data;
};
