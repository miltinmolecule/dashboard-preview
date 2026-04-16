import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";

export type TripStatus =
  | "requested"
  | "driver_assigned"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "failed";

export interface TripParticipant {
  id: string;
  name: string;
  phone: string;
  rating?: number;
}

export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surge?: number;
  discount?: number;
  total: number;
}

export interface Trip {
  id: string;
  driver: TripParticipant;
  rider: TripParticipant;
  pickup: string;
  destination: string;
  fare: number;
  fareBreakdown: FareBreakdown;
  status: TripStatus;
  distanceKm?: number;
  durationMin?: number;
  createdAt: string;
  completedAt?: string;
}

export interface TripFilters {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const fetchTrips = async (filters: TripFilters): Promise<PaginatedResponse<Trip>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<Trip>>>(API_URLS.RIDES.LIST, {
    params: filters,
  });
  return data.data;
};

export const fetchTripDetail = async (id: string): Promise<Trip> => {
  const { data } = await api.get<ApiResponse<Trip>>(API_URLS.RIDES.DETAIL(id));
  return data.data;
};

export const cancelTrip = async (id: string): Promise<void> => {
  await api.post(API_URLS.RIDES.CANCEL(id));
};
