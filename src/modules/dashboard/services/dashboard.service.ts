import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse } from "@/config/types/generic";

export interface DashboardStats {
  totalUsers: number;
  totalDrivers: number;
  activeRides: number;
  completedRides: number;
  cancelledRides: number;
  totalRevenue: number;
  pendingKyc: number;
  onlineDrivers: number;
  activeIncidents: number;
  userGrowth: number;
  driverGrowth: number;
  revenueGrowth: number;
  ridesGrowth: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface TripsChartData {
  completed: ChartDataPoint[];
  cancelled: ChartDataPoint[];
}

export const fetchDashboardStats = async (filter: string): Promise<DashboardStats> => {
  const { data } = await api.get<ApiResponse<DashboardStats>>(API_URLS.DASHBOARD.STATS, {
    params: { filter },
  });
  return data.data;
};

export const fetchTripsChart = async (filter: string): Promise<TripsChartData> => {
  const { data } = await api.get<ApiResponse<TripsChartData>>(API_URLS.DASHBOARD.TRIPS_CHART, {
    params: { filter },
  });
  return data.data;
};

export const fetchRevenueChart = async (filter: string): Promise<ChartDataPoint[]> => {
  const { data } = await api.get<ApiResponse<ChartDataPoint[]>>(API_URLS.DASHBOARD.REVENUE_CHART, {
    params: { filter },
  });
  return data.data;
};
