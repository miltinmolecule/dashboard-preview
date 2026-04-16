import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTrips,
  fetchTripDetail,
  cancelTrip,
  type TripFilters,
} from "../services/trips.service";

export const useTrips = (filters: TripFilters) => {
  return useQuery({
    queryKey: ["trips", filters],
    queryFn: () => fetchTrips(filters),
  });
};

export const useTripDetail = (id: string) => {
  return useQuery({
    queryKey: ["trip", id],
    queryFn: () => fetchTripDetail(id),
    enabled: !!id,
  });
};

export const useCancelTrip = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelTrip,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trips"] }),
  });
};
