export type VehicleType = "standard" | "premium" | "executive";
export type Granularity = "daily" | "weekly" | "monthly";
export type ReportType = "rides" | "revenue" | "drivers" | "passengers" | "surge";
export type ReportFormat = "csv" | "pdf";
export type ReportStatus = "pending" | "ready" | "failed";
export type AnalyticsTab = "rides" | "revenue" | "drivers" | "passengers" | "surge" | "reports";

export const VALID_VEHICLE_TYPES: VehicleType[] = ["standard", "premium", "executive"];
export const VALID_GRANULARITIES: Granularity[] = ["daily", "weekly", "monthly"];

export interface AnalyticsFilters {
  from: string;         // YYYY-MM-DD
  to: string;           // YYYY-MM-DD
  granularity?: Granularity;
  city_id?: string;
  vehicle_type?: VehicleType;
}

export interface RideSeries { date: string; total: number; completed: number; cancelled: number }
export interface RideStats {
  total: number;
  completed: number;
  cancelled: number;
  in_progress: number;
  series: RideSeries[];
}

export interface RevenueSeries { date: string; revenue: number; refunds: number }
export interface RevenueStats {
  total_revenue: number;
  average_fare: number;
  total_refunds: number;
  net_revenue: number;
  series: RevenueSeries[];
}

export interface DriverPerformance {
  total_drivers: number;
  active_drivers: number;
  avg_rating: number;
  avg_acceptance: number;
  top_drivers: { name: string; rides: number; rating: number }[];
}

export interface PassengerSeries { date: string; active: number; new: number }
export interface PassengerActivity {
  total_passengers: number;
  active_passengers: number;
  new_passengers: number;
  churn_rate: number;
  series: PassengerSeries[];
}

export interface SurgeSeries { date: string; events: number; avg_multiplier: number }
export interface SurgeAnalytics {
  surge_events: number;
  avg_multiplier: number;
  peak_multiplier: number;
  affected_rides: number;
  surge_revenue: number;
  series: SurgeSeries[];
}

export interface ReportMeta {
  id: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  download_url?: string;   // signed URL — 15-min TTL
  expires_at?: string;
  created_at: string;
}
