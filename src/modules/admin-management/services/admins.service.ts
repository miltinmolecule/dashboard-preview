import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";
import { VALID_ROLES, VALID_SCOPES, VALID_STATUSES } from "../type/admin-management";
import type {
  ActivityLog,
  AdminFilters,
  AdminPermissions,
  AdminRecord,
  CreateAdminDto,
  UpdateAdminDto,
} from "../type/admin-management";

function sanitiseFilters(p?: AdminFilters): Record<string, unknown> {
  return {
    ...(p?.role   && VALID_ROLES.includes(p.role)       && { role:   p.role }),
    ...(p?.status && VALID_STATUSES.includes(p.status)  && { status: p.status }),
    ...(p?.scope  && VALID_SCOPES.includes(p.scope)     && { scope:  p.scope }),
    page:  Math.max(1, Math.min(p?.page  ?? 1,  10000)),
    limit: Math.max(1, Math.min(p?.limit ?? 20, 100)),
  };
}

export const fetchAdmins = async (
  filters?: AdminFilters,
): Promise<PaginatedResponse<AdminRecord>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<AdminRecord>>>(
    API_URLS.ADMINS.LIST,
    { params: sanitiseFilters(filters) },
  );
  return data.data;
};

export const createAdmin = async (body: CreateAdminDto): Promise<AdminRecord> => {
  const { data } = await api.post<ApiResponse<AdminRecord>>(
    API_URLS.ADMINS.CREATE,
    body,
  );
  return data.data;
};

export const updateAdmin = async (
  id: string,
  body: UpdateAdminDto,
): Promise<AdminRecord> => {
  const { data } = await api.put<ApiResponse<AdminRecord>>(
    API_URLS.ADMINS.DETAIL(id),
    body,
  );
  return data.data;
};

export const deactivateAdmin = async (id: string): Promise<AdminRecord> => {
  const { data } = await api.patch<ApiResponse<AdminRecord>>(
    API_URLS.ADMINS.DEACTIVATE(id),
  );
  return data.data;
};

export const reactivateAdmin = async (id: string): Promise<AdminRecord> => {
  const { data } = await api.patch<ApiResponse<AdminRecord>>(
    API_URLS.ADMINS.REACTIVATE(id),
  );
  return data.data;
};

export const resetAdminPassword = async (id: string): Promise<void> => {
  await api.post(API_URLS.ADMINS.RESET_PASSWORD(id));
};

export const fetchAdminPermissions = async (id: string): Promise<AdminPermissions> => {
  const { data } = await api.get<ApiResponse<AdminPermissions>>(
    API_URLS.ADMINS.PERMISSIONS(id),
  );
  return data.data;
};

export const updateAdminPermissions = async (
  id: string,
  body: Partial<AdminPermissions>,
): Promise<AdminPermissions> => {
  const { data } = await api.put<ApiResponse<AdminPermissions>>(
    API_URLS.ADMINS.PERMISSIONS(id),
    body,
  );
  return data.data;
};

export const fetchActivityLog = async (params?: {
  admin_id?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<ActivityLog>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<ActivityLog>>>(
    API_URLS.ADMINS.ACTIVITY,
    {
      params: {
        ...(params?.admin_id && { admin_id: params.admin_id }),
        page:  Math.max(1, Math.min(params?.page  ?? 1,  10000)),
        limit: Math.max(1, Math.min(params?.limit ?? 20, 100)),
      },
    },
  );
  return data.data;
};
