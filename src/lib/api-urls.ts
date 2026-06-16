const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_URLS = {
  // Auth
  AUTH: {
    LOGIN: `${BASE}/login`,
    LOGOUT: `${BASE}/logout`,
    REFRESH: `${BASE}/refresh`,
    ME: `${BASE}/me`,
  },

  // Dashboard
  DASHBOARD: {
    STATS: `${BASE}/dashboard/stats`,
    TRIPS_CHART: `${BASE}/dashboard/trips-chart`,
    REVENUE_CHART: `${BASE}/dashboard/revenue-chart`,
  },

  // Users
  USERS: {
    LIST: `${BASE}/admin/users`,
    DETAIL: (id: string) => `${BASE}/admin/users/${id}`,
    SUSPEND: (id: string) => `${BASE}/admin/users/${id}/suspend`,
    REACTIVATE: (id: string) => `${BASE}/admin/users/${id}/reactivate`,
    RIDES: (id: string) => `${BASE}/admin/users/${id}/rides`,
  },

  // Drivers
  DRIVERS: {
    LIST: `${BASE}/admin/drivers`,
    DETAIL: (id: string) => `${BASE}/admin/drivers/${id}`,
    APPROVE: (id: string) => `${BASE}/admin/drivers/${id}/approve`,
    REJECT: (id: string) => `${BASE}/admin/drivers/${id}/reject`,
    SUSPEND: (id: string) => `${BASE}/admin/drivers/${id}/suspend`,
    REACTIVATE: (id: string) => `${BASE}/admin/drivers/${id}/reactivate`,
    BULK_APPROVE: `${BASE}/admin/drivers/bulk-approve`,
    BULK_SUSPEND: `${BASE}/admin/drivers/bulk-suspend`,
  },

  // Rides
  RIDES: {
    LIST: `${BASE}/rides`,
    DETAIL: (id: string) => `${BASE}/rides/${id}`,
    CANCEL: (id: string) => `${BASE}/rides/${id}/cancel`,
  },

    // Vehicles
  VEHICLES: {
    LIST: `${BASE}/vehicles`,
    DETAIL: (id: string) => `${BASE}/vehicles/${id}`,
    APPROVE: (id: string) => `${BASE}/vehicles/${id}/approve`,
    REJECT: (id: string) => `${BASE}/vehicles/${id}/reject`,
    SUSPEND: (id: string) => `${BASE}/vehicles/${id}/suspend`,
    REACTIVATE: (id: string) => `${BASE}/vehicles/${id}/reactivate`,
    BULK_APPROVE: `${BASE}/vehicles/bulk-approve`,
    BULK_SUSPEND: `${BASE}/vehicles/bulk-suspend`,
    DOCUMENTS: (id: string, docType: string) => `${BASE}/vehicles/${id}/documents/${docType}`,
    DRIVER_HISTORY: (id: string) => `${BASE}/vehicles/${id}/driver-history`,
  },
  
  // Payments
  PAYMENTS: {
    LIST: `${BASE}/payments`,
    DETAIL: (id: string) => `${BASE}/payments/${id}`,
    REFUND: (id: string) => `${BASE}/payments/${id}/refund`,
    PAYOUTS: `${BASE}/payments/payouts`,
  },

  // Earnings & Payouts
  EARNINGS: {
    SUMMARY: `${BASE}/earnings/summary`,
    DRIVERS: `${BASE}/earnings/drivers`,
    DRIVER_DETAIL: (id: string) => `${BASE}/earnings/drivers/${id}`,
    PAYOUTS: `${BASE}/earnings/payouts`,
    PAYOUT_DETAIL: (id: string) => `${BASE}/earnings/payouts/${id}`,
    PAYOUT_APPROVE: (id: string) => `${BASE}/earnings/payouts/${id}/approve`,
    PAYOUT_PROCESS: (id: string) => `${BASE}/earnings/payouts/${id}/process`,
    PAYOUT_MARK_PAID: (id: string) => `${BASE}/earnings/payouts/${id}/mark-paid`,
    PAYOUT_BULK_APPROVE: `${BASE}/earnings/payouts/bulk-approve`,
  },

  // Promotions, Discount Codes & Referrals
  PROMOTIONS: {
    LIST: `${BASE}/promotions`,
    DETAIL: (id: string) => `${BASE}/promotions/${id}`,
    STATUS: (id: string) => `${BASE}/promotions/${id}/status`,

    DISCOUNT_CODES: `${BASE}/promotions/discount-codes`,
    DISCOUNT_CODE_DETAIL: (id: string) => `${BASE}/promotions/discount-codes/${id}`,
    DISCOUNT_CODE_STATUS: (id: string) => `${BASE}/promotions/discount-codes/${id}/status`,

    REFERRAL_PROGRAM: `${BASE}/promotions/referrals/program`,
    REFERRAL_ACTIVITY: `${BASE}/promotions/referrals/activity`,
  },
  
  // Pricing — Metric, Zone, Surge, History & Simulation
  PRICING: {
    METRIC: `${BASE}/admin/pricing/metric`,
    METRIC_DETAIL: (id: string) => `${BASE}/admin/pricing/metric/${id}`,

    ZONE: `${BASE}/admin/pricing/zone`,
    ZONE_DETAIL: (id: string) => `${BASE}/admin/pricing/zone/${id}`,

    SURGE: `${BASE}/admin/pricing/surge`,
    SURGE_DETAIL: (id: string) => `${BASE}/admin/pricing/surge/${id}`,
    SURGE_TOGGLE: (id: string) => `${BASE}/admin/pricing/surge/${id}/toggle`,

    HISTORY: `${BASE}/admin/pricing/history`,
    SIMULATE: `${BASE}/admin/pricing/simulate`,
  },

  // Ratings & Reviews
  RATINGS: {
    LIST:             `${BASE}/admin/ratings`,
    FLAG:             (id: string) => `${BASE}/admin/ratings/${id}/flag`,
    REMOVE:           (id: string) => `${BASE}/admin/ratings/${id}/remove`,
    RESTORE:          (id: string) => `${BASE}/admin/ratings/${id}/restore`,
    RESPOND:          (id: string) => `${BASE}/admin/ratings/${id}/respond`,
    STATS:            (type: string, id: string) => `${BASE}/admin/ratings/stats/${type}/${id}`,
    LEADERBOARD:      `${BASE}/admin/ratings/leaderboard`,
    THRESHOLDS:       `${BASE}/admin/ratings/thresholds`,
    THRESHOLD_DETAIL: (id: string) => `${BASE}/admin/ratings/thresholds/${id}`,
    ALERTS:           `${BASE}/admin/ratings/alerts`,
    ALERT_DISMISS:    (id: string) => `${BASE}/admin/ratings/alerts/${id}/dismiss`,
  },

  // Analytics
  ANALYTICS: {
    RIDES:      `${BASE}/admin/analytics/rides`,
    REVENUE:    `${BASE}/admin/analytics/revenue`,
    DRIVERS:    `${BASE}/admin/analytics/drivers`,
    PASSENGERS: `${BASE}/admin/analytics/passengers`,
    SURGE:      `${BASE}/admin/analytics/surge`,
  },

  // Reports
  REPORTS: {
    LIST:   `${BASE}/admin/reports`,
    DETAIL: (id: string) => `${BASE}/admin/reports/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: `${BASE}/notifications`,
    BROADCAST: `${BASE}/notifications/broadcast`,
  },

  // Audit Logs
  LOGS: {
    LIST: `${BASE}/logs`,
  },

  // Admin Management
  ADMINS: {
    LIST: `${BASE}/admins`,
    DETAIL: (id: string) => `${BASE}/admins/${id}`,
  },
} as const;
