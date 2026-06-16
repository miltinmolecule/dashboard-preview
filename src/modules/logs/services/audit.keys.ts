import type { AuditFilters } from "../type/audit-log";

export const auditKeys = {
  all:    () => ["audit"] as const,
  list:   (f?: AuditFilters) => ["audit", "list",   f] as const,
  detail: (id: string)       => ["audit", "detail", id] as const,
  export: (id: string)       => ["audit", "export", id] as const,
};
