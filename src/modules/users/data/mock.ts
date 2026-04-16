import type { UserProfile, ActivityItem, RideRecord, TransactionRecord, LogRecord } from "@/shared/profile/types";

const ACTIVITIES: ActivityItem[] = [
  { id: "a1", type: "trip", description: 'Cancelled "Ikorodu" to "Ajegunle" on 10/10/25 - 2:00PM.', date: "Aug 10, 2025", time: "10:10AM" },
  { id: "a2", type: "trip", description: 'Share trip from "Agege" to "Ikorodu" on 10/10/25 - 2:00PM.', date: "Aug 10, 2025", time: "10:10AM" },
  { id: "a3", type: "payment", description: 'Pay of ₦5,000 withdrawn from wallet for "Agege" to "Ikorodu" trip on 10/10/25 - 2:33PM.', date: "Aug 10, 2025", time: "10:10AM" },
  { id: "a4", type: "wallet", description: "Added ₦20,000 to wallet.", date: "Aug 1, 2025", time: "10:10AM" },
  { id: "a5", type: "wallet", description: "Added ₦20,000 to wallet.", date: "Aug 5, 2025", time: "10:10AM" },
  { id: "a6", type: "wallet", description: "Added ₦20,000 to wallet.", date: "Aug 5, 2025", time: "10:10AM" },
  { id: "a7", type: "profile", description: "Password changed successfully.", date: "July 28, 2025", time: "10:10AM" },
];

const RIDES: RideRecord[] = [
  { id: "3293875", location: "Ketu - Ejigbo", amount: 100, passengers: 2, dateTime: "2025-01-01", status: "ongoing" },
  { id: "2983423", location: "Ketu - Ejigbo", amount: 100, passengers: 3, dateTime: "2025-06-02", status: "completed" },
  { id: "9283433", location: "Ketu - Ejigbo", amount: 100, passengers: 4, dateTime: "2025-01-01", status: "completed" },
  { id: "2983845", location: "Ketu - Ejigbo", amount: 1_000, passengers: 4, dateTime: "2025-03-12", status: "completed" },
  { id: "8678457", location: "Ketu - Ejigbo", amount: 1_000, passengers: 2, dateTime: "2025-03-12", status: "completed" },
  { id: "2748y23", location: "Ketu - Ejigbo", amount: 1_000, passengers: 1, dateTime: "2025-03-12", status: "completed" },
  { id: "3787234", location: "Ketu - Ejigbo", amount: 5_000, passengers: 2, dateTime: "2025-05-10", status: "cancelled" },
  { id: "6783468", location: "Ketu - Ejigbo", amount: 5_000, passengers: 4, dateTime: "2025-05-10", status: "flagged" },
  { id: "2783455", location: "Ketu - Ejigbo", amount: 5_000, passengers: 4, dateTime: "2025-05-10", status: "cancelled" },
];

const TRANSACTIONS: TransactionRecord[] = [
  { id: "#124578", from: "John Doe", estimatedFare: 2_500, dateTime: "12/12/2025 - 10:20am", status: "ongoing", purpose: "Standard" },
  { id: "#124578", from: "John Doe", estimatedFare: 2_500, dateTime: "11/12/2025 - 9:20am", status: "ongoing", purpose: "Premium" },
  { id: "#124578", from: "John Doe", estimatedFare: 2_500, dateTime: "10/12/2025 - 10:22am", status: "in_progress", purpose: "Standard" },
  { id: "#124578", from: "John Doe", estimatedFare: 2_500, dateTime: "10/12/2025 - 8:13am", status: "in_progress", purpose: "Executive" },
  { id: "#124578", from: "John Doe", estimatedFare: 2_500, dateTime: "09/12/2025 - 9:12am", status: "ongoing", purpose: "Standard" },
  { id: "#124578", from: "John Doe", estimatedFare: 2_500, dateTime: "09/12/2025 - 9:41am", status: "ongoing", purpose: "Standard" },
  { id: "#124578", from: "John Doe", estimatedFare: 2_500, dateTime: "08/12/2025 - 18:28am", status: "ongoing", purpose: "Standard" },
  { id: "#124578", from: "John Doe", estimatedFare: 2_500, dateTime: "08/12/2025 - 15:05am", status: "ongoing", purpose: "Standard" },
];

const LOGS: LogRecord[] = [
  { id: "#124578", title: "Profile updated", dateTime: "12/12/2025 - 10:20am", status: "completed", purpose: "Standard" },
  { id: "#124579", title: "Login attempt", dateTime: "11/12/2025 - 9:20am", status: "ongoing", purpose: "Premium" },
  { id: "#124580", title: "Password reset", dateTime: "10/12/2025 - 10:22am", status: "in_progress", purpose: "Standard" },
  { id: "#124581", title: "Wallet topup", dateTime: "10/12/2025 - 8:13am", status: "completed", purpose: "Executive" },
  { id: "#124582", title: "Trip booked", dateTime: "09/12/2025 - 9:12am", status: "ongoing", purpose: "Standard" },
  { id: "#124583", title: "Trip completed", dateTime: "09/12/2025 - 9:41am", status: "completed", purpose: "Standard" },
  { id: "#124584", title: "Support request", dateTime: "08/12/2025 - 18:28am", status: "ongoing", purpose: "Standard" },
  { id: "#124585", title: "Account verified", dateTime: "08/12/2025 - 15:05am", status: "completed", purpose: "Standard" },
];

const BASE: Omit<UserProfile, "id"> = {
  userType: "User",
  firstName: "Tunde", lastName: "Bakare",
  email: "tunde.b@gmail.com", phone: "+234 803 100 2200",
  accountStatus: "active", isVerified: true, rating: 4.7,
  dateOfBirth: "18/07/1990", nin: "A025023487", createdAt: "01/06/2023",
  bankName: "Zenith", bankAccount: "2389377973434", bankAccountName: "Tunde Bakare",
  address: "9B, 2 Collins Court Mall Street", city: "Ikeja", state: "Lagos", country: "Nigeria",
  emergencyContacts: [
    { relation: "Brother", name: "Akinbade Adekiya", phone: "+234-902345666" },
    { relation: "Brother", name: "Akinbade Adekiya", phone: "+234-902345666" },
  ],
  verificationStatus: "rejected", verificationDate: "18/10/2025",
  reviewedBy: "Israel Gbadegesin",
  rejectionReason: "Documents were not clear enough, blurry",
  licenseNumber: "18/10/2025", licenseExpiry: "18/10/2025",
  walletBalance: 6_500, totalSpent: 620_345, pendingPayment: 2_545, totalTrips: 128,
  activities: ACTIVITIES, rides: RIDES, transactions: TRANSACTIONS, logs: LOGS,
};

const DB: Record<string, UserProfile> = {
  usr_001: { ...BASE, id: "usr_001" },
  usr_002: { ...BASE, id: "usr_002", firstName: "Chidinma", lastName: "Okafor", email: "chidinma.o@gmail.com", phone: "+234 812 200 3300", rating: 4.9 },
  usr_003: { ...BASE, id: "usr_003", firstName: "Hakeem", lastName: "Adisa", email: "hakeem.a@gmail.com", accountStatus: "suspended" },
  usr_004: { ...BASE, id: "usr_004", firstName: "Blessing", lastName: "Eze", email: "blessing.e@gmail.com", walletBalance: 8_750 },
  usr_005: { ...BASE, id: "usr_005", firstName: "Olusegun", lastName: "Martins", email: "segun.m@gmail.com", accountStatus: "flagged", rating: 2.5 },
  usr_006: { ...BASE, id: "usr_006", firstName: "Aisha", lastName: "Yusuf", email: "aisha.y@gmail.com", walletBalance: 22_100, totalTrips: 301 },
  usr_007: { ...BASE, id: "usr_007", firstName: "Emmanuel", lastName: "Nwosu", email: "emman.n@gmail.com" },
  usr_008: { ...BASE, id: "usr_008", firstName: "Grace", lastName: "Okonkwo", email: "grace.ok@gmail.com", rating: 4.8, walletBalance: 12_300 },
  usr_009: { ...BASE, id: "usr_009", firstName: "Kabiru", lastName: "Salami", email: "kabiru.s@gmail.com", accountStatus: "deleted" },
  usr_010: { ...BASE, id: "usr_010", firstName: "Adaeze", lastName: "Obiora", email: "adaeze.ob@gmail.com", walletBalance: 36_000, totalTrips: 445, rating: 4.9 },
  usr_011: { ...BASE, id: "usr_011", firstName: "Festus", lastName: "Agbaje", email: "festus.a@gmail.com", accountStatus: "suspended" },
  usr_012: { ...BASE, id: "usr_012", firstName: "Oluwakemi", lastName: "Adeyemi", email: "kemi.ad@gmail.com" },
};

export function getUserById(id: string): UserProfile {
  return DB[id] ?? { ...BASE, id };
}
