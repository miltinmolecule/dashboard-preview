import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTransactions,
  fetchPayouts,
  fetchTransactionDetail,
  refundTransaction,
  type PaymentFilters,
} from "../services/payments.service";

export const useTransactions = (filters: PaymentFilters) => {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => fetchTransactions(filters),
  });
};

export const usePayouts = (filters: PaymentFilters) => {
  return useQuery({
    queryKey: ["payouts", filters],
    queryFn: () => fetchPayouts(filters),
  });
};

export const useTransactionDetail = (id: string) => {
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => fetchTransactionDetail(id),
    enabled: !!id,
  });
};

export const useRefundTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: refundTransaction,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
};
