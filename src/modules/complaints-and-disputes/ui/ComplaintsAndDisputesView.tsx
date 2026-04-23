"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "@/shared/common/DataTable";
import StatusBadge from "@/shared/common/StatusBadge";
import SearchInput from "@/shared/forms/SearchInput";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import DashboardHeader from "@/shared/cards/DashboardHeader";
import { cn } from "@/utils/cn";
import type { Complaint, DisputeStatus, DisputeComplaintType } from "../services/complaints.service";
import { MOCK_COMPLAINTS } from "../services/complaints.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_FILTERS = [
  { label: "Open", value: "open" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Resolved", value: "resolved" },
  { label: "Dismissed", value: "dismissed" },
];

const PRIORITY_FILTERS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const TYPE_FILTERS: { label: string; value: DisputeComplaintType }[] = [
  { label: "Fare Dispute", value: "Fare Dispute" },
  { label: "Driver Misconduct", value: "Driver Misconduct" },
  { label: "Safety Incident", value: "Safety Incident" },
  { label: "Trip Not Completed", value: "Trip Not Completed" },
  { label: "Refund Not Received", value: "Refund Not Received" },
  { label: "Wrong Route", value: "Wrong Route" },
];

const PRIORITY_BADGE: Record<string, string> = {
  high: "bg-orange-50 text-orange-700 border border-orange-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  low: "bg-gray-100 text-gray-600 border border-gray-200",
};

const exportToCsv = (rows: Complaint[], filename: string): void => {
  const headers = ["ID", "User", "Driver", "Ride ID", "Type", "Priority", "Status", "Created", "Resolved"];
  const lines = rows.map((c) =>
    [c.id, c.userName, c.driverName ?? "", c.rideId ?? "", c.complaintType, c.priority, c.status, c.createdAt, c.resolvedAt ?? ""].join(",")
  );
  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

function ComplaintDetailModal({
  complaint,
  onClose,
  onResolve,
  onDismiss,
  onReview,
}: {
  complaint: Complaint;
  onClose: () => void;
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
  onReview: (id: string) => void;
}): React.ReactNode {
  return (
    <ModalWrapper open onClose={onClose} size="lg">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900">{complaint.id}</h3>
            <StatusBadge status={complaint.status} />
            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", PRIORITY_BADGE[complaint.priority])}>
              {complaint.priority}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{complaint.complaintType}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Info grid */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { label: "Filed By", value: complaint.userName },
          { label: "Driver", value: complaint.driverName ?? "N/A" },
          { label: "Ride ID", value: complaint.rideId ?? "N/A" },
          { label: "Created", value: complaint.createdAt },
          { label: "Resolved", value: complaint.resolvedAt ?? "Pending" },
        ].map((f) => (
          <div key={f.label} className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-400">{f.label}</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">{f.value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Description</p>
        <p className="text-sm text-gray-700 leading-relaxed">{complaint.description}</p>
      </div>

      {/* Actions */}
      {(complaint.status === "open" || complaint.status === "reviewing") && (
        <div className="mt-5 flex items-center gap-2 flex-wrap">
          {complaint.status === "open" && (
            <button
              onClick={() => { onReview(complaint.id); onClose(); }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Start Review
            </button>
          )}
          <button
            onClick={() => { onResolve(complaint.id); onClose(); }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Mark Resolved
          </button>
          <button
            onClick={() => { onDismiss(complaint.id); onClose(); }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}
    </ModalWrapper>
  );
}

export default function ComplaintsAndDisputesView(): React.ReactNode {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const loading = false;

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.userName.toLowerCase().includes(q) ||
        (c.driverName?.toLowerCase().includes(q) ?? false) ||
        c.complaintType.toLowerCase().includes(q);
      const matchStatus = !statusFilter || c.status === statusFilter;
      const matchPriority = !priorityFilter || c.priority === priorityFilter;
      const matchType = !typeFilter || c.complaintType === typeFilter;
      return matchSearch && matchStatus && matchPriority && matchType;
    });
  }, [complaints, search, statusFilter, priorityFilter, typeFilter]);

  const stats = useMemo(
    () => ({
      total: complaints.length,
      open: complaints.filter((c) => c.status === "open").length,
      reviewing: complaints.filter((c) => c.status === "reviewing").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
      dismissed: complaints.filter((c) => c.status === "dismissed").length,
    }),
    [complaints]
  );

  const updateStatus = (id: string, status: DisputeStatus): void => {
    const resolvedAt = (status === "resolved" || status === "dismissed") ? new Date().toISOString().split("T")[0] : null;
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status, resolvedAt } : c)));
    if (selectedComplaint?.id === id) setSelectedComplaint((prev) => prev ? { ...prev, status, resolvedAt } : prev);
  };

  const columns: ColumnDef<Complaint, unknown>[] = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedComplaint(row.original)}
          className="font-mono text-sm font-semibold text-[var(--primary)] hover:underline"
        >
          {row.original.id}
        </button>
      ),
    },
    {
      id: "user",
      header: "Filed By",
      accessorKey: "userName",
      cell: ({ getValue }) => (
        <span className="text-sm font-medium text-gray-900">{getValue() as string}</span>
      ),
    },
    {
      id: "driver",
      header: "Driver",
      accessorKey: "driverName",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">{(getValue() as string | null) ?? "—"}</span>
      ),
    },
    {
      id: "complaintType",
      header: "Type",
      accessorKey: "complaintType",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-700">{getValue() as string}</span>
      ),
    },
    {
      id: "priority",
      header: "Priority",
      accessorKey: "priority",
      cell: ({ getValue }) => {
        const p = getValue() as string;
        return (
          <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", PRIORITY_BADGE[p])}>
            {p}
          </span>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      id: "createdAt",
      header: "Created",
      accessorKey: "createdAt",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-400">{getValue() as string}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedComplaint(c)}
              title="View dispute"
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            {(c.status === "open" || c.status === "reviewing") && (
              <button
                onClick={() => updateStatus(c.id, "resolved")}
                title="Resolve"
                className="rounded-md p-1.5 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-5">
      <DashboardHeader
        title="Complaints & Disputes"
        description="Review and resolve user complaints and trip disputes"
        onExportToCsv={() => exportToCsv(filtered, "complaints.csv")}
      />

      {/* Stats strip */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-gray-900" },
          { label: "Open", value: stats.open, color: "text-blue-700" },
          { label: "Reviewing", value: stats.reviewing, color: "text-amber-700" },
          { label: "Resolved", value: stats.resolved, color: "text-emerald-700" },
          { label: "Dismissed", value: stats.dismissed, color: "text-gray-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={cn("mt-1 text-xl font-bold", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search ID, user, driver or type..."
          className="w-72"
        />
        <FilterDropdown
          options={STATUS_FILTERS}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Status"
        />
        <FilterDropdown
          options={PRIORITY_FILTERS}
          value={priorityFilter}
          onChange={setPriorityFilter}
          placeholder="Priority"
        />
        <FilterDropdown
          options={TYPE_FILTERS}
          value={typeFilter}
          onChange={setTypeFilter}
          placeholder="Type"
        />
        {(search || statusFilter || priorityFilter || typeFilter) && (
          <button
            onClick={() => { setSearch(""); setStatusFilter(""); setPriorityFilter(""); setTypeFilter(""); }}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">{filtered.length} results</span>
      </div>

      {/* Table */}
      <DataTable<Complaint>
        data={filtered}
        columns={columns}
        loading={loading}
        pageSize={10}
      />

      {/* Complaint detail modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onResolve={(id) => updateStatus(id, "resolved")}
          onDismiss={(id) => updateStatus(id, "dismissed")}
          onReview={(id) => updateStatus(id, "reviewing")}
        />
      )}
    </div>
  );
}
