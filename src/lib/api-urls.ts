const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

export const API_URLS = {
  // Auth
  AUTH: {
    LOGIN: `${BASE}/auth/login`,
    LOGOUT: `${BASE}/auth/logout`,
    REFRESH: `${BASE}/auth/refresh`,
    ME: `${BASE}/auth/me`,
  },

  // Dashboard
  DASHBOARD: {
    STATS: `${BASE}/dashboard/stats`,
    TRIPS_CHART: `${BASE}/dashboard/trips-chart`,
    REVENUE_CHART: `${BASE}/dashboard/revenue-chart`,
  },

  // Users
  USERS: {
    LIST: `${BASE}/users`,
    DETAIL: (id: string) => `${BASE}/users/${id}`,
    SUSPEND: (id: string) => `${BASE}/users/${id}/suspend`,
    REACTIVATE: (id: string) => `${BASE}/users/${id}/reactivate`,
    RIDES: (id: string) => `${BASE}/users/${id}/rides`,
  },

  // Drivers
  DRIVERS: {
    LIST: `${BASE}/drivers`,
    DETAIL: (id: string) => `${BASE}/drivers/${id}`,
    APPROVE: (id: string) => `${BASE}/drivers/${id}/approve`,
    REJECT: (id: string) => `${BASE}/drivers/${id}/reject`,
    SUSPEND: (id: string) => `${BASE}/drivers/${id}/suspend`,
  },

  // Rides
  RIDES: {
    LIST: `${BASE}/rides`,
    DETAIL: (id: string) => `${BASE}/rides/${id}`,
    CANCEL: (id: string) => `${BASE}/rides/${id}/cancel`,
  },

  // Payments
  PAYMENTS: {
    LIST: `${BASE}/payments`,
    DETAIL: (id: string) => `${BASE}/payments/${id}`,
    REFUND: (id: string) => `${BASE}/payments/${id}/refund`,
    PAYOUTS: `${BASE}/payments/payouts`,
  },

  // Analytics
  ANALYTICS: {
    REPORTS: `${BASE}/analytics/reports`,
    EXPORT: `${BASE}/analytics/export`,
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
