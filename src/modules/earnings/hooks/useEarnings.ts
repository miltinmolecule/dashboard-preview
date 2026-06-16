import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDriverEarnings,
  fetchEarningsSummary,
  fetchDriverEarningDetail,
  type EarningsFilters,
} from "../services/earnings.service";
import {
  fetchPayouts,
  fetchPayoutDetail,
  approvePayout,
  processPayout,
  markPayoutPaid,
  bulkApprovePayouts,
  type PayoutFilters,
} from "../services/payout.service";

export const useDriverEarnings = (filters: EarningsFilters) => {
  return useQuery({
    queryKey: ["driver-earnings", filters],
    queryFn: () => fetchDriverEarnings(filters),
  });
};

export const useEarningsSummary = (filters: EarningsFilters) => {
  return useQuery({
    queryKey: ["earnings-summary", filters],
    queryFn: () => fetchEarningsSummary(filters),
  });
};

export const useDriverEarningDetail = (id: string) => {
  return useQuery({
    queryKey: ["driver-earning", id],
    queryFn: () => fetchDriverEarningDetail(id),
    enabled: !!id,
  });
};

export const usePayouts = (filters: PayoutFilters) => {
  return useQuery({
    queryKey: ["payouts", filters],
    queryFn: () => fetchPayouts(filters),
  });
};

export const usePayoutDetail = (id: string) => {
  return useQuery({
    queryKey: ["payout", id],
    queryFn: () => fetchPayoutDetail(id),
    enabled: !!id,
  });
};

export const useApprovePayout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: approvePayout,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payouts"] }),
  });
};

export const useProcessPayout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: processPayout,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payouts"] }),
  });
};

export const useMarkPayoutPaid = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markPayoutPaid,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payouts"] }),
  });
};

export const useBulkApprovePayouts = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bulkApprovePayouts,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payouts"] }),
  });
};
