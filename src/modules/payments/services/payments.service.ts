import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";

export type PaymentStatus = "successful" | "failed" | "pending" | "refunded";
export type PaymentType = "card" | "transfer" | "wallet" | "cash";

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  driverId?: string;
  driverName?: string;
  amount: number;
  status: PaymentStatus;
  paymentType: PaymentType;
  description: string;
  reference: string;
  date: string;
  tripId?: string;
}

export interface Payout {
  id: string;
  driverId: string;
  driverName: string;
  amount: number;
  status: "pending" | "approved" | "paid" | "failed";
  requestedAt: string;
  processedAt?: string;
  bankName?: string;
  accountNumber?: string;
}

export interface PaymentFilters {
  search?: string;
  status?: string;
  paymentType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const fetchTransactions = async (filters: PaymentFilters): Promise<PaginatedResponse<Transaction>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<Transaction>>>(API_URLS.PAYMENTS.LIST, {
    params: filters,
  });
  return data.data;
};

export const fetchPayouts = async (filters: PaymentFilters): Promise<PaginatedResponse<Payout>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<Payout>>>(API_URLS.PAYMENTS.PAYOUTS, {
    params: filters,
  });
  return data.data;
};

export const fetchTransactionDetail = async (id: string): Promise<Transaction> => {
  const { data } = await api.get<ApiResponse<Transaction>>(API_URLS.PAYMENTS.DETAIL(id));
  return data.data;
};

export const refundTransaction = async (id: string): Promise<void> => {
  await api.post(API_URLS.PAYMENTS.REFUND(id));
};
