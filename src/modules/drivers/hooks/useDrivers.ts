import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDrivers,
  fetchDriverDetail,
  approveDriver,
  rejectDriver,
  suspendDriver,
  reactivateDriver,
  bulkApproveDrivers,
  bulkSuspendDrivers,
  type DriverFilters,
} from "../services/drivers.service";

export const useDrivers = (filters: DriverFilters) => {
  return useQuery({
    queryKey: ["drivers", filters],
    queryFn: () => fetchDrivers(filters),
  });
};

export const useDriverDetail = (id: string) => {
  return useQuery({
    queryKey: ["driver", id],
    queryFn: () => fetchDriverDetail(id),
    enabled: !!id,
  });
};

export const useApproveDriver = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: approveDriver,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] }),
  });
};

export const useRejectDriver = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rejectDriver,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] }),
  });
};

export const useSuspendDriver = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: suspendDriver,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] }),
  });
};

export const useReactivateDriver = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reactivateDriver,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] }),
  });
};

export const useBulkApproveDrivers = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bulkApproveDrivers,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] }),
  });
};

export const useBulkSuspendDrivers = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bulkSuspendDrivers,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] }),
  });
};
