export type AuditEntityType =
  | "admin" | "ride" | "pricing" | "wallet"
  | "notification" | "rating" | "driver" | "passenger";

export type AuditAction =
  | "CREATE_ADMIN"  | "UPDATE_ADMIN"    | "DEACTIVATE_ADMIN" | "REACTIVATE_ADMIN"
  | "RESET_PASSWORD" | "UPDATE_PERMISSIONS"
  | "CANCEL_RIDE"   | "REFUND_RIDE"
  | "CREATE_PRICING" | "UPDATE_PRICING" | "DELETE_PRICING"   | "SURGE_TOGGLE"
  | "PROCESS_REFUND" | "FREEZE_WALLET"  | "UNFREEZE_WALLET"
  | "SEND_NOTIFICATION" | "CANCEL_NOTIFICATION"
  | "FLAG_RATING"   | "REMOVE_RATING"   | "RESTORE_RATING";

export const VALID_ENTITY_TYPES: AuditEntityType[] = [
  "admin", "ride", "pricing", "wallet",
  "notification", "rating", "driver", "passenger",
];

export const VALID_ACTIONS: AuditAction[] = [
  "CREATE_ADMIN", "UPDATE_ADMIN", "DEACTIVATE_ADMIN", "REACTIVATE_ADMIN",
  "RESET_PASSWORD", "UPDATE_PERMISSIONS",
  "CANCEL_RIDE", "REFUND_RIDE",
  "CREATE_PRICING", "UPDATE_PRICING", "DELETE_PRICING", "SURGE_TOGGLE",
  "PROCESS_REFUND", "FREEZE_WALLET", "UNFREEZE_WALLET",
  "SEND_NOTIFICATION", "CANCEL_NOTIFICATION",
  "FLAG_RATING", "REMOVE_RATING", "RESTORE_RATING",
];

export type ActionCategory = "destructive" | "sensitive" | "informational" | "restorative";

export const ACTION_CATEGORY: Record<AuditAction, ActionCategory> = {
  DEACTIVATE_ADMIN:     "destructive",
  DELETE_PRICING:       "destructive",
  REMOVE_RATING:        "destructive",
  FREEZE_WALLET:        "destructive",
  RESET_PASSWORD:       "sensitive",
  UPDATE_PERMISSIONS:   "sensitive",
  SURGE_TOGGLE:         "sensitive",
  PROCESS_REFUND:       "sensitive",
  CREATE_ADMIN:         "informational",
  UPDATE_ADMIN:         "informational",
  CREATE_PRICING:       "informational",
  UPDATE_PRICING:       "informational",
  SEND_NOTIFICATION:    "informational",
  FLAG_RATING:          "informational",
  CANCEL_RIDE:          "informational",
  REFUND_RIDE:          "informational",
  CANCEL_NOTIFICATION:  "informational",
  REACTIVATE_ADMIN:     "restorative",
  RESTORE_RATING:       "restorative",
  UNFREEZE_WALLET:      "restorative",
};

export const CATEGORY_STYLES: Record<ActionCategory, string> = {
  destructive:   "bg-red-100 text-red-700",
  sensitive:     "bg-orange-100 text-orange-700",
  informational: "bg-blue-100 text-blue-700",
  restorative:   "bg-emerald-100 text-emerald-700",
};

export const ENTITY_TYPE_STYLES: Record<AuditEntityType, string> = {
  admin:        "bg-purple-100 text-purple-700",
  ride:         "bg-blue-100 text-blue-700",
  pricing:      "bg-amber-100 text-amber-700",
  wallet:       "bg-emerald-100 text-emerald-700",
  notification: "bg-indigo-100 text-indigo-700",
  rating:       "bg-yellow-100 text-yellow-700",
  driver:       "bg-cyan-100 text-cyan-700",
  passenger:    "bg-pink-100 text-pink-700",
};

export const REDACTED_FIELDS = new Set([
  "password_hash", "password_reset_token", "fcm_token", "raw_ip",
]);

export interface AuditFilters {
  from?:        string;
  to?:          string;
  admin_id?:    string;
  action?:      AuditAction;
  entity_type?: AuditEntityType;
  entity_id?:   string;
  is_archived?: boolean;
  page?:        number;
  limit?:       number;
}

export interface AuditEntry {
  id:          string;
  admin:       { id: string; name: string; role: string };
  action:      AuditAction;
  entity_type: AuditEntityType;
  entity_id:   string;
  diff?:       Record<string, { before: unknown; after: unknown }>;
  ip_address:  string;
  city_id?:    string;
  city_name?:  string;
  created_at:  string;
  is_archived: boolean;
}

export interface AuditExportJob {
  id:            string;
  status:        "pending" | "ready" | "failed";
  download_url?: string;
  expires_at?:   string;
  created_at:    string;
}

export type ExportStatus = "idle" | "pending" | "ready" | "failed";
