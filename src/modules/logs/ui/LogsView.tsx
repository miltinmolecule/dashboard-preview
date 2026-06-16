"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { useAuditLog, useAuditExport } from "../hooks/useAuditLog";
import { useCurrentAdmin } from "@/modules/admin-management/hooks/useCurrentAdmin";
import type { AuditEntry, AuditFilters, ExportStatus } from "../type/audit-log";
import AuditFiltersBar from "./AuditFilters";
import AuditLogTable from "./AuditLogTable";
import AuditDetailModal from "./AuditDetailModal";

const ACK_KEY = "audit_export_ack";

type Tab = "active" | "archived";

function ExportStatusBadge({ status }: { status: ExportStatus }): React.ReactNode {
  if (status === "pending")
    return <span className="text-xs text-gray-500">Preparing export…</span>;
  if (status === "failed")
    return <span className="text-xs text-red-600">Export failed — try again</span>;
  if (status === "ready")
    return <span className="text-xs text-emerald-600">Export ready — downloading</span>;
  return null;
}

interface ComplianceModalProps {
  onConfirm: () => void;
  onCancel:  () => void;
}

function ComplianceModal({ onConfirm, onCancel }: ComplianceModalProps): React.ReactNode {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-base font-semibold text-gray-900">Data Export — Compliance Notice</h3>
        <p className="mt-3 text-sm text-gray-600">
          Audit logs may contain personal data including admin names, masked IP addresses, and action
          details. By proceeding, you confirm that you will handle and store this export in line with
          your NDPR / GDPR data policy.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            I understand — proceed
          </button>
        </div>
      </div>
    </div>
  );
}

interface ExportMenuProps {
  onExport:     (format: "csv" | "pdf") => void;
  exportStatus: ExportStatus;
}

function ExportMenu({ onExport, exportStatus }: ExportMenuProps): React.ReactNode {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={exportStatus === "pending"}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors",
          "hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1.5 w-36 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
            {(["csv", "pdf"] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => { setOpen(false); onExport(fmt); }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                Export {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function LogsView(): React.ReactNode {
  const [tab,          setTab]          = useState<Tab>("active");
  const [detail,       setDetail]       = useState<AuditEntry | null>(null);
  const [showCompliance, setShowCompliance] = useState(false);
  const [pendingFormat,  setPendingFormat]  = useState<"csv" | "pdf" | null>(null);
  const [filters,      setFilters]      = useState<AuditFilters>({
    page: 1, limit: 20, is_archived: false,
  });

  const { isSuperAdmin } = useCurrentAdmin();

  const activeFilters: AuditFilters = { ...filters, is_archived: tab === "archived" };
  const { entries, isLoading, total } = useAuditLog(activeFilters);
  const { request: exportReq, exportStatus, resetExport } = useAuditExport();

  const handleTabChange = (t: Tab): void => {
    setTab(t);
    setFilters((f) => ({ ...f, page: 1, is_archived: t === "archived" }));
    resetExport();
  };

  const handleFiltersChange = (f: AuditFilters): void => {
    setFilters({ ...f, is_archived: tab === "archived" });
  };

  const triggerExport = (format: "csv" | "pdf"): void => {
    const acked = sessionStorage.getItem(ACK_KEY) === "true";
    if (!acked) {
      setPendingFormat(format);
      setShowCompliance(true);
      return;
    }
    exportReq.mutate({ format, filters: activeFilters });
  };

  const confirmExport = (): void => {
    sessionStorage.setItem(ACK_KEY, "true");
    setShowCompliance(false);
    if (pendingFormat) {
      exportReq.mutate({ format: pendingFormat, filters: activeFilters });
      setPendingFormat(null);
    }
  };

  const cancelExport = (): void => {
    setShowCompliance(false);
    setPendingFormat(null);
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "active",   label: "Active" },
    { key: "archived", label: "Archived" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Audit Logs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Read-only record of all admin actions
            {total > 0 && (
              <span className="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {total.toLocaleString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <ExportStatusBadge status={exportStatus} />
          <ExportMenu onExport={triggerExport} exportStatus={exportStatus} />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <AuditFiltersBar
          filters={activeFilters}
          onChange={handleFiltersChange}
          showCity={isSuperAdmin}
        />
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 border-b border-gray-100">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={cn(
              "rounded-t-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === key
                ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <AuditLogTable
          entries={entries}
          loading={isLoading}
          onView={(entry) => setDetail(entry)}
        />
      </div>

      {/* Detail modal */}
      {detail && (
        <AuditDetailModal
          entry={detail}
          onClose={() => setDetail(null)}
        />
      )}

      {/* Compliance modal */}
      {showCompliance && (
        <ComplianceModal onConfirm={confirmExport} onCancel={cancelExport} />
      )}
    </div>
  );
}
