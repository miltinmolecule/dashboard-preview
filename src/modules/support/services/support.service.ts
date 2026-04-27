export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketStatus = "open" | "in_progress" | "resolved" | "escalated" | "closed";

export type TicketComplaintType =
  | "Payment Issue"
  | "Driver Conduct"
  | "App Bug"
  | "Lost Item"
  | "Safety Concern"
  | "Account Access"
  | "Promo Code";

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  complaintType: TicketComplaintType;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  assignedAdmin: string | null;
  description: string;
}

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "TKT-001",
    userId: "usr_001",
    userName: "Tunde Bakare",
    userEmail: "tunde.b@gmail.com",
    complaintType: "Payment Issue",
    priority: "high",
    status: "open",
    createdAt: "2026-04-14",
    assignedAdmin: null,
    description: "My wallet was debited but the trip was cancelled. Need refund of ₦3,200.",
  },
  {
    id: "TKT-002",
    userId: "usr_002",
    userName: "Chidinma Okafor",
    userEmail: "chidinma.o@gmail.com",
    complaintType: "Driver Conduct",
    priority: "medium",
    status: "in_progress",
    createdAt: "2026-04-13",
    assignedAdmin: "Admin Sarah",
    description: "Driver was rude and took a longer route than necessary.",
  },
  {
    id: "TKT-003",
    userId: "usr_003",
    userName: "Hakeem Adisa",
    userEmail: "hakeem.a@gmail.com",
    complaintType: "Account Access",
    priority: "critical",
    status: "escalated",
    createdAt: "2026-04-12",
    assignedAdmin: "Admin Sarah",
    description: "Cannot log into my account. Password reset email not received.",
  },
  {
    id: "TKT-004",
    userId: "usr_004",
    userName: "Blessing Eze",
    userEmail: "blessing.e@gmail.com",
    complaintType: "App Bug",
    priority: "low",
    status: "resolved",
    createdAt: "2026-04-10",
    assignedAdmin: "Admin John",
    description: "Map was showing wrong pickup location. Resolved after app restart.",
  },
  {
    id: "TKT-005",
    userId: "usr_005",
    userName: "Olusegun Martins",
    userEmail: "segun.m@gmail.com",
    complaintType: "Payment Issue",
    priority: "high",
    status: "open",
    createdAt: "2026-04-15",
    assignedAdmin: null,
    description: "Double charged for a single trip. Transaction IDs: TXN-012 and TXN-013.",
  },
  {
    id: "TKT-006",
    userId: "usr_006",
    userName: "Aisha Yusuf",
    userEmail: "aisha.y@gmail.com",
    complaintType: "Lost Item",
    priority: "medium",
    status: "in_progress",
    createdAt: "2026-04-14",
    assignedAdmin: "Admin John",
    description: "Left my bag in the driver's car. Need driver contact details.",
  },
  {
    id: "TKT-007",
    userId: "usr_007",
    userName: "Emmanuel Nwosu",
    userEmail: "emman.n@gmail.com",
    complaintType: "Safety Concern",
    priority: "critical",
    status: "escalated",
    createdAt: "2026-04-13",
    assignedAdmin: "Admin Sarah",
    description: "Driver was speeding and driving erratically. Felt unsafe.",
  },
  {
    id: "TKT-008",
    userId: "usr_008",
    userName: "Grace Okonkwo",
    userEmail: "grace.ok@gmail.com",
    complaintType: "Promo Code",
    priority: "low",
    status: "closed",
    createdAt: "2026-04-08",
    assignedAdmin: "Admin John",
    description: "Promo code RIDE20 not applying discount at checkout.",
  },
  {
    id: "TKT-009",
    userId: "usr_010",
    userName: "Adaeze Obiora",
    userEmail: "adaeze.ob@gmail.com",
    complaintType: "Driver Conduct",
    priority: "medium",
    status: "open",
    createdAt: "2026-04-15",
    assignedAdmin: null,
    description: "Driver cancelled trip 5 minutes after accepting, causing me to be late.",
  },
  {
    id: "TKT-010",
    userId: "usr_012",
    userName: "Oluwakemi Adeyemi",
    userEmail: "kemi.ad@gmail.com",
    complaintType: "App Bug",
    priority: "medium",
    status: "resolved",
    createdAt: "2026-04-09",
    assignedAdmin: "Admin Sarah",
    description: "Trip history not loading on the app. Shows blank screen.",
  },
];
