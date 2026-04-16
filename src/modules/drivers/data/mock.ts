import type { DriverProfile, ActivityItem, RideRecord, TransactionRecord, LogRecord } from "@/shared/profile/types";

const ACTIVITIES: ActivityItem[] = [
  { id: "a1", type: "trip", description: 'Trip completed from "Ikeja" to "Victoria Island" on 14/04/26 - 9:00AM.', date: "Apr 14, 2026", time: "9:00AM" },
  { id: "a2", type: "trip", description: 'Trip started from "Surulere" to "Lekki Phase 1" on 14/04/26 - 11:00AM.', date: "Apr 14, 2026", time: "11:00AM" },
  { id: "a3", type: "payment", description: "Received ₦4,500 for completed trip on 14/04/26.", date: "Apr 14, 2026", time: "11:33AM" },
  { id: "a4", type: "wallet", description: "Withdrawal of ₦50,000 to bank account.", date: "Apr 10, 2026", time: "10:00AM" },
  { id: "a5", type: "wallet", description: "Earnings of ₦12,000 credited.", date: "Apr 8, 2026", time: "3:45PM" },
  { id: "a6", type: "profile", description: "Vehicle documents updated.", date: "Apr 5, 2026", time: "10:10AM" },
  { id: "a7", type: "profile", description: "KYC documents resubmitted.", date: "Mar 28, 2026", time: "2:20PM" },
];

const RIDES: RideRecord[] = [
  { id: "3293875", location: "Ikeja - Victoria Is.", amount: 4_500, passengers: 2, dateTime: "2026-04-14", status: "completed" },
  { id: "2983423", location: "Surulere - Lekki", amount: 3_200, passengers: 1, dateTime: "2026-04-14", status: "completed" },
  { id: "9283433", location: "Yaba - Oshodi", amount: 1_800, passengers: 3, dateTime: "2026-04-12", status: "completed" },
  { id: "2983845", location: "Agege - CMS", amount: 5_000, passengers: 4, dateTime: "2026-04-10", status: "completed" },
  { id: "8678457", location: "Ikorodu - Ajah", amount: 8_000, passengers: 2, dateTime: "2026-04-08", status: "cancelled" },
  { id: "2748y23", location: "Magodo - Marina", amount: 4_200, passengers: 1, dateTime: "2026-04-06", status: "completed" },
  { id: "3787234", location: "Ojo - Festac", amount: 2_800, passengers: 2, dateTime: "2026-04-05", status: "completed" },
  { id: "6783468", location: "Mushin - LUTH", amount: 1_500, passengers: 1, dateTime: "2026-04-03", status: "flagged" },
  { id: "2783455", location: "Ojota - Ogudu", amount: 2_000, passengers: 3, dateTime: "2026-04-01", status: "completed" },
];

const TRANSACTIONS: TransactionRecord[] = [
  { id: "#124578", from: "Tunde Bakare", estimatedFare: 4_500, dateTime: "14/04/2026 - 9:00am", status: "completed", purpose: "Standard" },
  { id: "#124577", from: "Chidinma Okafor", estimatedFare: 3_200, dateTime: "14/04/2026 - 11:00am", status: "completed", purpose: "Premium" },
  { id: "#124576", from: "Hakeem Adisa", estimatedFare: 1_800, dateTime: "12/04/2026 - 8:13am", status: "in_progress", purpose: "Standard" },
  { id: "#124575", from: "Blessing Eze", estimatedFare: 5_000, dateTime: "10/04/2026 - 9:12am", status: "completed", purpose: "Executive" },
  { id: "#124574", from: "Aisha Yusuf", estimatedFare: 8_000, dateTime: "08/04/2026 - 2:41pm", status: "cancelled", purpose: "Standard" },
  { id: "#124573", from: "Emmanuel Nwosu", estimatedFare: 4_200, dateTime: "06/04/2026 - 10:28am", status: "completed", purpose: "Standard" },
  { id: "#124572", from: "Grace Okonkwo", estimatedFare: 2_800, dateTime: "05/04/2026 - 3:05pm", status: "completed", purpose: "Standard" },
  { id: "#124571", from: "Adaeze Obiora", estimatedFare: 1_500, dateTime: "03/04/2026 - 7:05pm", status: "flagged", purpose: "Standard" },
];

const LOGS: LogRecord[] = [
  { id: "#124578", title: "Profile updated", dateTime: "14/04/2026 - 9:20am", status: "completed", purpose: "Standard" },
  { id: "#124579", title: "KYC submitted", dateTime: "13/04/2026 - 9:20am", status: "completed", purpose: "Standard" },
  { id: "#124580", title: "Vehicle docs updated", dateTime: "05/04/2026 - 10:22am", status: "completed", purpose: "Standard" },
  { id: "#124581", title: "Earnings withdrawal", dateTime: "10/04/2026 - 8:13am", status: "completed", purpose: "Finance" },
  { id: "#124582", title: "Trip accepted", dateTime: "14/04/2026 - 9:12am", status: "completed", purpose: "Operations" },
  { id: "#124583", title: "Trip completed", dateTime: "14/04/2026 - 9:41am", status: "completed", purpose: "Operations" },
  { id: "#124584", title: "Support request", dateTime: "08/04/2026 - 6:28am", status: "ongoing", purpose: "Support" },
  { id: "#124585", title: "Account verified", dateTime: "01/04/2026 - 3:05pm", status: "completed", purpose: "Standard" },
];

const BASE: Omit<DriverProfile, "id"> = {
  userType: "Driver",
  firstName: "Emeka", lastName: "Okonkwo",
  email: "emeka.o@email.com", phone: "+234 803 456 7890",
  accountStatus: "active", kycStatus: "approved", isVerified: true, rating: 4.8,
  dateOfBirth: "18/12/1990", nin: "A025023487", createdAt: "15/03/2023",
  bankName: "Zenith", bankAccount: "2389377973434", bankAccountName: "Emeka Okonkwo",
  address: "9B, 2 Collins Court Mall Street", city: "Ikeja", state: "Lagos", country: "Nigeria",
  emergencyContacts: [
    { relation: "Brother", name: "Akinbade Adekiya", phone: "+234-902345666" },
    { relation: "Sister", name: "Adaeze Okonkwo", phone: "+234-812345678" },
  ],
  verificationStatus: "rejected", verificationDate: "18/10/2025",
  reviewedBy: "Israel Gbadegesin",
  rejectionReason: "Documents were not clear enough, blurry",
  licenseNumber: "18/10/2025", licenseExpiry: "18/10/2025",
  vehicleMake: "Toyota", vehicleModel: "Corolla", vehicleYear: "2012",
  vehicleColor: "Silver", vehicleSeats: 5,
  vehicleVin: "ME335172B60GJLV8", vehicleChassis: "2F90R0C3RKT2507IN",
  vehicleEngine: "1NZ-FE Inline-4", vehiclePlate: "LND 234 XY",
  vehicleDocuments: [
    { label: "Vehicle Registration" },
    { label: "Proof of Ownership" },
    { label: "Roadworthiness" },
    { label: "Vehicle License" },
  ],
  totalTrips: 1_842, totalEarnings: 4_628_400,
  walletBalance: 85_000, totalSpent: 0, pendingPayment: 12_500,
  activities: ACTIVITIES, rides: RIDES, transactions: TRANSACTIONS, logs: LOGS,
};

const DB: Record<string, DriverProfile> = {
  drv_001: { ...BASE, id: "drv_001" },
  drv_002: { ...BASE, id: "drv_002", firstName: "Fatima", lastName: "Al-Hassan", email: "fatima.h@email.com", accountStatus: "pending", kycStatus: "pending", isVerified: false, rating: 3.0 },
  drv_003: { ...BASE, id: "drv_003", firstName: "Chukwuemeka", lastName: "Eze", email: "ceze@email.com", accountStatus: "suspended" },
  drv_004: { ...BASE, id: "drv_004", firstName: "Amina", lastName: "Bello", email: "amina.b@email.com", totalTrips: 3_411, totalEarnings: 8_527_250, rating: 4.9 },
  drv_005: { ...BASE, id: "drv_005", firstName: "Biodun", lastName: "Adewale", email: "biodun.a@email.com", accountStatus: "rejected", kycStatus: "rejected" },
  drv_006: { ...BASE, id: "drv_006", firstName: "Ngozi", lastName: "Ikenna", email: "ngozi.i@email.com", totalTrips: 978 },
  drv_007: { ...BASE, id: "drv_007", firstName: "Taiwo", lastName: "Afolabi", email: "taiwo.af@email.com", accountStatus: "pending", kycStatus: "pending", isVerified: false },
  drv_008: { ...BASE, id: "drv_008", firstName: "Suleiman", lastName: "Musa", email: "suleiman.m@email.com", totalTrips: 2_105 },
  drv_009: { ...BASE, id: "drv_009", firstName: "Adaeze", lastName: "Obi", email: "adaeze.o@email.com" },
  drv_010: { ...BASE, id: "drv_010", firstName: "Damilola", lastName: "Ogunyemi", email: "dami.o@email.com", accountStatus: "suspended" },
  drv_011: { ...BASE, id: "drv_011", firstName: "Ismaila", lastName: "Garba", email: "ismaila.g@email.com", accountStatus: "pending", kycStatus: "pending" },
  drv_012: { ...BASE, id: "drv_012", firstName: "Chisom", lastName: "Nwosu", email: "chisom.n@email.com", totalTrips: 3_890, totalEarnings: 9_725_000, rating: 4.9 },
  drv_013: { ...BASE, id: "drv_013", firstName: "Yetunde", lastName: "Fashola", email: "yetunde.f@email.com" },
  drv_014: { ...BASE, id: "drv_014", firstName: "Murtala", lastName: "Abdullahi", email: "murtala.a@email.com", accountStatus: "rejected", kycStatus: "rejected", rating: 2.8 },
  drv_015: { ...BASE, id: "drv_015", firstName: "Praise", lastName: "Uwem", email: "praise.u@email.com", totalTrips: 1_543 },
};

export function getDriverById(id: string): DriverProfile {
  return DB[id] ?? { ...BASE, id };
}
