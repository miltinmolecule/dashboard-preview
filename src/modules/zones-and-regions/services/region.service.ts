import api from "@/lib/interceptor";
import type { ApiResponse } from "@/config/types/generic";

export type RegionStatus = "active" | "inactive";

export interface Region {
  id: string;
  name: string;
  country: string;
  status: RegionStatus;
  createdAt: string;
}

export interface RegionPayload {
  name: string;
  country: string;
  status: RegionStatus;
}

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchRegions = async (): Promise<Region[]> => {
  const { data } = await api.get<ApiResponse<Region[]>>(`${BASE}/regions`);
  return data.data;
};

export const createRegion = async (payload: RegionPayload): Promise<Region> => {
  const { data } = await api.post<ApiResponse<Region>>(`${BASE}/regions`, payload);
  return data.data;
};

export const updateRegion = async (id: string, payload: Partial<RegionPayload>): Promise<Region> => {
  const { data } = await api.patch<ApiResponse<Region>>(`${BASE}/regions/${id}`, payload);
  return data.data;
};

export const toggleRegionStatus = async (id: string, status: RegionStatus): Promise<void> => {
  await api.patch(`${BASE}/regions/${id}/status`, { status });
};
