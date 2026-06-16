import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MOCK_NOTIFICATIONS } from "../data/mock";
import {
  cancelNotification,
  fetchNotifications,
  sendNotification,
  type NotificationsListResponse,
} from "../services/notifications.service";
import { notificationKeys } from "../services/notifications.keys";
import type { NotificationFilters, NotificationPayload, NotificationRecord } from "../type/notifications";

const PLACEHOLDER: NotificationsListResponse = {
  notifications: MOCK_NOTIFICATIONS,
  total:         MOCK_NOTIFICATIONS.length,
  page:          1,
  limit:         20,
  totalPages:    1,
};

export function useNotifications(filters?: NotificationFilters) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey:        notificationKeys.list(filters),
    queryFn:         () => fetchNotifications(filters),
    placeholderData: PLACEHOLDER,
    staleTime:       30_000,
    retry:           1,
    refetchInterval: (q) => {
      const d = q.state.data as NotificationsListResponse | undefined;
      return d?.notifications.some((n: NotificationRecord) => n.status === "sending") ? 5000 : false;
    },
  });

  const send = useMutation({
    mutationFn: (payload: NotificationPayload) => sendNotification(payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: notificationKeys.all() }),
  });

  const cancel = useMutation({
    mutationFn: (id: string) => cancelNotification(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: notificationKeys.all() }),
  });

  const resolved = query.data ?? PLACEHOLDER;

  return {
    notifications: resolved.notifications,
    total:         resolved.total,
    page:          resolved.page,
    totalPages:    resolved.totalPages,
    isLoading:     query.isLoading,
    send,
    cancel,
  };
}
