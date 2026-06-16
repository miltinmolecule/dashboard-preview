import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";
import { VALID_ACTIONS, VALID_ENTITY_TYPES } from "../type/audit-log";
import type { AuditEntry, AuditExportJob, AuditFilters } from "../type/audit-log";

function sanitiseFilters(f?: AuditFilters): Record<string, unknown> {
  if (!f) return { page: 1, limit: 20 };

  if (f.from && f.to) {
    const from = new Date(f.from), to = new Date(f.to);
    if (isNaN(from.getTime()) || isNaN(to.getTime()) || from > to)
      throw new Error("Invalid date range");
    if ((to.getTime() - from.getTime()) / 86400000 > 365)
      throw new Error("Date range cannot exceed 365 days");
  }

  return {
    ...(f.from        && { from:        f.from }),
    ...(f.to          && { to:          f.to }),
    ...(f.admin_id    && { admin_id:    f.admin_id }),
    ...(f.entity_id   && { entity_id:   f.entity_id }),
    ...(f.action      && VALID_ACTIONS.includes(f.action)            && { action:      f.action }),
    ...(f.entity_type && VALID_ENTITY_TYPES.includes(f.entity_type)  && { entity_type: f.entity_type }),
    ...(f.is_archived !== undefined                                  && { is_archived: f.is_archived }),
    page:  Math.max(1, Math.min(f.page  ?? 1,  10000)),
    limit: Math.max(1, Math.min(f.limit ?? 20, 100)),
  };
}

export const fetchAuditLog = async (
  filters?: AuditFilters,
): Promise<PaginatedResponse<AuditEntry>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<AuditEntry>>>(
    API_URLS.LOGS.LIST,
    { params: sanitiseFilters(filters) },
  );
  return data.data;
};

export const fetchAuditEntry = async (id: string): Promise<AuditEntry> => {
  const { data } = await api.get<ApiResponse<AuditEntry>>(
    API_URLS.LOGS.DETAIL(id),
  );
  return data.data;
};

export const requestAuditExport = async (
  format: "csv" | "pdf",
  filters?: AuditFilters,
): Promise<AuditExportJob> => {
  const { data } = await api.post<ApiResponse<AuditExportJob>>(
    API_URLS.LOGS.EXPORT,
    { format, filters: sanitiseFilters(filters) },
  );
  return data.data;
};

export const getAuditExport = async (id: string): Promise<AuditExportJob> => {
  const { data } = await api.get<ApiResponse<AuditExportJob>>(
    API_URLS.LOGS.EXPORT_DETAIL(id),
  );
  return data.data;
};
