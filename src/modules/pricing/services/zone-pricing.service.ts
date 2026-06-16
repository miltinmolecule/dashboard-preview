import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";
import type { CreateZoneDto, ZoneFilters, ZonePricingRule } from "../type/pricing";

export const fetchZoneRules = async (filters?: ZoneFilters): Promise<PaginatedResponse<ZonePricingRule>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<ZonePricingRule>>>(API_URLS.PRICING.ZONE, {
    params: filters,
  });
  return data.data;
};

export const createZoneRule = async (payload: CreateZoneDto): Promise<ZonePricingRule> => {
  const { data } = await api.post<ApiResponse<ZonePricingRule>>(API_URLS.PRICING.ZONE, payload);
  return data.data;
};

export const updateZoneRule = async (id: string, payload: Partial<CreateZoneDto>): Promise<ZonePricingRule> => {
  const { data } = await api.put<ApiResponse<ZonePricingRule>>(API_URLS.PRICING.ZONE_DETAIL(id), payload);
  return data.data;
};

export const deleteZoneRule = async (id: string): Promise<void> => {
  await api.delete(API_URLS.PRICING.ZONE_DETAIL(id));
};
