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
import type { Transaction, Payout } from "../services/payments.service";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "TXN-001", userId: "usr_001", userName: "Tunde Bakare", driverId: "drv_001", driverName: "Emeka Okonkwo", amount: 3_200, status: "successful", paymentType: "card", description: "Trip payment", reference: "REF-2026-001", date: "2026-04-14", tripId: "TRP-2026-0001" },
  { id: "TXN-002", userId: "usr_006", userName: "Aisha Yusuf", driverId: "drv_004", driverName: "Amina Bello", amount: 2_800, status: "successful", paymentType: "wallet", description: "Trip payment", reference: "REF-2026-002", date: "2026-04-15", tripId: "TRP-2026-0002" },
  { id: "TXN-003", userId: "usr_002", userName: "Chidinma Okafor", driverId: "drv_006", driverName: "Ngozi Ikenna", amount: 1_500, status: "successful", paymentType: "transfer", description: "Trip payment", reference: "REF-2026-003", date: "2026-04-13", tripId: "TRP-2026-0003" },
  { id: "TXN-004", userId: "usr_004", userName: "Blessing Eze", driverId: "drv_008", driverName: "Suleiman Musa", amount: 4_100, status: "failed", paymentType: "card", description: "Trip payment failed", reference: "REF-2026-004", date: "2026-04-12", tripId: "TRP-2026-0004" },
  { id: "TXN-005", userId: "usr_010", userName: "Adaeze Obiora", driverId: "drv_012", driverName: "Chisom Nwosu", amount: 2_200, status: "successful", paymentType: "wallet", description: "Trip payment", reference: "REF-2026-005", date: "2026-04-11", tripId: "TRP-2026-0005" },
  { id: "TXN-006", userId: "usr_008", userName: "Grace Okonkwo", driverId: "drv_015", driverName: "Praise Uwem", amount: 1_800, status: "refunded", paymentType: "card", description: "Trip refund", reference: "REF-2026-006", date: "2026-04-10", tripId: "TRP-2026-0006" },
  { id: "TXN-007", userId: "usr_007", userName: "Emmanuel Nwosu", driverId: undefined, driverName: undefined, amount: 5_000, status: "successful", paymentType: "transfer", description: "Wallet top-up", reference: "REF-2026-007", date: "2026-04-09" },
  { id: "TXN-008", userId: "usr_003", userName: "Hakeem Adisa", driverId: undefined, driverName: undefined, amount: 2_500, status: "failed", paymentType: "card", description: "Wallet top-up failed", reference: "REF-2026-008", date: "2026-04-08" },
  { id: "TXN-009", userId: "usr_012", userName: "Oluwakemi Adeyemi", driverId: "drv_013", driverName: "Yetunde Fashola", amount: 900, status: "refunded", paymentType: "wallet", description: "Trip refund", reference: "REF-2026-009", date: "2026-04-07", tripId: "TRP-2026-0008" },
  { id: "TXN-010", userId: "usr_001", userName: "Tunde Bakare", driverId: "drv_001", driverName: "Emeka Okonkwo", amount: 2_500, status: "successful", paymentType: "card", description: "Trip payment", reference: "REF-2026-010", date: "2026-04-06", tripId: "TRP-2026-0009" },
  { id: "TXN-011", userId: "usr_011", userName: "Festus Agbaje", driverId: "drv_004", driverName: "Amina Bello", amount: 1_100, status: "pending", paymentType: "transfer", description: "Trip payment", reference: "REF-2026-011", date: "2026-04-05", tripId: "TRP-2026-0010" },
  { id: "TXN-012", userId: "usr_005", userName: "Olusegun Martins", driverId: undefined, driverName: undefined, amount: 10_000, status: "failed", paymentType: "card", description: "Wallet top-up failed", reference: "REF-2026-012", date: "2026-04-04" },
];

const MOCK_PAYOUTS: Payout[] = [
  { id: "PAY-001", driverId: "drv_001", driverName: "Emeka Okonkwo", amount: 180_000, status: "paid", requestedAt: "2026-04-01", processedAt: "2026-04-03", bankName: "GTBank", accountNumber: "****5671" },
  { id: "PAY-002", driverId: "drv_004", driverName: "Amina Bello", amount: 320_000, status: "paid", requestedAt: "2026-04-01", processedAt: "2026-04-03", bankName: "Zenith Bank", accountNumber: "****2290" },
  { id: "PAY-003", driverId: "drv_012", driverName: "Chisom Nwosu", amount: 450_000, status: "approved", requestedAt: "2026-04-10", bankName: "First Bank", accountNumber: "****8834" },
  { id: "PAY-004", driverId: "drv_008", driverName: "Suleiman Musa", amount: 215_000, status: "pending", requestedAt: "2026-04-13", bankName: "UBA", accountNumber: "****4412" },
  { id: "PAY-005", driverId: "drv_015", driverName: "Praise Uwem", amount: 165_000, status: "pending", requestedAt: "2026-04-14", bankName: "Access Bank", accountNumber: "****7783" },
  { id: "PAY-006", driverId: "drv_006", driverName: "Ngozi Ikenna", amount: 95_000, status: "failed", requestedAt: "2026-04-08", processedAt: "2026-04-09", bankName: "Stanbic IBTC", accountNumber: "****3356" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type ActiveTab = "all" | "payouts" | "refunds" | "failed";

const formatCurrency = (v: number): string => {
  if (v >= 1_000_000) return `₦${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `₦${(v / 1_000).toFixed(0)}K`;
  return `₦${v.toLocaleString()}`;
};

const PAYMENT_STATUS_FILTERS = [
  { label: "Successful", value: "successful" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

const PAYMENT_TYPE_FILTERS = [
  { label: "Card", value: "card" },
  { label: "Transfer", value: "transfer" },
  { label: "Wallet", value: "wallet" },
  { label: "Cash", value: "cash" },
];

const TYPE_LABELS: Record<string, string> = {
  card: "Card",
  transfer: "Transfer",
  wallet: "Wallet",
  cash: "Cash",
};

const exportToCsv = (rows: Transaction[], filename: string): void => {
  const headers = ["ID", "User", "Driver", "Amount", "Status", "Type", "Reference", "Date"];
  const lines = rows.map((t) =>
    [t.id, t.userName, t.driverName ?? "", t.amount, t.status, t.paymentType, t.reference, t.date].join(",")
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

// ─── Transaction Detail Modal ─────────────────────────────────────────────────

function TransactionDetailModal({
  tx,
  onClose,
  onRefund,
}: {
  tx: Transaction;
  onClose: () => void;
  onRefund: (id: string) => void;
}): React.ReactNode {
  return (
    <ModalWrapper open onClose={onClose} title="Transaction Details" size="md">
      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
          <span className="text-sm text-gray-500">Status</span>
          <StatusBadge status={tx.status} />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Transaction ID", value: tx.id },
            { label: "Reference", value: tx.reference },
            { label: "Amount", value: formatCurrency(tx.amount) },
            { label: "Payment Method", value: TYPE_LABELS[tx.paymentType] ?? tx.paymentType },
            { label: "User", value: tx.userName },
            { label: "Driver", value: tx.driverName ?? "N/A" },
            { label: "Description", value: tx.description },
            { label: "Date", value: tx.date },
            ...(tx.tripId ? [{ label: "Trip ID", value: tx.tripId }] : []),
          ].map((f) => (
            <div key={f.label}>
              <p className="text-xs text-gray-400">{f.label}</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{f.value}</p>
            </div>
          ))}
        </div>

        {/* Refund action */}
        {tx.status === "successful" && (
          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={() => { onRefund(tx.id); onClose(); }}
              className="w-full rounded-lg bg-red-50 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
            >
              Issue Refund
            </button>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export default function PaymentsView(): React.ReactNode {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedTxns, setSelectedTxns] = useState<Transaction[]>([]);
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);
  // swap with real query: const { data, isLoading } = useTransactions({ search, status: statusFilter, paymentType: typeFilter });
  const loading = false;
  const [txData, setTxData] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  const filtered = useMemo(() => {
    return txData.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch = !q || t.id.toLowerCase().includes(q) || t.userName.toLowerCase().includes(q) || (t.driverName?.toLowerCase().includes(q) ?? false) || t.reference.toLowerCase().includes(q);
      const matchStatus = !statusFilter || t.status === statusFilter;
      const matchType = !typeFilter || t.paymentType === typeFilter;
      const matchTab =
        activeTab === "all" ? true :
        activeTab === "payouts" ? false : // payouts shown in separate sub-view
        activeTab === "refunds" ? t.status === "refunded" :
        activeTab === "failed" ? t.status === "failed" : true;
      return matchSearch && matchStatus && matchType && matchTab;
    });
  }, [txData, search, statusFilter, typeFilter, activeTab]);

  const revenueStats = useMemo(() => {
    const successful = txData.filter((t) => t.status === "successful").reduce((s, t) => s + t.amount, 0);
    const refunded = txData.filter((t) => t.status === "refunded").reduce((s, t) => s + t.amount, 0);
    const failed = txData.filter((t) => t.status === "failed").reduce((s, t) => s + t.amount, 0);
    const pending = txData.filter((t) => t.status === "pending").reduce((s, t) => s + t.amount, 0);
    return { successful, refunded, failed, pending };
  }, [txData]);

  const handleRefund = (id: string): void => {
    setTxData((prev) => prev.map((t) => t.id === id ? { ...t, status: "refunded" as const } : t));
  };

  const tabs: Array<{ key: ActiveTab; label: string }> = [
    { key: "all", label: "All Transactions" },
    { key: "payouts", label: "Payouts" },
    { key: "refunds", label: "Refunds" },
    { key: "failed", label: "Failed" },
  ];

  const columns: ColumnDef<Transaction, unknown>[] = [
    {
      id: "id",
      header: "Transaction ID",
      accessorKey: "id",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs font-medium text-blue-700">{getValue() as string}</span>
      ),
    },
    {
      id: "user",
      header: "User",
      accessorKey: "userName",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.original.userName}</p>
          {row.original.driverName && (
            <p className="text-xs text-gray-400">Driver: {row.original.driverName}</p>
          )}
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
      id: "paymentType",
      header: "Method",
      accessorKey: "paymentType",
      cell: ({ getValue }) => (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
          {TYPE_LABELS[getValue() as string] ?? (getValue() as string)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      id: "description",
      header: "Description",
      accessorKey: "description",
      cell: ({ getValue }) => <span className="text-sm text-gray-600">{getValue() as string}</span>,
    },
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
      cell: ({ getValue }) => <span className="text-xs text-gray-500">{getValue() as string}</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <button
          onClick={(e) => { e.stopPropagation(); setDetailTx(row.original); }}
          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      ),
    },
  ];

  const payoutColumns: ColumnDef<Payout, unknown>[] = [
    {
      id: "id",
      header: "Payout ID",
      accessorKey: "id",
      cell: ({ getValue }) => <span className="font-mono text-xs font-medium text-blue-700">{getValue() as string}</span>,
    },
    {
      id: "driver",
      header: "Driver",
      accessorKey: "driverName",
      cell: ({ getValue }) => <span className="text-sm font-medium text-gray-900">{getValue() as string}</span>,
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      cell: ({ getValue }) => <span className="text-sm font-semibold text-gray-900">{formatCurrency(getValue() as number)}</span>,
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
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Payments &amp; Transactions</h1>
          <p className="mt-0.5 text-sm text-gray-500">Monitor revenue, payouts, refunds, and failed payments</p>
        </div>
        <button
          onClick={() => exportToCsv(filtered, "transactions.csv")}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Revenue stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Revenue", value: revenueStats.successful, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Refunded", value: revenueStats.refunded, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Failed", value: revenueStats.failed, color: "text-red-700", bg: "bg-red-50" },
          { label: "Pending", value: revenueStats.pending, color: "text-amber-700", bg: "bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className={cn("rounded-xl border border-gray-100 px-4 py-3 shadow-sm", s.bg)}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={cn("mt-1 text-xl font-bold", s.color)}>{formatCurrency(s.value)}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-gray-100 bg-white p-1 shadow-sm w-fit">
        {tabs.map((tab) => {
          const count =
            tab.key === "all" ? txData.length :
            tab.key === "payouts" ? MOCK_PAYOUTS.length :
            tab.key === "refunds" ? txData.filter((t) => t.status === "refunded").length :
            tab.key === "failed" ? txData.filter((t) => t.status === "failed").length : 0;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "rounded-lg px-4 py-1.5 text-xs font-medium transition-all",
                activeTab === tab.key ? "bg-[var(--primary)] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {tab.label}
              <span className={cn(
                "ml-1.5 rounded-full px-1.5 py-0.5 text-xs",
                activeTab === tab.key ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar — only for transaction tabs */}
      {activeTab !== "payouts" && (
        <div className="flex items-center gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by ID, user, driver, or reference..."
            className="w-80"
          />
          <FilterDropdown
            options={PAYMENT_STATUS_FILTERS}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Status"
          />
          <FilterDropdown
            options={PAYMENT_TYPE_FILTERS}
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="Method"
          />
          {(search || statusFilter || typeFilter) && (
            <button
              onClick={() => { setSearch(""); setStatusFilter(""); setTypeFilter(""); }}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          )}
          <span className="ml-auto text-xs text-gray-400">{filtered.length} results</span>
        </div>
      )}

      {/* Bulk action bar */}
      {activeTab !== "payouts" && (
        <BulkActionBar
          selectedCount={selectedTxns.length}
          onClear={() => setSelectedTxns([])}
          onExportCsv={() => exportToCsv(selectedTxns, "selected-transactions.csv")}
        />
      )}

      {/* Tables */}
      {activeTab === "payouts" ? (
        <DataTable<Payout>
          data={MOCK_PAYOUTS}
          columns={payoutColumns}
          loading={loading}
          pageSize={10}
        />
      ) : (
        <DataTable<Transaction>
          data={filtered}
          columns={columns}
          loading={loading}
          pageSize={10}
          selectable
          onSelectionChange={setSelectedTxns}
        />
      )}

      {/* Transaction detail modal */}
      {detailTx && (
        <TransactionDetailModal
          tx={detailTx}
          onClose={() => setDetailTx(null)}
          onRefund={handleRefund}
        />
      )}
    </div>
  );
}
