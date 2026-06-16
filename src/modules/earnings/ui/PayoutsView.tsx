"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "@/shared/common/DataTable";
import StatusBadge from "@/shared/common/StatusBadge";
import BulkActionBar from "@/shared/common/BulkActionBar";
import SearchInput from "@/shared/forms/SearchInput";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format-currency";
import { exportToCsv } from "@/utils/export-csv";
import type { Payout, PayoutStatus } from "../services/payout.service";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PAYOUTS: Payout[] = [
  { id: "PYT-001", driverId: "drv_001", driverName: "Emeka Okonkwo", amount: 748_800, status: "paid", period: "Mar 2026", requestedAt: "2026-04-01", processedAt: "2026-04-03", bankName: "GTBank", accountNumber: "****5671" },
  { id: "PYT-002", driverId: "drv_004", driverName: "Amina Bello", amount: 1_027_200, status: "paid", period: "Mar 2026", requestedAt: "2026-04-01", processedAt: "2026-04-03", bankName: "Zenith Bank", accountNumber: "****2290" },
  { id: "PYT-003", driverId: "drv_012", driverName: "Chisom Nwosu", amount: 1_228_800, status: "approved", period: "Apr 2026", requestedAt: "2026-04-10", bankName: "First Bank", accountNumber: "****8834" },
  { id: "PYT-004", driverId: "drv_008", driverName: "Suleiman Musa", amount: 688_800, status: "processing", period: "Apr 2026", requestedAt: "2026-04-09", bankName: "UBA", accountNumber: "****4412" },
  { id: "PYT-005", driverId: "drv_015", driverName: "Praise Uwem", amount: 482_400, status: "pending", period: "Apr 2026", requestedAt: "2026-04-14", bankName: "Access Bank", accountNumber: "****7783" },
  { id: "PYT-006", driverId: "drv_006", driverName: "Ngozi Ikenna", amount: 374_400, status: "pending", period: "Apr 2026", requestedAt: "2026-04-13", bankName: "Stanbic IBTC", accountNumber: "****3356" },
  { id: "PYT-007", driverId: "drv_002", driverName: "Fatima Al-Hassan", amount: 108_000, status: "failed", period: "Apr 2026", requestedAt: "2026-04-08", processedAt: "2026-04-09", bankName: "Kuda Bank", accountNumber: "****1123" },
  { id: "PYT-008", driverId: "drv_011", driverName: "Ismaila Garba", amount: 160_800, status: "pending", period: "Apr 2026", requestedAt: "2026-04-14", bankName: "Wema Bank", accountNumber: "****9087" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PAYOUT_STATUS_FILTERS = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Processing", value: "processing" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
];

// Maps the current status to the status reached by advancing the lifecycle one step.
const NEXT_STATUS: Partial<Record<PayoutStatus, PayoutStatus>> = {
  pending: "approved",
  approved: "processing",
  processing: "paid",
};

const ADVANCE_LABEL: Record<PayoutStatus, string> = {
  pending: "Approve Payout",
  approved: "Mark as Processing",
  processing: "Mark as Paid",
  paid: "",
  failed: "",
};

const exportPayouts = (rows: Payout[], filename: string): void =>
  exportToCsv(
    ["Payout ID", "Driver", "Amount", "Period", "Status", "Bank", "Account", "Requested", "Processed"],
    rows.map((p) => [p.id, p.driverName, p.amount, p.period, p.status, p.bankName ?? "", p.accountNumber ?? "", p.requestedAt, p.processedAt ?? ""]),
    filename,
  );

// ─── Payout Detail Modal ───────────────────────────────────────────────────────

function PayoutDetailModal({
  payout,
  onClose,
  onAdvance,
  onRetry,
}: {
  payout: Payout;
  onClose: () => void;
  onAdvance: (id: string) => void;
  onRetry: (id: string) => void;
}): React.ReactNode {
  const next = NEXT_STATUS[payout.status];

  return (
    <ModalWrapper open onClose={onClose} title="Payout Details" size="md">
      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
          <span className="text-sm text-gray-500">Status</span>
          <StatusBadge status={payout.status} />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Payout ID", value: payout.id },
            { label: "Driver", value: payout.driverName },
            { label: "Amount", value: formatCurrency(payout.amount) },
            { label: "Period", value: payout.period },
            { label: "Bank", value: payout.bankName ?? "N/A" },
            { label: "Account Number", value: payout.accountNumber ?? "N/A" },
            { label: "Requested", value: payout.requestedAt },
            { label: "Processed", value: payout.processedAt ?? "—" },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-xs text-gray-400">{f.label}</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{f.value}</p>
            </div>
          ))}
        </div>

        {/* Lifecycle actions */}
        {(next || payout.status === "failed") && (
          <div className="flex gap-2 border-t border-gray-100 pt-4">
            {next && (
              <button
                onClick={() => { onAdvance(payout.id); onClose(); }}
                className="flex-1 rounded-lg bg-[var(--primary)] py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                {ADVANCE_LABEL[payout.status]}
              </button>
            )}
            {payout.status === "failed" && (
              <button
                onClick={() => { onRetry(payout.id); onClose(); }}
                className="flex-1 rounded-lg bg-amber-50 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
              >
                Retry Payout
              </button>
            )}
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export default function PayoutsView(): React.ReactNode {
  const [data, setData] = useState<Payout[]>(MOCK_PAYOUTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Payout[]>([]);
  const [detail, setDetail] = useState<Payout | null>(null);
  // swap with real query: const { data, isLoading } = usePayouts({ search, status: statusFilter });
  const loading = false;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((p) => {
      const matchSearch = !q || p.id.toLowerCase().includes(q) || p.driverName.toLowerCase().includes(q) || p.driverId.toLowerCase().includes(q);
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data, search, statusFilter]);

  const stats = useMemo(() => {
    const pending = data.filter((p) => p.status === "pending");
    const approved = data.filter((p) => p.status === "approved");
    const processing = data.filter((p) => p.status === "processing");
    const paid = data.filter((p) => p.status === "paid");
    return {
      pendingCount: pending.length,
      pendingAmount: pending.reduce((s, p) => s + p.amount, 0),
      approvedAmount: approved.reduce((s, p) => s + p.amount, 0),
      processingAmount: processing.reduce((s, p) => s + p.amount, 0),
      paidAmount: paid.reduce((s, p) => s + p.amount, 0),
    };
  }, [data]);

  const advanceStatus = (id: string): void => {
    setData((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const next = NEXT_STATUS[p.status];
      if (!next) return p;
      const today = new Date().toISOString().split("T")[0];
      return { ...p, status: next, processedAt: next === "paid" ? today : p.processedAt };
    }));
  };

  const retryPayout = (id: string): void => {
    setData((prev) => prev.map((p) => p.id === id ? { ...p, status: "pending" as const, processedAt: undefined } : p));
  };

  const bulkApprove = (): void => {
    const ids = new Set(selected.filter((p) => p.status === "pending").map((p) => p.id));
    setData((prev) => prev.map((p) => ids.has(p.id) ? { ...p, status: "approved" as const } : p));
    setSelected([]);
  };

  const canBulkApprove = selected.some((p) => p.status === "pending");

  const columns: ColumnDef<Payout, unknown>[] = [
    {
      id: "id",
      header: "Payout ID",
      accessorKey: "id",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs font-medium text-blue-700">{getValue() as string}</span>
      ),
    },
    {
      id: "driver",
      header: "Driver",
      accessorKey: "driverName",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.original.driverName}</p>
          <p className="text-xs text-gray-400">{row.original.driverId}</p>
        </div>
      ),
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      cell: ({ getValue }) => (
        <span className="text-sm font-semibold text-gray-900">{formatCurrency(getValue() as number)}</span>
      ),
    },
    {
      id: "period",
      header: "Period",
      accessorKey: "period",
      cell: ({ getValue }) => <span className="text-sm text-gray-600">{getValue() as string}</span>,
    },
    {
      id: "bank",
      header: "Bank",
      enableSorting: false,
      cell: ({ row }) => (
        <div>
          <p className="text-sm text-gray-700">{row.original.bankName ?? "N/A"}</p>
          <p className="text-xs text-gray-400">{row.original.accountNumber ?? ""}</p>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      id: "requestedAt",
      header: "Requested",
      accessorKey: "requestedAt",
      cell: ({ getValue }) => <span className="text-xs text-gray-500">{getValue() as string}</span>,
    },
    {
      id: "processedAt",
      header: "Processed",
      accessorKey: "processedAt",
      cell: ({ getValue }) => <span className="text-xs text-gray-500">{(getValue() as string | undefined) ?? "—"}</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const p = row.original;
        const next = NEXT_STATUS[p.status];
        return (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {next && (
              <button
                onClick={() => advanceStatus(p.id)}
                title={ADVANCE_LABEL[p.status]}
                className="rounded-md p-1.5 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
            {p.status === "failed" && (
              <button
                onClick={() => retryPayout(p.id)}
                title="Retry Payout"
                className="rounded-md p-1.5 text-amber-500 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setDetail(p)}
              title="View details"
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-5">
      {/* Payout stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: `Pending (${stats.pendingCount})`, value: stats.pendingAmount, color: "text-amber-700", bg: "bg-amber-50" },
          { label: "Approved", value: stats.approvedAmount, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Processing", value: stats.processingAmount, color: "text-indigo-700", bg: "bg-indigo-50" },
          { label: "Paid Out", value: stats.paidAmount, color: "text-emerald-700", bg: "bg-emerald-50" },
        ].map((s) => (
          <div key={s.label} className={cn("rounded-xl border border-gray-100 px-4 py-3 shadow-sm", s.bg)}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={cn("mt-1 text-xl font-bold", s.color)}>{formatCurrency(s.value)}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by payout ID or driver..."
          className="w-80"
        />
        <FilterDropdown
          options={PAYOUT_STATUS_FILTERS}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Status"
        />
        {(search || statusFilter) && (
          <button
            onClick={() => { setSearch(""); setStatusFilter(""); }}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">{filtered.length} results</span>
      </div>

      {/* Bulk action bar */}
      <BulkActionBar
        selectedCount={selected.length}
        onClear={() => setSelected([])}
        onApprove={canBulkApprove ? bulkApprove : undefined}
        approveLabel="Approve Selected"
        onExportCsv={() => exportPayouts(selected, "selected-payouts.csv")}
      />

      {/* Table */}
      <DataTable<Payout>
        data={filtered}
        columns={columns}
        loading={loading}
        pageSize={10}
        selectable
        onSelectionChange={setSelected}
      />

      {/* Detail modal */}
      {detail && (
        <PayoutDetailModal
          payout={detail}
          onClose={() => setDetail(null)}
          onAdvance={advanceStatus}
          onRetry={retryPayout}
        />
      )}
    </div>
  );
}
