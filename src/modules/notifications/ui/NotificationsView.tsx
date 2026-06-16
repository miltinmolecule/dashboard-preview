"use client";

import { cn } from "@/utils/cn";
import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import type { NotificationFilters, NotificationStatus, TriggerSource } from "../type/notifications";
import NotificationForm from "./NotificationForm";
import NotificationsTable from "./NotificationsTable";

type TabKey = "all" | "manual" | "automated" | "scheduled" | "sent" | "failed";

const TABS: { key: TabKey; label: string; params: NotificationFilters }[] = [
  { key: "all",       label: "All",       params: {} },
  { key: "manual",    label: "Manual",    params: { trigger_source: "manual"    as TriggerSource } },
  { key: "automated", label: "Automated", params: { trigger_source: "system"    as TriggerSource } },
  { key: "scheduled", label: "Scheduled", params: { status:         "scheduled" as NotificationStatus } },
  { key: "sent",      label: "Sent",      params: { status:         "sent"      as NotificationStatus } },
  { key: "failed",    label: "Failed",    params: { status:         "failed"    as NotificationStatus } },
];

export default function NotificationsView(): React.ReactNode {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [showForm,  setShowForm]  = useState(false);

  const currentParams = TABS.find((t) => t.key === activeTab)?.params ?? {};
  const hook = useNotifications(currentParams);

  const filteredData = (() => {
    const { status, trigger_source } = currentParams;
    return hook.notifications.filter((n) => {
      if (status         && n.status         !== status)         return false;
      if (trigger_source && n.trigger_source !== trigger_source) return false;
      return true;
    });
  })();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Send broadcasts and manage notification history
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Send Notification
        </button>
      </div>

      {/* Card */}
      <div className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-0.5 overflow-x-auto border-b border-gray-100 px-5 pt-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "whitespace-nowrap rounded-t px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          <NotificationsTable
            data={filteredData}
            loading={hook.isLoading}
            isCancelling={hook.cancel.isPending}
            onCancel={(id) => hook.cancel.mutate(id)}
          />
        </div>
      </div>

      {showForm && (
        <NotificationForm
          isSubmitting={hook.send.isPending}
          onClose={() => setShowForm(false)}
          onSubmit={async (payload) => {
            await hook.send.mutateAsync(payload);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
