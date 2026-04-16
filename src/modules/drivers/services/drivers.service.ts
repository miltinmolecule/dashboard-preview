import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";

export type DriverKycStatus = "pending" | "approved" | "rejected";
export type DriverAccountStatus = "active" | "suspended" | "pending" | "rejected";
export type DriverVehicleStatus = "active" | "pending" | "suspended";

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  kycStatus: DriverKycStatus;
  accountStatus: DriverAccountStatus;
  vehicleStatus: DriverVehicleStatus;
  totalTrips: number;
  totalEarnings: number;
  vehicleModel?: string;
  vehiclePlate?: string;
  profilePhoto?: string;
  rating?: number;
  joinedAt: string;
  lastActive?: string;
}

export interface DriverFilters {
  search?: string;
  kycStatus?: string;
  accountStatus?: string;
  page?: number;
  limit?: number;
}

export const fetchDrivers = async (filters: DriverFilters): Promise<PaginatedResponse<Driver>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<Driver>>>(API_URLS.DRIVERS.LIST, {
    params: filters,
  });
  return data.data;
};

export const fetchDriverDetail = async (id: string): Promise<Driver> => {
  const { data } = await api.get<ApiResponse<Driver>>(API_URLS.DRIVERS.DETAIL(id));
  return data.data;
};

export const approveDriver = async (id: string): Promise<void> => {
  await api.post(API_URLS.DRIVERS.APPROVE(id));
};

export const rejectDriver = async (id: string): Promise<void> => {
  await api.post(API_URLS.DRIVERS.REJECT(id));
};

export const suspendDriver = async (id: string): Promise<void> => {
  await api.post(API_URLS.DRIVERS.SUSPEND(id));
};

export const reactivateDriver = async (id: string): Promise<void> => {
  await api.post(API_URLS.DRIVERS.REACTIVATE(id));
};

export const bulkApproveDrivers = async (ids: string[]): Promise<void> => {
  await api.post(API_URLS.DRIVERS.BULK_APPROVE, { ids });
};

export const bulkSuspendDrivers = async (ids: string[]): Promise<void> => {
  await api.post(API_URLS.DRIVERS.BULK_SUSPEND, { ids });
};
