import api from "@/lib/interceptor";
import { API_URLS } from "@/lib/api-urls";
import type { ApiResponse } from "@/config/types/generic";
import {
  VALID_CHANNELS,
  VALID_STATUSES,
  VALID_TARGETS,
  VALID_TRIGGER_SOURCES,
} from "../type/notifications";
import type {
  DeliveryStats,
  NotificationFilters,
  NotificationPayload,
  NotificationRecord,
} from "../type/notifications";

export interface NotificationsListResponse {
  notifications: NotificationRecord[];
  total:         number;
  page:          number;
  limit:         number;
  totalPages:    number;
}

function sanitisePayload(p: NotificationPayload): Record<string, unknown> {
  const channels = p.channels.filter((c) => VALID_CHANNELS.includes(c));
  if (!channels.length) throw new Error("At least one valid channel required");
  if (!VALID_TARGETS.includes(p.target)) throw new Error("Invalid target");
  if ((p.target === "individual" || p.target === "city") && !p.target_id)
    throw new Error("target_id required for this target type");

  const title = p.title.trim().slice(0, 100);
  const body  = p.body.trim().slice(0, 500);
  if (!title || !body) throw new Error("Title and body required");

  if (p.scheduled_at && new Date(p.scheduled_at) <= new Date())
    throw new Error("Scheduled time must be in the future");

  const metadata = p.metadata
    ? Object.fromEntries(
        Object.entries(p.metadata)
          .filter(([, v]) => typeof v === "string")
          .slice(0, 10),
      )
    : undefined;

  return {
    title, body, channels, target: p.target,
    ...(p.target_id    && { target_id:    p.target_id }),
    ...(p.scheduled_at && { scheduled_at: p.scheduled_at }),
    ...(metadata       && { metadata }),
  };
}

export const fetchNotifications = async (
  filters?: NotificationFilters,
): Promise<NotificationsListResponse> => {
  const { data } = await api.get<ApiResponse<NotificationsListResponse>>(
    API_URLS.NOTIFICATIONS.LIST,
    {
      params: {
        ...(filters?.status         &&
          VALID_STATUSES.includes(filters.status)              && { status:         filters.status }),
        ...(filters?.trigger_source &&
          VALID_TRIGGER_SOURCES.includes(filters.trigger_source) && { trigger_source: filters.trigger_source }),
        page:  Math.max(1, Math.min(filters?.page  ?? 1,  10000)),
        limit: Math.max(1, Math.min(filters?.limit ?? 20, 100)),
      },
    },
  );
  return data.data;
};

export const sendNotification = async (
  payload: NotificationPayload,
): Promise<NotificationRecord> => {
  const { data } = await api.post<ApiResponse<NotificationRecord>>(
    API_URLS.NOTIFICATIONS.LIST,
    sanitisePayload(payload),
  );
  return data.data;
};

export const cancelNotification = async (id: string): Promise<NotificationRecord> => {
  const { data } = await api.patch<ApiResponse<NotificationRecord>>(
    API_URLS.NOTIFICATIONS.CANCEL(id),
  );
  return data.data;
};

export const fetchNotificationStats = async (id: string): Promise<DeliveryStats> => {
  const { data } = await api.get<ApiResponse<DeliveryStats>>(
    API_URLS.NOTIFICATIONS.STATS(id),
  );
  return data.data;
};
