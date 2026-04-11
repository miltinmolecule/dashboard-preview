import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardStats,
  fetchTripsChart,
  fetchRevenueChart,
} from "../services/dashboard.service";
import type { TimeFilter } from "@/config/types/generic";

export const useDashboardStats = (filter: TimeFilter) => {
  return useQuery({
    queryKey: ["dashboard-stats", filter],
    queryFn: () => fetchDashboardStats(filter),
  });
};

export const useTripsChart = (filter: TimeFilter) => {
  return useQuery({
    queryKey: ["trips-chart", filter],
    queryFn: () => fetchTripsChart(filter),
  });
};

export const useRevenueChart = (filter: TimeFilter) => {
  return useQuery({
    queryKey: ["revenue-chart", filter],
    queryFn: () => fetchRevenueChart(filter),
  });
};
