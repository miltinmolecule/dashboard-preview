import type {
  DriverPerformance,
  PassengerActivity,
  ReportMeta,
  RevenueStats,
  RideStats,
  SurgeAnalytics,
} from "../type/analytics";

// Generates a date series starting from N days ago
function dateSeries(days: number): string[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().split("T")[0];
  });
}

const DATES = dateSeries(30);

export const MOCK_RIDE_STATS: RideStats = {
  total:       14_820,
  completed:   12_944,
  cancelled:   1_456,
  in_progress: 420,
  series: DATES.map((date, i) => ({
    date,
    total:     420 + Math.round(Math.sin(i * 0.4) * 80 + Math.random() * 60),
    completed: 370 + Math.round(Math.sin(i * 0.4) * 70 + Math.random() * 50),
    cancelled: 48  + Math.round(Math.random() * 20),
  })),
};

export const MOCK_REVENUE_STATS: RevenueStats = {
  total_revenue:  2_148_500_000,
  average_fare:   145_000,
  total_refunds:  52_400_000,
  net_revenue:    2_096_100_000,
  series: DATES.map((date, i) => ({
    date,
    revenue: 64_000_000 + Math.round(Math.sin(i * 0.35) * 12_000_000 + Math.random() * 8_000_000),
    refunds:  1_600_000 + Math.round(Math.random() * 800_000),
  })),
};

export const MOCK_DRIVER_PERFORMANCE: DriverPerformance = {
  total_drivers:  5_834,
  active_drivers: 1_204,
  avg_rating:     4.38,
  avg_acceptance: 0.82,
  top_drivers: [
    { name: "Emeka O.",   rides: 412, rating: 4.97 },
    { name: "Fatima B.",  rides: 389, rating: 4.95 },
    { name: "Kelechi A.", rides: 374, rating: 4.93 },
    { name: "Ngozi E.",   rides: 361, rating: 4.91 },
    { name: "Tunde A.",   rides: 348, rating: 4.90 },
    { name: "Amaka O.",   rides: 327, rating: 4.88 },
    { name: "Bola A.",    rides: 315, rating: 4.87 },
    { name: "Chidi N.",   rides: 302, rating: 4.86 },
  ],
};

export const MOCK_PASSENGER_ACTIVITY: PassengerActivity = {
  total_passengers:  48_291,
  active_passengers: 9_740,
  new_passengers:    1_832,
  churn_rate:        0.184,
  series: DATES.map((date, i) => ({
    date,
    active: 300 + Math.round(Math.sin(i * 0.3) * 60 + Math.random() * 40),
    new:    55  + Math.round(Math.random() * 30),
  })),
};

export const MOCK_SURGE_ANALYTICS: SurgeAnalytics = {
  surge_events:    87,
  avg_multiplier:  1.62,
  peak_multiplier: 2.0,
  affected_rides:  4_218,
  surge_revenue:   184_000_000,
  series: DATES.map((date, i) => ({
    date,
    events:         i % 5 === 0 ? 4 + Math.round(Math.random() * 3) : Math.round(Math.random() * 2),
    avg_multiplier: 1.3 + Math.round(Math.random() * 70) / 100,
  })),
};

export const MOCK_REPORTS: ReportMeta[] = [
  {
    id:           "rpt_001",
    type:         "revenue",
    format:       "csv",
    status:       "ready",
    download_url: "#",
    expires_at:   new Date(Date.now() + 15 * 60_000).toISOString(),
    created_at:   new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    id:        "rpt_002",
    type:      "rides",
    format:    "pdf",
    status:    "ready",
    download_url: "#",
    created_at: new Date(Date.now() - 24 * 3600_000).toISOString(),
  },
  {
    id:        "rpt_003",
    type:      "drivers",
    format:    "csv",
    status:    "failed",
    created_at: new Date(Date.now() - 48 * 3600_000).toISOString(),
  },
];
