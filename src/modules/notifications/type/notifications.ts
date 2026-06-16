export type NotificationChannel  = "push" | "sms" | "email" | "in_app";
export type NotificationTarget   = "individual" | "all_drivers" | "all_passengers" | "all_users" | "city";
export type NotificationStatus   = "draft" | "scheduled" | "sending" | "sent" | "failed" | "cancelled";
export type TriggerSource        = "manual" | "system";

export const VALID_CHANNELS: NotificationChannel[]  = ["push", "sms", "email", "in_app"];
export const VALID_TARGETS:  NotificationTarget[]   = ["individual", "all_drivers", "all_passengers", "all_users", "city"];
export const VALID_STATUSES: NotificationStatus[]   = ["draft", "scheduled", "sending", "sent", "failed", "cancelled"];
export const VALID_TRIGGER_SOURCES: TriggerSource[] = ["manual", "system"];

export interface NotificationPayload {
  title:        string;
  body:         string;
  channels:     NotificationChannel[];
  target:       NotificationTarget;
  target_id?:   string;
  scheduled_at?: string;
  metadata?:    Record<string, string>;
}

export interface DeliveryStats {
  total_recipients: number;
  push:    { sent: number; delivered: number; failed: number };
  sms:     { sent: number; delivered: number; failed: number };
  email:   { sent: number; delivered: number; failed: number };
  in_app:  { sent: number; read: number };
}

export interface NotificationRecord {
  id:             string;
  title:          string;
  body:           string;
  channels:       NotificationChannel[];
  target:         NotificationTarget;
  target_id?:     string;
  status:         NotificationStatus;
  scheduled_at?:  string;
  sent_at?:       string;
  trigger_source: TriggerSource;
  created_by:     string;
  created_at:     string;
  stats:          DeliveryStats;
}

export interface NotificationFilters {
  status?:         NotificationStatus;
  trigger_source?: TriggerSource;
  page?:           number;
  limit?:          number;
}
