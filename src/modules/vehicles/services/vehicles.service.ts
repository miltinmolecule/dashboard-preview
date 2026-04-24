import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse, PaginatedResponse } from "@/config/types/generic";

export type VehicleStatus = "active" | "pending" | "suspended" | "rejected";
export type VehicleVerificationStatus =
  | "verified"
  | "pending"
  | "rejected"
  | "expired";
export type VehicleDocType =
  | "vehicle_papers"
  | "insurance"
  | "roadworthiness"
  | "inspection";

export interface VehicleDocument {
  type: VehicleDocType;
  label: string;
  status: "approved" | "pending" | "rejected" | "expired";
  uploadedAt?: string;
  expiresAt?: string;
}

export interface VehicleDriver {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  vehicleType?: string;
  vin?: string;
  status: VehicleStatus;
  verificationStatus: VehicleVerificationStatus;
  driver?: VehicleDriver;
  documents: VehicleDocument[];
  totalTrips: number;
  registeredAt: string;
  lastActiveAt?: string;
}

export interface DriverHistoryEntry {
  driverId: string;
  driverName: string;
  phone: string;
  assignedAt: string;
  unassignedAt?: string;
  tripsCount: number;
}

export interface VehicleFilters {
  search?: string;
  status?: string;
  verificationStatus?: string;
  vehicleType?: string;
  page?: number;
  limit?: number;
}

export const fetchVehicles = async (
  filters: VehicleFilters,
): Promise<PaginatedResponse<Vehicle>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<Vehicle>>>(
    API_URLS.VEHICLES.LIST,
    { params: filters },
  );
  return data.data;
};

export const fetchVehicleDetail = async (id: string): Promise<Vehicle> => {
  const { data } = await api.get<ApiResponse<Vehicle>>(
    API_URLS.VEHICLES.DETAIL(id),
  );
  return data.data;
};

export const approveVehicle = async (id: string): Promise<void> => {
  await api.post(API_URLS.VEHICLES.APPROVE(id));
};

export const rejectVehicle = async (id: string): Promise<void> => {
  await api.post(API_URLS.VEHICLES.REJECT(id));
};

export const suspendVehicle = async (id: string): Promise<void> => {
  await api.post(API_URLS.VEHICLES.SUSPEND(id));
};

export const reactivateVehicle = async (id: string): Promise<void> => {
  await api.post(API_URLS.VEHICLES.REACTIVATE(id));
};

export const bulkApproveVehicles = async (ids: string[]): Promise<void> => {
  await api.post(API_URLS.VEHICLES.BULK_APPROVE, { ids });
};

export const bulkSuspendVehicles = async (ids: string[]): Promise<void> => {
  await api.post(API_URLS.VEHICLES.BULK_SUSPEND, { ids });
};

export const updateVehicleDocument = async (
  id: string,
  docType: VehicleDocType,
  status: "approved" | "rejected",
): Promise<void> => {
  await api.patch(API_URLS.VEHICLES.DOCUMENTS(id, docType), { status });
};

export const fetchVehicleDriverHistory = async (
  id: string,
): Promise<DriverHistoryEntry[]> => {
  const { data } = await api.get<ApiResponse<DriverHistoryEntry[]>>(
    API_URLS.VEHICLES.DRIVER_HISTORY(id),
  );
  return data.data;
};
