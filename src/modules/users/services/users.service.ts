import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";

export type UserAccountStatus = "active" | "suspended" | "flagged" | "deleted";

export interface Rider {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountStatus: UserAccountStatus;
  walletBalance: number;
  totalTrips: number;
  lastTripDate?: string;
  profilePhoto?: string;
  joinedAt: string;
  rating?: number;
}

export interface RiderTrip {
  id: string;
  pickup: string;
  destination: string;
  fare: number;
  status: string;
  date: string;
  driverName: string;
}

export interface UserFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const fetchUsers = async (filters: UserFilters): Promise<PaginatedResponse<Rider>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<Rider>>>(API_URLS.USERS.LIST, {
    params: filters,
  });
  return data.data;
};

export const fetchUserDetail = async (id: string): Promise<Rider> => {
  const { data } = await api.get<ApiResponse<Rider>>(API_URLS.USERS.DETAIL(id));
  return data.data;
};

export const fetchUserRides = async (id: string): Promise<RiderTrip[]> => {
  const { data } = await api.get<ApiResponse<RiderTrip[]>>(API_URLS.USERS.RIDES(id));
  return data.data;
};

export const suspendUser = async (id: string): Promise<void> => {
  await api.post(API_URLS.USERS.SUSPEND(id));
};

export const reactivateUser = async (id: string): Promise<void> => {
  await api.post(API_URLS.USERS.REACTIVATE(id));
};
