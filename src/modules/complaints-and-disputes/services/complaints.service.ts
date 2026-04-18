export type DisputeStatus = "open" | "reviewing" | "resolved" | "dismissed";
export type DisputePriority = "low" | "medium" | "high";

export type DisputeComplaintType =
  | "Fare Dispute"
  | "Driver Misconduct"
  | "Safety Incident"
  | "Trip Not Completed"
  | "Refund Not Received"
  | "Wrong Route";

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  driverName: string | null;
  rideId: string | null;
  complaintType: DisputeComplaintType;
  description: string;
  status: DisputeStatus;
  priority: DisputePriority;
  createdAt: string;
  resolvedAt: string | null;
}

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "DSP-001",
    userId: "usr_001",
    userName: "Tunde Bakare",
    driverName: "Emeka Okonkwo",
    rideId: "TRP-2026-0001",
    complaintType: "Fare Dispute",
    description: "Charged ₦5,000 instead of the quoted ₦3,200 fare. Driver claimed surge pricing but app did not show surge.",
    status: "reviewing",
    priority: "high",
    createdAt: "2026-04-14",
    resolvedAt: null,
  },
  {
    id: "DSP-002",
    userId: "usr_002",
    userName: "Chidinma Okafor",
    driverName: "Suleiman Musa",
    rideId: "TRP-2026-0002",
    complaintType: "Driver Misconduct",
    description: "Driver made inappropriate remarks during the trip. I have screenshots of the in-app chat.",
    status: "open",
    priority: "high",
    createdAt: "2026-04-13",
    resolvedAt: null,
  },
  {
    id: "DSP-003",
    userId: "usr_003",
    userName: "Hakeem Adisa",
    driverName: "Amina Bello",
    rideId: "TRP-2026-0003",
    complaintType: "Trip Not Completed",
    description: "Driver marked trip as completed but dropped me 2km from my destination.",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-04-10",
    resolvedAt: "2026-04-12",
  },
  {
    id: "DSP-004",
    userId: "usr_004",
    userName: "Blessing Eze",
    driverName: null,
    rideId: null,
    complaintType: "Refund Not Received",
    description: "Requested refund 5 days ago for failed trip. Still not received in wallet.",
    status: "reviewing",
    priority: "medium",
    createdAt: "2026-04-09",
    resolvedAt: null,
  },
  {
    id: "DSP-005",
    userId: "usr_005",
    userName: "Olusegun Martins",
    driverName: "Ngozi Ikenna",
    rideId: "TRP-2026-0005",
    complaintType: "Safety Incident",
    description: "Driver drove through flooded road against my objection. Car stalled and I was stranded for 2 hours.",
    status: "open",
    priority: "high",
    createdAt: "2026-04-15",
    resolvedAt: null,
  },
  {
    id: "DSP-006",
    userId: "usr_006",
    userName: "Aisha Yusuf",
    driverName: "Praise Uwem",
    rideId: "TRP-2026-0006",
    complaintType: "Fare Dispute",
    description: "Promo discount was not applied. Was charged full price despite valid promo code.",
    status: "dismissed",
    priority: "low",
    createdAt: "2026-04-08",
    resolvedAt: "2026-04-10",
  },
  {
    id: "DSP-007",
    userId: "usr_007",
    userName: "Emmanuel Nwosu",
    driverName: "Chisom Nwosu",
    rideId: "TRP-2026-0007",
    complaintType: "Driver Misconduct",
    description: "Driver was using the phone while driving and nearly caused an accident.",
    status: "reviewing",
    priority: "high",
    createdAt: "2026-04-12",
    resolvedAt: null,
  },
  {
    id: "DSP-008",
    userId: "usr_008",
    userName: "Grace Okonkwo",
    driverName: "Yetunde Fashola",
    rideId: "TRP-2026-0008",
    complaintType: "Wrong Route",
    description: "Driver took an unnecessarily long route increasing fare from estimated ₦1,500 to ₦2,800.",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-04-07",
    resolvedAt: "2026-04-09",
  },
];