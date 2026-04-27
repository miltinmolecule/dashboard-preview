import api from "@/lib/interceptor";
import type { ApiResponse } from "@/config/types/generic";

export type ZoneStatus = "active" | "inactive";

export interface Zone {
  id: string;
  name: string;
  regionId: string;
  status: ZoneStatus;
  surgeMultiplier?: number;
}

export interface ZonePayload {
  name: string;
  regionId: string;
  status: ZoneStatus;
  surgeMultiplier?: number;
}

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchZones = async (): Promise<Zone[]> => {
  const { data } = await api.get<ApiResponse<Zone[]>>(`${BASE}/zones`);
  return data.data;
};

export const createZone = async (payload: ZonePayload): Promise<Zone> => {
  const { data } = await api.post<ApiResponse<Zone>>(`${BASE}/zones`, payload);
  return data.data;
};

export const updateZone = async (id: string, payload: Partial<ZonePayload>): Promise<Zone> => {
  const { data } = await api.patch<ApiResponse<Zone>>(`${BASE}/zones/${id}`, payload);
  return data.data;
};

export const toggleZoneStatus = async (id: string, status: ZoneStatus): Promise<void> => {
  await api.patch(`${BASE}/zones/${id}/status`, { status });
};
