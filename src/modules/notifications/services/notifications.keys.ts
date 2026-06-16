import type { NotificationFilters } from "../type/notifications";

export const notificationKeys = {
  all:    () => ["notifications"] as const,
  list:   (p?: NotificationFilters) => ["notifications", "list",   p] as const,
  detail: (id: string)              => ["notifications", "detail", id] as const,
  stats:  (id: string)              => ["notifications", "stats",  id] as const,
};
