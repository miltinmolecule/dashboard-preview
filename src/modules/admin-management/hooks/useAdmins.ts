import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MOCK_ACTIVITY_LOG, MOCK_ADMINS, DEFAULT_PERMISSIONS } from "../data/mock";
import {
  createAdmin,
  deactivateAdmin,
  fetchActivityLog,
  fetchAdminPermissions,
  fetchAdmins,
  reactivateAdmin,
  resetAdminPassword,
  updateAdmin,
  updateAdminPermissions,
} from "../services/admins.service";
import { adminKeys } from "../services/admins.keys";
import type {
  AdminFilters,
  AdminPermissions,
  AdminRecord,
  ActivityLog,
  CreateAdminDto,
  UpdateAdminDto,
} from "../type/admin-management";
import type { PaginatedResponse } from "@/config/types/generic";

const PLACEHOLDER_LIST: PaginatedResponse<AdminRecord> = {
  data:       MOCK_ADMINS,
  total:      MOCK_ADMINS.length,
  page:       1,
  limit:      20,
  totalPages: 1,
};

export function useAdmins(filters?: AdminFilters) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey:        adminKeys.list(filters),
    queryFn:         () => fetchAdmins(filters),
    placeholderData: PLACEHOLDER_LIST,
    staleTime:       60_000,
    retry:           1,
  });

  const create = useMutation({
    mutationFn: (body: CreateAdminDto) => createAdmin(body),
    onSuccess:  () => qc.invalidateQueries({ queryKey: adminKeys.all() }),
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateAdminDto }) =>
      updateAdmin(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: adminKeys.detail(id) });
      qc.invalidateQueries({ queryKey: adminKeys.list() });
    },
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => deactivateAdmin(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: adminKeys.all() }),
  });

  const reactivate = useMutation({
    mutationFn: (id: string) => reactivateAdmin(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: adminKeys.all() }),
  });

  const resetPassword = useMutation({
    mutationFn: (id: string) => resetAdminPassword(id),
  });

  const resolved = query.data ?? PLACEHOLDER_LIST;

  return {
    admins:     resolved.data,
    total:      resolved.total,
    page:       resolved.page,
    totalPages: resolved.totalPages,
    isLoading:  query.isLoading,
    create,
    update,
    deactivate,
    reactivate,
    resetPassword,
  };
}

const PLACEHOLDER_LOG: PaginatedResponse<ActivityLog> = {
  data:       MOCK_ACTIVITY_LOG,
  total:      MOCK_ACTIVITY_LOG.length,
  page:       1,
  limit:      20,
  totalPages: 1,
};

export function useActivityLog(params?: { admin_id?: string; page?: number }) {
  const query = useQuery({
    queryKey:        adminKeys.activity(params),
    queryFn:         () => fetchActivityLog(params),
    placeholderData: PLACEHOLDER_LOG,
    staleTime:       30_000,
    retry:           1,
  });

  const resolved = query.data ?? PLACEHOLDER_LOG;
  return { logs: resolved.data, total: resolved.total, isLoading: query.isLoading };
}

export function useAdminPermissions(adminId: string, role: string) {
  const qc = useQueryClient();

  const fallback = DEFAULT_PERMISSIONS[role] ?? DEFAULT_PERMISSIONS.support_admin;

  const query = useQuery({
    queryKey:        adminKeys.permissions(adminId),
    queryFn:         () => fetchAdminPermissions(adminId),
    placeholderData: fallback,
    staleTime:       60_000,
    retry:           1,
  });

  const update = useMutation({
    mutationFn: (body: Partial<AdminPermissions>) =>
      updateAdminPermissions(adminId, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: adminKeys.permissions(adminId) }),
  });

  return {
    permissions: query.data ?? fallback,
    isLoading:   query.isLoading,
    update,
  };
}
