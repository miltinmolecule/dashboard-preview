import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";

export type PromotionType = "percentage" | "fixed_amount" | "free_ride";
export type PromotionStatus = "active" | "scheduled" | "paused" | "expired" | "draft";
export type PromotionAudience = "all_users" | "new_users" | "drivers" | "specific_zone";

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: PromotionType;
  value: number;
  audience: PromotionAudience;
  zone?: string;
  status: PromotionStatus;
  startDate: string;
  endDate: string;
  usageCount: number;
  usageLimit?: number;
  totalDiscountGiven: number;
}

export interface PromotionPayload {
  name: string;
  description: string;
  type: PromotionType;
  value: number;
  audience: PromotionAudience;
  zone?: string;
  startDate: string;
  endDate: string;
  usageLimit?: number;
}

export interface PromotionFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const fetchPromotions = async (filters: PromotionFilters): Promise<PaginatedResponse<Promotion>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<Promotion>>>(API_URLS.PROMOTIONS.LIST, {
    params: filters,
  });
  return data.data;
};

export const fetchPromotionDetail = async (id: string): Promise<Promotion> => {
  const { data } = await api.get<ApiResponse<Promotion>>(API_URLS.PROMOTIONS.DETAIL(id));
  return data.data;
};

export const createPromotion = async (payload: PromotionPayload): Promise<Promotion> => {
  const { data } = await api.post<ApiResponse<Promotion>>(API_URLS.PROMOTIONS.LIST, payload);
  return data.data;
};

export const updatePromotion = async (id: string, payload: Partial<PromotionPayload>): Promise<Promotion> => {
  const { data } = await api.patch<ApiResponse<Promotion>>(API_URLS.PROMOTIONS.DETAIL(id), payload);
  return data.data;
};

export const updatePromotionStatus = async (id: string, status: PromotionStatus): Promise<void> => {
  await api.patch(API_URLS.PROMOTIONS.STATUS(id), { status });
};

export const deletePromotion = async (id: string): Promise<void> => {
  await api.delete(API_URLS.PROMOTIONS.DETAIL(id));
};
