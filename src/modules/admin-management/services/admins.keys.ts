import type { AdminFilters } from "../type/admin-management";

export const adminKeys = {
  all:         () => ["admins"] as const,
  list:        (p?: AdminFilters) => ["admins", "list",        p] as const,
  detail:      (id: string)      => ["admins", "detail",      id] as const,
  permissions: (id: string)      => ["admins", "permissions", id] as const,
  activity:    (p?: object)      => ["admins", "activity",    p] as const,
};
