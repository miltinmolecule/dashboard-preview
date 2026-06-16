import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse } from "@/config/types/generic";
import { VALID_RATEE_TYPES, VALID_SCORES, VALID_STATUSES } from "../type/ratings";
import type { Rating, RatingAlert, RatingFilters, RatingStats, ThresholdConfig } from "../type/ratings";

export interface RatingsListResponse {
  ratings: Rating[];
  total: number;
  page: number;
  limit: number;
}

function sanitiseFilters(f?: RatingFilters): Record<string, unknown> {
  if (!f) return {};
  return {
    ...(f.ratee_type && VALID_RATEE_TYPES.includes(f.ratee_type) && { ratee_type: f.ratee_type }),
    ...(f.status && VALID_STATUSES.includes(f.status) && { status: f.status }),
    ...(f.score && (VALID_SCORES as readonly number[]).includes(f.score) && { score: f.score }),
    ...(f.ratee_id && { ratee_id: f.ratee_id }),
    page:  Math.max(1, Math.min(f.page  ?? 1,  10000)),
    limit: Math.max(1, Math.min(f.limit ?? 20, 100)),
  };
}

export const fetchRatings = async (filters?: RatingFilters): Promise<RatingsListResponse> => {
  const { data } = await api.get<RatingsListResponse>(API_URLS.RATINGS.LIST, {
    params: sanitiseFilters(filters),
  });
  return data;
};

export const flagRating = async (id: string, reason: string): Promise<Rating> => {
  const { data } = await api.patch<ApiResponse<Rating>>(API_URLS.RATINGS.FLAG(id), {
    reason: reason.trim().slice(0, 500),
  });
  return data.data;
};

export const removeRating = async (id: string): Promise<Rating> => {
  const { data } = await api.patch<ApiResponse<Rating>>(API_URLS.RATINGS.REMOVE(id));
  return data.data;
};

export const restoreRating = async (id: string): Promise<Rating> => {
  const { data } = await api.patch<ApiResponse<Rating>>(API_URLS.RATINGS.RESTORE(id));
  return data.data;
};

export const respondToRating = async (id: string, response: string): Promise<Rating> => {
  const { data } = await api.post<ApiResponse<Rating>>(API_URLS.RATINGS.RESPOND(id), {
    response: response.trim().slice(0, 1000),
  });
  return data.data;
};

export const fetchRatingStats = async (type: string, id: string): Promise<RatingStats> => {
  const { data } = await api.get<ApiResponse<RatingStats>>(API_URLS.RATINGS.STATS(type, id));
  return data.data;
};

export const fetchRatingAlerts = async (
  params?: { page?: number; limit?: number },
): Promise<{ alerts: RatingAlert[]; undismissed_count: number }> => {
  const { data } = await api.get<ApiResponse<{ alerts: RatingAlert[]; undismissed_count: number }>>(
    API_URLS.RATINGS.ALERTS,
    { params },
  );
  return data.data;
};

export const dismissAlert = async (id: string): Promise<void> => {
  await api.patch(API_URLS.RATINGS.ALERT_DISMISS(id));
};

export const fetchThresholds = async (): Promise<ThresholdConfig[]> => {
  const { data } = await api.get<ApiResponse<ThresholdConfig[]>>(API_URLS.RATINGS.THRESHOLDS);
  return data.data;
};

export const updateThreshold = async (
  id: string,
  body: Partial<ThresholdConfig>,
): Promise<ThresholdConfig> => {
  const { data } = await api.put<ApiResponse<ThresholdConfig>>(
    API_URLS.RATINGS.THRESHOLD_DETAIL(id),
    body,
  );
  return data.data;
};
