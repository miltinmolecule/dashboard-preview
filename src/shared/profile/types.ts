export type AccountStatus = "active" | "suspended" | "flagged" | "deleted" | "pending" | "rejected";
export type VerificationStatus = "pending" | "verified" | "rejected";
export type ActivityType = "trip" | "payment" | "wallet" | "profile";

export interface EmergencyContact {
  relation: string;
  name: string;
  phone: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  date: string;
  time: string;
}

export interface RideRecord {
  id: string;
  location: string;
  amount: number;
  passengers: number;
  dateTime: string;
  status: string;
}

export interface TransactionRecord {
  id: string;
  from: string;
  estimatedFare: number;
  dateTime: string;
  status: string;
  purpose: string;
}

export interface LogRecord {
  id: string;
  title: string;
  dateTime: string;
  status: string;
  purpose: string;
}

export interface BaseProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountStatus: AccountStatus;
  isVerified: boolean;
  rating: number;
  dateOfBirth: string;
  nin: string;
  createdAt: string;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  emergencyContacts: EmergencyContact[];
  verificationStatus: VerificationStatus;
  verificationDate: string;
  reviewedBy: string;
  rejectionReason?: string;
  licenseNumber: string;
  licenseExpiry: string;
  walletBalance: number;
  totalSpent: number;
  pendingPayment: number;
  totalTrips: number;
  activities: ActivityItem[];
  rides: RideRecord[];
  transactions: TransactionRecord[];
  logs: LogRecord[];
}

export interface UserProfile extends BaseProfile {
  userType: "User";
}

export interface VehicleDocument {
  label: string;
}

export interface DriverProfile extends BaseProfile {
  userType: "Driver";
  kycStatus: "pending" | "approved" | "rejected";
  totalEarnings: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  vehicleSeats: number;
  vehicleVin: string;
  vehicleChassis: string;
  vehicleEngine: string;
  vehiclePlate: string;
  vehicleDocuments: VehicleDocument[];
}

export interface ProfileNavItem {
  label: string;
  href: string;
  iconKey: string;
}
