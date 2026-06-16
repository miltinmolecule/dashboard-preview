import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";

export type PayoutStatus = "pending" | "approved" | "processing" | "paid" | "failed";

export interface Payout {
  id: string;
  driverId: string;
  driverName: string;
  amount: number;
  status: PayoutStatus;
  period: string;
  requestedAt: string;
  processedAt?: string;
  bankName?: string;
  accountNumber?: string;
}

export interface PayoutFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const fetchPayouts = async (filters: PayoutFilters): Promise<PaginatedResponse<Payout>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<Payout>>>(API_URLS.EARNINGS.PAYOUTS, {
    params: filters,
  });
  return data.data;
};

export const fetchPayoutDetail = async (id: string): Promise<Payout> => {
  const { data } = await api.get<ApiResponse<Payout>>(API_URLS.EARNINGS.PAYOUT_DETAIL(id));
  return data.data;
};

export const approvePayout = async (id: string): Promise<void> => {
  await api.post(API_URLS.EARNINGS.PAYOUT_APPROVE(id));
};

export const processPayout = async (id: string): Promise<void> => {
  await api.post(API_URLS.EARNINGS.PAYOUT_PROCESS(id));
};

export const markPayoutPaid = async (id: string): Promise<void> => {
  await api.post(API_URLS.EARNINGS.PAYOUT_MARK_PAID(id));
};

export const bulkApprovePayouts = async (ids: string[]): Promise<void> => {
  await api.post(API_URLS.EARNINGS.PAYOUT_BULK_APPROVE, { ids });
};
