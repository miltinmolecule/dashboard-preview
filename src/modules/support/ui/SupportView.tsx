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
import type { SupportTicket, TicketStatus } from "../services/support.service";
import { MOCK_SUPPORT_TICKETS } from "../services/support.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ADMINS = ["Admin Sarah", "Admin John", "Admin Tolu", "Admin Kemi"];

const PRIORITY_FILTERS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

const STATUS_FILTERS = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Escalated", value: "escalated" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

const PRIORITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};


const exportToCsv = (rows: SupportTicket[], filename: string): void => {
  const headers = ["ID", "User", "Email", "Type", "Priority", "Status", "Assigned", "Created"];
  const lines = rows.map((t) =>
    [t.id, t.userName, t.userEmail, t.complaintType, t.priority, t.status, t.assignedAdmin ?? "", t.createdAt].join(",")
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

// ─── Ticket Detail Modal ──────────────────────────────────────────────────────

function TicketDetailModal({
  ticket,
  onClose,
  onResolve,
  onEscalate,
  onAssign,
}: {
  ticket: SupportTicket;
  onClose: () => void;
  onResolve: (id: string) => void;
  onEscalate: (id: string) => void;
  onAssign: (id: string, admin: string) => void;
}): React.ReactNode {
  const [assignOpen, setAssignOpen] = useState(false);

  const priorityColor: Record<string, string> = {
    critical: "text-red-700 bg-red-50 border-red-200",
    high: "text-orange-700 bg-orange-50 border-orange-200",
    medium: "text-amber-700 bg-amber-50 border-amber-200",
    low: "text-gray-600 bg-gray-100 border-gray-200",
  };

  return (
    <ModalWrapper open onClose={onClose} size="lg">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900">{ticket.id}</h3>
            <StatusBadge status={ticket.status} />
            <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", priorityColor[ticket.priority])}>
              {ticket.priority}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{ticket.complaintType}</p>
        </div>
        <button
          onClick={onClose}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* User info */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { label: "User", value: ticket.userName },
          { label: "Email", value: ticket.userEmail },
          { label: "Created", value: ticket.createdAt },
          { label: "Assigned To", value: ticket.assignedAdmin ?? "Unassigned" },
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
        <p className="text-sm text-gray-700 leading-relaxed">{ticket.description}</p>
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center gap-2 flex-wrap">
        {(ticket.status === "open" || ticket.status === "in_progress") && (
          <button
            onClick={() => { onResolve(ticket.id); onClose(); }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Mark Resolved
          </button>
        )}
        {(ticket.status === "open" || ticket.status === "in_progress") && (
          <button
            onClick={() => { onEscalate(ticket.id); onClose(); }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            Escalate
          </button>
        )}
        <div className="relative">
          <button
            onClick={() => setAssignOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Assign Admin
          </button>
          {assignOpen && (
            <div className="absolute bottom-full mb-1 left-0 z-50 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
              {ADMINS.map((admin) => (
                <button
                  key={admin}
                  onClick={() => { onAssign(ticket.id, admin); setAssignOpen(false); }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors",
                    ticket.assignedAdmin === admin && "font-medium text-blue-600 bg-blue-50"
                  )}
                >
                  {admin}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}



// ─── Main view ────────────────────────────────────────────────────────────────

export default function SupportView(): React.ReactNode {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);
  const loading = false;

  const filtered = useMemo(() => {
    return tickets
      .filter((t) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          t.id.toLowerCase().includes(q) ||
          t.userName.toLowerCase().includes(q) ||
          t.complaintType.toLowerCase().includes(q);
        const matchPriority = !priorityFilter || t.priority === priorityFilter;
        const matchStatus = !statusFilter || t.status === statusFilter;
        return matchSearch && matchPriority && matchStatus;
      })
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  }, [tickets, search, priorityFilter, statusFilter]);

  const stats = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in_progress").length,
      escalated: tickets.filter((t) => t.status === "escalated").length,
      resolved: tickets.filter((t) => t.status === "resolved" || t.status === "closed").length,
    }),
    [tickets]
  );

  const updateStatus = (id: string, status: TicketStatus): void => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    if (selectedTicket?.id === id) setSelectedTicket((prev) => prev ? { ...prev, status } : prev);
  };

  const assignAdmin = (id: string, admin: string): void => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, assignedAdmin: admin, status: t.status === "open" ? "in_progress" : t.status } : t))
    );
    if (selectedTicket?.id === id) {
      setSelectedTicket((prev) => prev ? { ...prev, assignedAdmin: admin, status: prev.status === "open" ? "in_progress" : prev.status } : prev);
    }
  };

  const PRIORITY_BADGE: Record<string, string> = {
    critical: "bg-red-50 text-red-700 border border-red-200",
    high: "bg-orange-50 text-orange-700 border border-orange-200",
    medium: "bg-amber-50 text-amber-700 border border-amber-200",
    low: "bg-gray-100 text-gray-600 border border-gray-200",
  };

  const columns: ColumnDef<SupportTicket, unknown>[] = [
    {
      id: "id",
      header: "Ticket ID",
      accessorKey: "id",
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedTicket(row.original)}
          className="font-mono text-sm font-semibold text-[var(--primary)] hover:underline"
        >
          {row.original.id}
        </button>
      ),
    },
    {
      id: "user",
      header: "User",
      accessorKey: "userName",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.original.userName}</p>
          <p className="text-xs text-gray-400">{row.original.userEmail}</p>
        </div>
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
      id: "assignedAdmin",
      header: "Assigned To",
      accessorKey: "assignedAdmin",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-500">{(getValue() as string | null) ?? "—"}</span>
      ),
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
        const t = row.original;
        return (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedTicket(t)}
              title="View ticket"
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            {(t.status === "open" || t.status === "in_progress") && (
              <button
                onClick={() => updateStatus(t.id, "resolved")}
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
        title="Support Tickets"
        description="Manage user support requests and complaints"
        onExportToCsv={() => exportToCsv(filtered, "support-tickets.csv")}
      />

      {/* Stats strip */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-gray-900" },
          { label: "Open", value: stats.open, color: "text-blue-700" },
          { label: "In Progress", value: stats.inProgress, color: "text-amber-700" },
          { label: "Escalated", value: stats.escalated, color: "text-orange-700" },
          { label: "Resolved", value: stats.resolved, color: "text-emerald-700" },
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
          placeholder="Search ticket ID, user or type..."
          className="w-72"
        />
        <FilterDropdown
          options={PRIORITY_FILTERS}
          value={priorityFilter}
          onChange={setPriorityFilter}
          placeholder="Priority"
        />
        <FilterDropdown
          options={STATUS_FILTERS}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Status"
        />
        {(search || priorityFilter || statusFilter) && (
          <button
            onClick={() => { setSearch(""); setPriorityFilter(""); setStatusFilter(""); }}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">{filtered.length} results</span>
      </div>

      {/* Table */}
      <DataTable<SupportTicket>
        data={filtered}
        columns={columns}
        loading={loading}
        pageSize={10}
      />

      {/* Ticket detail modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onResolve={(id) => updateStatus(id, "resolved")}
          onEscalate={(id) => updateStatus(id, "escalated")}
          onAssign={assignAdmin}
        />
      )}
    </div>
  );
}
