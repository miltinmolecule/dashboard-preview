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
    REACTIVATE: (id: string) => `${BASE}/drivers/${id}/reactivate`,
    BULK_APPROVE: `${BASE}/drivers/bulk-approve`,
    BULK_SUSPEND: `${BASE}/drivers/bulk-suspend`,
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
