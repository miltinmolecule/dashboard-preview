"use client";

import DataTable from "@/shared/common/DataTable";
import { formatDate } from "@/utils/format-date";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import type {
  NotificationChannel,
  NotificationRecord,
  NotificationStatus,
  TriggerSource,
} from "../type/notifications";
import CancelModal from "./CancelModal";
import NotificationDetailModal from "./NotificationDetailModal";

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

interface Props {
  data:         NotificationRecord[];
  loading?:     boolean;
  isCancelling: boolean;
  onCancel:     (id: string) => void;
}

export default function NotificationsTable({
  data,
  loading = false,
  isCancelling,
  onCancel,
}: Props): React.ReactNode {
  const [detail,     setDetail]     = useState<NotificationRecord | null>(null);
  const [cancelling, setCancelling] = useState<NotificationRecord | null>(null);

  const columns: ColumnDef<NotificationRecord, unknown>[] = [
    {
      id:   "title",
      header: "Notification",
      cell: ({ row }) => (
        <div className="max-w-[260px]">
          <p className="truncate text-sm font-medium text-gray-900">{row.original.title}</p>
          <p className="truncate text-xs text-gray-400">{row.original.body}</p>
        </div>
      ),
    },
    {
      id:     "channels",
      header: "Channels",
      cell:   ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.channels.map((ch) => (
            <span key={ch} className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
              {CHANNEL_LABELS[ch]}
            </span>
          ))}
        </div>
      ),
    },
    {
      id:     "target",
      header: "Target",
      cell:   ({ row }) => (
        <span className="text-xs capitalize text-gray-700">
          {row.original.target.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      id:     "source",
      header: "Source",
      cell:   ({ row }) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${SOURCE_STYLES[row.original.trigger_source]}`}>
          {row.original.trigger_source === "manual" ? "Manual" : "Automated"}
        </span>
      ),
    },
    {
      id:     "status",
      header: "Status",
      cell:   ({ row }) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[row.original.status]}`}>
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </span>
      ),
    },
    {
      id:     "date",
      header: "Date",
      cell:   ({ row }) => (
        <span className="text-xs text-gray-500">
          {formatDate(
            row.original.sent_at ??
            row.original.scheduled_at ??
            row.original.created_at,
          )}
        </span>
      ),
    },
    {
      id:             "actions",
      header:         "",
      enableSorting:  false,
      cell:           ({ row }) => {
        const n = row.original;
        const canCancel = n.status === "scheduled" && n.trigger_source === "manual";
        return (
          <div className="flex items-center gap-0.5">
            <button
              onClick={(e) => { e.stopPropagation(); setDetail(n); }}
              title="View details"
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            {canCancel && (
              <button
                onClick={(e) => { e.stopPropagation(); setCancelling(n); }}
                title="Cancel notification"
                className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable<NotificationRecord>
        data={data}
        columns={columns}
        loading={loading}
        pageSize={10}
      />

      {detail && (
        <NotificationDetailModal
          notification={detail}
          onClose={() => setDetail(null)}
          onCancel={(id) => {
            setCancelling(data.find((n) => n.id === id) ?? null);
            setDetail(null);
          }}
        />
      )}

      {cancelling && (
        <CancelModal
          notificationTitle={cancelling.title}
          isLoading={isCancelling}
          onConfirm={() => { onCancel(cancelling.id); setCancelling(null); }}
          onClose={() => setCancelling(null)}
        />
      )}
    </>
  );
}
