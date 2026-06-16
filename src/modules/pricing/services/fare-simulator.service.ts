import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse } from "@/config/types/generic";
import type { FareSimulationResult, SimulateParams } from "../type/pricing";

export const simulateFare = async (params: SimulateParams): Promise<FareSimulationResult> => {
  const { data } = await api.get<ApiResponse<FareSimulationResult>>(API_URLS.PRICING.SIMULATE, { params });
  return data.data;
};
