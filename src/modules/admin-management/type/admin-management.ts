export type AdminRole   = "super_admin" | "city_admin" | "support_admin" | "finance_admin";
export type AdminScope  = "global" | "city";
export type AdminStatus = "active" | "inactive";

export const VALID_ROLES:    AdminRole[]    = ["super_admin", "city_admin", "support_admin", "finance_admin"];
export const VALID_SCOPES:   AdminScope[]   = ["global", "city"];
export const VALID_STATUSES: AdminStatus[]  = ["active", "inactive"];

export const ROLE_HIERARCHY: AdminRole[] = [
  "super_admin", "city_admin", "support_admin", "finance_admin",
];

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin:    "Super Admin",
  city_admin:     "City Admin",
  support_admin:  "Support Admin",
  finance_admin:  "Finance Admin",
};

export const ROLE_STYLES: Record<AdminRole, string> = {
  super_admin:    "bg-purple-100 text-purple-700",
  city_admin:     "bg-blue-100 text-blue-700",
  support_admin:  "bg-emerald-100 text-emerald-700",
  finance_admin:  "bg-amber-100 text-amber-700",
};

export function canAssignRole(callerRole: AdminRole, targetRole: AdminRole): boolean {
  return ROLE_HIERARCHY.indexOf(callerRole) <= ROLE_HIERARCHY.indexOf(targetRole);
}

export interface AdminRecord {
  id:          string;
  name:        string;
  email:       string;
  role:        AdminRole;
  scope:       AdminScope;
  city_id?:    string;
  city_name?:  string;
  status:      AdminStatus;
  last_login?: string;
  created_at:  string;
  created_by:  string;
}

export interface AdminPermissions {
  can_manage_drivers:     boolean;
  can_manage_passengers:  boolean;
  can_manage_pricing:     boolean;
  can_manage_admins:      boolean;
  can_view_analytics:     boolean;
  can_send_notifications: boolean;
  can_process_refunds:    boolean;
}

export const PERMISSION_LABELS: Record<keyof AdminPermissions, string> = {
  can_manage_drivers:     "Manage Drivers",
  can_manage_passengers:  "Manage Passengers",
  can_manage_pricing:     "Manage Pricing",
  can_manage_admins:      "Manage Admins",
  can_view_analytics:     "View Analytics",
  can_send_notifications: "Send Notifications",
  can_process_refunds:    "Process Refunds",
};

export interface ActivityLog {
  id:          string;
  admin_id:    string;
  admin_name:  string;
  action:      string;
  entity_type: string;
  entity_id:   string;
  ip_address:  string;
  created_at:  string;
}

export interface AdminFilters {
  role?:   AdminRole;
  status?: AdminStatus;
  scope?:  AdminScope;
  page?:   number;
  limit?:  number;
}

export interface CreateAdminDto {
  name:     string;
  email:    string;
  role:     AdminRole;
  scope:    AdminScope;
  city_id?: string;
}

export interface UpdateAdminDto {
  name?:    string;
  role?:    AdminRole;
  scope?:   AdminScope;
  city_id?: string;
}
