import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";

export type ReferralRewardType = "wallet_credit" | "free_ride" | "discount";
export type ReferralProgramStatus = "active" | "inactive";
export type ReferralActivityStatus = "pending" | "completed" | "rewarded" | "expired";

export interface ReferralProgram {
  id: string;
  name: string;
  referrerReward: number;
  refereeReward: number;
  rewardType: ReferralRewardType;
  minTripsRequired: number;
  status: ReferralProgramStatus;
  startDate: string;
  endDate?: string;
}

export interface ReferralProgramPayload {
  name: string;
  referrerReward: number;
  refereeReward: number;
  rewardType: ReferralRewardType;
  minTripsRequired: number;
  status: ReferralProgramStatus;
}

export interface ReferralActivity {
  id: string;
  referrerId: string;
  referrerName: string;
  refereeId: string;
  refereeName: string;
  status: ReferralActivityStatus;
  rewardAmount: number;
  date: string;
}

export interface ReferralActivityFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const fetchReferralProgram = async (): Promise<ReferralProgram> => {
  const { data } = await api.get<ApiResponse<ReferralProgram>>(API_URLS.PROMOTIONS.REFERRAL_PROGRAM);
  return data.data;
};

export const updateReferralProgram = async (
  payload: Partial<ReferralProgramPayload>,
): Promise<ReferralProgram> => {
  const { data } = await api.patch<ApiResponse<ReferralProgram>>(API_URLS.PROMOTIONS.REFERRAL_PROGRAM, payload);
  return data.data;
};

export const fetchReferralActivity = async (
  filters: ReferralActivityFilters,
): Promise<PaginatedResponse<ReferralActivity>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<ReferralActivity>>>(
    API_URLS.PROMOTIONS.REFERRAL_ACTIVITY,
    { params: filters },
  );
  return data.data;
};
