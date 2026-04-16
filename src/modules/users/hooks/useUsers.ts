import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  fetchUserDetail,
  fetchUserRides,
  suspendUser,
  reactivateUser,
  type UserFilters,
} from "../services/users.service";

export const useUsers = (filters: UserFilters) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => fetchUsers(filters),
  });
};

export const useUserDetail = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserDetail(id),
    enabled: !!id,
  });
};

export const useUserRides = (id: string) => {
  return useQuery({
    queryKey: ["user-rides", id],
    queryFn: () => fetchUserRides(id),
    enabled: !!id,
  });
};

export const useSuspendUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: suspendUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useReactivateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reactivateUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};
