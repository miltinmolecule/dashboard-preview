"use client";

import ModalWrapper from "@/shared/modals/ModalWrapper";
import type { NotificationChannel, NotificationRecord, NotificationStatus, TriggerSource } from "../type/notifications";

const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  push: "Push", sms: "SMS", email: "Email", in_app: "In-App",
};

const STATUS_STYLES: Record<NotificationStatus, string> = {
  draft:     "bg-gray-100 text-gray-600",
  scheduled: "bg-blue-100 text-blue-700",
  sending:   "bg-amber-100 text-amber-700",
  sent:      "bg-emerald-100 text-emerald-700",
  failed:    "bg-red-100 text-red-600",
  cancelled: "bg-gray-100 text-gray-500",
};

const SOURCE_STYLES: Record<TriggerSource, string> = {
  manual: "bg-blue-100 text-blue-700",
  system: "bg-purple-100 text-purple-700",
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

interface Props {
  notification: NotificationRecord;
  onClose: () => void;
  onCancel: (id: string) => void;
}

export default function NotificationDetailModal({
  notification: n,
  onClose,
  onCancel,
}: Props): React.ReactNode {
  const canCancel = n.status === "scheduled" && n.trigger_source === "manual";

  return (
    <ModalWrapper open onClose={onClose} title="Notification Details" size="lg">
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* Badges + title */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[n.status]}`}>
              {n.status.charAt(0).toUpperCase() + n.status.slice(1)}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${SOURCE_STYLES[n.trigger_source]}`}>
              {n.trigger_source === "manual" ? "Manual" : "Automated"}
            </span>
          </div>
          <h3 className="text-base font-semibold text-gray-900">{n.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{n.body}</p>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-400">Channels</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {n.channels.map((ch) => (
                <span key={ch} className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                  {CHANNEL_LABELS[ch]}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-400">Target</p>
            <p className="mt-0.5 text-sm font-medium capitalize text-gray-800">
              {n.target.replace(/_/g, " ")}
              {n.target_id && (
                <span className="ml-1 font-mono text-xs text-gray-500">({n.target_id})</span>
              )}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-400">Created by</p>
            <p className="mt-0.5 text-sm font-medium text-gray-800">{n.created_by}</p>
            <p className="text-xs text-gray-400">{fmtDate(n.created_at)}</p>
          </div>
          {n.sent_at && (
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-400">Sent at</p>
              <p className="mt-0.5 text-sm font-medium text-gray-800">{fmtDate(n.sent_at)}</p>
            </div>
          )}
          {n.scheduled_at && n.status === "scheduled" && (
            <div className="rounded-lg bg-blue-50 px-4 py-3">
              <p className="text-xs text-blue-500">Scheduled for</p>
              <p className="mt-0.5 text-sm font-medium text-blue-800">{fmtDate(n.scheduled_at)}</p>
            </div>
          )}
        </div>

        {/* Delivery stats */}
        {(n.status === "sent" || n.status === "sending") && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Delivery Stats
            </p>
            <div className="space-y-2 rounded-lg border border-gray-100 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Recipients</span>
                <span className="font-semibold text-gray-900">
                  {n.stats.total_recipients.toLocaleString()}
                </span>
              </div>

              {n.channels.includes("push") && (
                <div className="rounded-lg bg-blue-50 px-3 py-2">
                  <p className="mb-1 text-xs font-medium text-blue-700">Push</p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="text-gray-500">Sent</p>
                      <p className="font-bold text-gray-800">{n.stats.push.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Delivered</p>
                      <p className="font-bold text-emerald-700">{n.stats.push.delivered.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Failed</p>
                      <p className="font-bold text-red-600">{n.stats.push.failed.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {n.channels.includes("sms") && (
                <div className="rounded-lg bg-purple-50 px-3 py-2">
                  <p className="mb-1 text-xs font-medium text-purple-700">SMS</p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="text-gray-500">Sent</p>
                      <p className="font-bold text-gray-800">{n.stats.sms.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Delivered</p>
                      <p className="font-bold text-emerald-700">{n.stats.sms.delivered.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Failed</p>
                      <p className="font-bold text-red-600">{n.stats.sms.failed.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {n.channels.includes("email") && (
                <div className="rounded-lg bg-amber-50 px-3 py-2">
                  <p className="mb-1 text-xs font-medium text-amber-700">Email</p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="text-gray-500">Sent</p>
                      <p className="font-bold text-gray-800">{n.stats.email.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Delivered</p>
                      <p className="font-bold text-emerald-700">{n.stats.email.delivered.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Failed</p>
                      <p className="font-bold text-red-600">{n.stats.email.failed.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {n.channels.includes("in_app") && (
                <div className="rounded-lg bg-emerald-50 px-3 py-2">
                  <p className="mb-1 text-xs font-medium text-emerald-700">In-App</p>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div>
                      <p className="text-gray-500">Sent</p>
                      <p className="font-bold text-gray-800">{n.stats.in_app.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Read</p>
                      <p className="font-bold text-emerald-700">{n.stats.in_app.read.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {canCancel && (
          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={() => { onCancel(n.id); onClose(); }}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
            >
              Cancel Notification
            </button>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}
