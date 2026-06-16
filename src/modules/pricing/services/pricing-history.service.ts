import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";
import type { HistoryParams, PricingHistoryEntry } from "../type/pricing";

export const fetchPricingHistory = async (
  params?: HistoryParams,
): Promise<PaginatedResponse<PricingHistoryEntry>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<PricingHistoryEntry>>>(API_URLS.PRICING.HISTORY, {
    params,
  });
  return data.data;
};
