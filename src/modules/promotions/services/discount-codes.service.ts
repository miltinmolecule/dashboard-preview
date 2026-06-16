import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";

export type DiscountType = "percentage" | "fixed_amount";
export type DiscountCodeStatus = "active" | "inactive" | "expired";

export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  type: DiscountType;
  value: number;
  maxDiscount?: number;
  minTripAmount?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  status: DiscountCodeStatus;
  expiresAt: string;
  createdAt: string;
}

export interface DiscountCodePayload {
  code: string;
  description: string;
  type: DiscountType;
  value: number;
  maxDiscount?: number;
  minTripAmount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  expiresAt: string;
}

export interface DiscountCodeFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const fetchDiscountCodes = async (filters: DiscountCodeFilters): Promise<PaginatedResponse<DiscountCode>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<DiscountCode>>>(API_URLS.PROMOTIONS.DISCOUNT_CODES, {
    params: filters,
  });
  return data.data;
};

export const createDiscountCode = async (payload: DiscountCodePayload): Promise<DiscountCode> => {
  const { data } = await api.post<ApiResponse<DiscountCode>>(API_URLS.PROMOTIONS.DISCOUNT_CODES, payload);
  return data.data;
};

export const updateDiscountCode = async (id: string, payload: Partial<DiscountCodePayload>): Promise<DiscountCode> => {
  const { data } = await api.patch<ApiResponse<DiscountCode>>(API_URLS.PROMOTIONS.DISCOUNT_CODE_DETAIL(id), payload);
  return data.data;
};

export const updateDiscountCodeStatus = async (id: string, status: DiscountCodeStatus): Promise<void> => {
  await api.patch(API_URLS.PROMOTIONS.DISCOUNT_CODE_STATUS(id), { status });
};

export const deleteDiscountCode = async (id: string): Promise<void> => {
  await api.delete(API_URLS.PROMOTIONS.DISCOUNT_CODE_DETAIL(id));
};
