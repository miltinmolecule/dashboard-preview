export type RateeType = "driver" | "passenger";
export type RatingStatus = "active" | "flagged" | "removed";

export const VALID_STATUSES: RatingStatus[] = ["active", "flagged", "removed"];
export const VALID_RATEE_TYPES: RateeType[] = ["driver", "passenger"];
export const VALID_SCORES = [1, 2, 3, 4, 5] as const;

export interface Rating {
  id: string;
  booking_id: string;
  rater: { id: string; name: string; phone: string };
  ratee: { id: string; name: string; phone: string };
  ratee_type: RateeType;
  score: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  status: RatingStatus;
  flagged_reason?: string;
  admin_response?: string;
  created_at: string;
}

export interface RatingStats {
  ratee_id: string;
  ratee_type: RateeType;
  average: number;
  total: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  flagged_count: number;
  removed_count: number;
}

export interface ThresholdConfig {
  id: string;
  ratee_type: RateeType;
  threshold: number;
  min_ratings: number;
  notify_email: boolean;
  notify_dashboard: boolean;
  updated_at: string;
}

export interface RatingAlert {
  id: string;
  ratee_id: string;
  ratee_name: string;
  ratee_type: RateeType;
  current_average: number;
  threshold: number;
  rating_count: number;
  triggered_at: string;
  dismissed: boolean;
}

export interface RatingFilters {
  ratee_type?: RateeType;
  ratee_id?: string;
  status?: RatingStatus;
  score?: 1 | 2 | 3 | 4 | 5;
  page?: number;
  limit?: number;
}


export type ThresholdForm = Omit<ThresholdConfig, "id" | "updated_at">;

export type ActiveTab = "drivers" | "passengers" | "alerts" | "settings";