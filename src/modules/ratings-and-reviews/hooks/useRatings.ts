import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ratingKeys } from "../services/ratings.keys";
import {
  dismissAlert,
  fetchRatingAlerts,
  fetchRatings,
  fetchThresholds,
  flagRating,
  removeRating,
  respondToRating,
  restoreRating,
  updateThreshold,
} from "../services/ratings.service";
import type { RatingFilters, ThresholdConfig } from "../type/ratings";

export function useRatings(filters?: RatingFilters) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ratingKeys.list(filters),
    queryFn:  () => fetchRatings(filters),
  });

  const flag = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => flagRating(id, reason),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ratingKeys.all() }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => removeRating(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ratingKeys.all() }),
  });

  const restore = useMutation({
    mutationFn: (id: string) => restoreRating(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ratingKeys.all() }),
  });

  const respond = useMutation({
    mutationFn: ({ id, response }: { id: string; response: string }) => respondToRating(id, response),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ratingKeys.all() }),
  });

  return {
    ratings:    query.data?.ratings ?? [],
    pagination: {
      total:      query.data?.total ?? 0,
      page:       query.data?.page ?? 1,
      totalPages: Math.ceil((query.data?.total ?? 0) / (query.data?.limit ?? 20)) || 1,
    },
    isLoading: query.isLoading,
    isError:   query.isError,
    flag,
    remove,
    restore,
    respond,
  };
}

export function useRatingAlerts(params?: { page?: number }) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ratingKeys.alerts(params),
    queryFn:  () => fetchRatingAlerts(params),
  });

  const dismiss = useMutation({
    mutationFn: (id: string) => dismissAlert(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ratingKeys.alerts() });
      const prev = qc.getQueryData(ratingKeys.alerts(params));
      qc.setQueryData(ratingKeys.alerts(params), (old: typeof query.data) => {
        if (!old) return old;
        return {
          ...old,
          alerts: old.alerts.filter((a) => a.id !== id),
          undismissed_count: Math.max(0, (old.undismissed_count ?? 1) - 1),
        };
      });
      return { prev };
    },
    onError: (_, __, ctx) => {
      qc.setQueryData(ratingKeys.alerts(params), ctx?.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ratingKeys.alerts() }),
  });

  return {
    alerts:            query.data?.alerts ?? [],
    undismissed_count: query.data?.undismissed_count ?? 0,
    isLoading:         query.isLoading,
    dismiss,
  };
}

export function useRatingThresholds() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ratingKeys.thresholds(),
    queryFn:  () => fetchThresholds(),
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<ThresholdConfig> }) =>
      updateThreshold(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ratingKeys.thresholds() }),
  });

  return {
    thresholds: query.data ?? [],
    isLoading:  query.isLoading,
    update,
  };
}
