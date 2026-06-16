import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "@/config/types/generic";
import { pricingKeys } from "../services/pricing.keys";
import {
  createMetricRule,
  deleteMetricRule,
  fetchMetricRules,
  updateMetricRule,
} from "../services/metric-pricing.service";
import { createZoneRule, deleteZoneRule, fetchZoneRules, updateZoneRule } from "../services/zone-pricing.service";
import { createSurgeConfig, fetchSurgeConfigs, toggleSurge, updateSurgeConfig } from "../services/surge.service";
import { fetchPricingHistory } from "../services/pricing-history.service";
import { simulateFare } from "../services/fare-simulator.service";
import type {
  CreateMetricDto,
  CreateSurgeDto,
  CreateZoneDto,
  HistoryParams,
  MetricFilters,
  SimulateParams,
  SurgeConfig,
  SurgeFilters,
  ZoneFilters,
} from "../type/pricing";

// ─── Metric pricing ──────────────────────────────────────────────────────────

export const useMetricRules = (filters?: MetricFilters) => {
  return useQuery({
    queryKey: pricingKeys.metric(filters),
    queryFn: () => fetchMetricRules(filters),
  });
};

export const useCreateMetricRule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMetricDto) => createMetricRule(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.metric() });
      qc.invalidateQueries({ queryKey: pricingKeys.history() });
    },
  });
};

export const useUpdateMetricRule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateMetricDto> }) =>
      updateMetricRule(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.metric() });
      qc.invalidateQueries({ queryKey: pricingKeys.history() });
    },
  });
};

export const useDeleteMetricRule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMetricRule(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.metric() });
      qc.invalidateQueries({ queryKey: pricingKeys.history() });
    },
  });
};

// ─── Zone pricing ────────────────────────────────────────────────────────────

export const useZoneRules = (filters?: ZoneFilters) => {
  return useQuery({
    queryKey: pricingKeys.zone(filters),
    queryFn: () => fetchZoneRules(filters),
  });
};

export const useCreateZoneRule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateZoneDto) => createZoneRule(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.zone() });
      qc.invalidateQueries({ queryKey: pricingKeys.history() });
    },
  });
};

export const useUpdateZoneRule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateZoneDto> }) => updateZoneRule(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.zone() });
      qc.invalidateQueries({ queryKey: pricingKeys.history() });
    },
  });
};

export const useDeleteZoneRule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteZoneRule(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.zone() });
      qc.invalidateQueries({ queryKey: pricingKeys.history() });
    },
  });
};

// ─── Surge management ────────────────────────────────────────────────────────

export const useSurgeConfigs = (filters?: SurgeFilters) => {
  return useQuery({
    queryKey: pricingKeys.surge(filters),
    queryFn: () => fetchSurgeConfigs(filters),
  });
};

export const useCreateSurgeConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSurgeDto) => createSurgeConfig(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.surge() });
      qc.invalidateQueries({ queryKey: pricingKeys.history() });
    },
  });
};

export const useUpdateSurgeConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateSurgeDto> }) => updateSurgeConfig(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.surge() });
      qc.invalidateQueries({ queryKey: pricingKeys.history() });
    },
  });
};

// Optimistic toggle — UI responds instantly, rolls back on error.
export const useToggleSurge = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) => toggleSurge(id, is_active),
    onMutate: async ({ id, is_active }) => {
      await qc.cancelQueries({ queryKey: pricingKeys.surge() });
      const previous = qc.getQueriesData<PaginatedResponse<SurgeConfig>>({ queryKey: pricingKeys.surge() });

      qc.setQueriesData<PaginatedResponse<SurgeConfig>>({ queryKey: pricingKeys.surge() }, (old) => {
        if (!old) return old;
        return { ...old, data: old.data.map((s) => (s.id === id ? { ...s, is_active } : s)) };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        qc.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.surge() });
      qc.invalidateQueries({ queryKey: pricingKeys.history() });
    },
  });
};

// ─── History / audit log ────────────────────────────────────────────────────

export const usePricingHistory = (params?: HistoryParams) => {
  return useQuery({
    queryKey: pricingKeys.history(params),
    queryFn: () => fetchPricingHistory(params),
  });
};

// ─── Fare simulator ──────────────────────────────────────────────────────────

export const useFareSimulator = (params: SimulateParams | null) => {
  return useQuery({
    queryKey: params ? pricingKeys.simulate(params) : ["pricing", "simulate", "idle"],
    queryFn: () => simulateFare(params as SimulateParams),
    enabled: !!params,
    staleTime: 0,
  });
};
