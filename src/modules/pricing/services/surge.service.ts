import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";
import type { CreateSurgeDto, SurgeConfig, SurgeFilters } from "../type/pricing";

export const fetchSurgeConfigs = async (filters?: SurgeFilters): Promise<PaginatedResponse<SurgeConfig>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<SurgeConfig>>>(API_URLS.PRICING.SURGE, {
    params: filters,
  });
  return data.data;
};

export const createSurgeConfig = async (payload: CreateSurgeDto): Promise<SurgeConfig> => {
  const { data } = await api.post<ApiResponse<SurgeConfig>>(API_URLS.PRICING.SURGE, payload);
  return data.data;
};

export const updateSurgeConfig = async (id: string, payload: Partial<CreateSurgeDto>): Promise<SurgeConfig> => {
  const { data } = await api.put<ApiResponse<SurgeConfig>>(API_URLS.PRICING.SURGE_DETAIL(id), payload);
  return data.data;
};

export const toggleSurge = async (id: string, is_active: boolean): Promise<SurgeConfig> => {
  const { data } = await api.patch<ApiResponse<SurgeConfig>>(API_URLS.PRICING.SURGE_TOGGLE(id), { is_active });
  return data.data;
};
