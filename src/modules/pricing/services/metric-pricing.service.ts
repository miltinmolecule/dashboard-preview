import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";
import type { CreateMetricDto, MetricFilters, MetricPricingRule } from "../type/pricing";

export const fetchMetricRules = async (filters?: MetricFilters): Promise<PaginatedResponse<MetricPricingRule>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<MetricPricingRule>>>(API_URLS.PRICING.METRIC, {
    params: filters,
  });
  return data.data;
};

export const createMetricRule = async (payload: CreateMetricDto): Promise<MetricPricingRule> => {
  const { data } = await api.post<ApiResponse<MetricPricingRule>>(API_URLS.PRICING.METRIC, payload);
  return data.data;
};

export const updateMetricRule = async (
  id: string,
  payload: Partial<CreateMetricDto>,
): Promise<MetricPricingRule> => {
  const { data } = await api.put<ApiResponse<MetricPricingRule>>(API_URLS.PRICING.METRIC_DETAIL(id), payload);
  return data.data;
};

export const deleteMetricRule = async (id: string): Promise<void> => {
  await api.delete(API_URLS.PRICING.METRIC_DETAIL(id));
};
