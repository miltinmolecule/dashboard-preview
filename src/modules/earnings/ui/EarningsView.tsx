"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "@/shared/common/DataTable";
import DashboardHeader from "@/shared/cards/DashboardHeader";
import SearchInput from "@/shared/forms/SearchInput";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format-currency";
import { exportToCsv } from "@/utils/export-csv";
import type { DriverEarning } from "../services/earnings.service";
import PayoutsView from "./PayoutsView";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_DRIVER_EARNINGS: DriverEarning[] = [
  { id: "ERN-001", driverId: "drv_001", driverName: "Emeka Okonkwo", totalTrips: 312, grossEarnings: 936_000, commissionRate: 0.2, commission: 187_200, netEarnings: 748_800, pendingPayout: 0, lastPayoutDate: "2026-04-03", period: "Apr 2026" },
  { id: "ERN-002", driverId: "drv_004", driverName: "Amina Bello", totalTrips: 428, grossEarnings: 1_284_000, commissionRate: 0.2, commission: 256_800, netEarnings: 1_027_200, pendingPayout: 0, lastPayoutDate: "2026-04-03", period: "Apr 2026" },
  { id: "ERN-003", driverId: "drv_006", driverName: "Ngozi Ikenna", totalTrips: 156, grossEarnings: 468_000, commissionRate: 0.2, commission: 93_600, netEarnings: 374_400, pendingPayout: 374_400, lastPayoutDate: "2026-03-05", period: "Apr 2026" },
  { id: "ERN-004", driverId: "drv_008", driverName: "Suleiman Musa", totalTrips: 287, grossEarnings: 861_000, commissionRate: 0.2, commission: 172_200, netEarnings: 688_800, pendingPayout: 688_800, lastPayoutDate: "2026-03-05", period: "Apr 2026" },
  { id: "ERN-005", driverId: "drv_012", driverName: "Chisom Nwosu", totalTrips: 512, grossEarnings: 1_536_000, commissionRate: 0.2, commission: 307_200, netEarnings: 1_228_800, pendingPayout: 1_228_800, lastPayoutDate: "2026-03-05", period: "Apr 2026" },
  { id: "ERN-006", driverId: "drv_013", driverName: "Yetunde Fashola", totalTrips: 98, grossEarnings: 294_000, commissionRate: 0.2, commission: 58_800, netEarnings: 235_200, pendingPayout: 0, lastPayoutDate: "2026-04-01", period: "Apr 2026" },
  { id: "ERN-007", driverId: "drv_015", driverName: "Praise Uwem", totalTrips: 201, grossEarnings: 603_000, commissionRate: 0.2, commission: 120_600, netEarnings: 482_400, pendingPayout: 482_400, lastPayoutDate: "2026-03-09", period: "Apr 2026" },
  { id: "ERN-008", driverId: "drv_002", driverName: "Fatima Al-Hassan", totalTrips: 45, grossEarnings: 135_000, commissionRate: 0.2, commission: 27_000, netEarnings: 108_000, pendingPayout: 108_000, period: "Apr 2026" },
  { id: "ERN-009", driverId: "drv_009", driverName: "Adaeze Obi", totalTrips: 178, grossEarnings: 534_000, commissionRate: 0.2, commission: 106_800, netEarnings: 427_200, pendingPayout: 0, lastPayoutDate: "2026-04-02", period: "Apr 2026" },
  { id: "ERN-010", driverId: "drv_011", driverName: "Ismaila Garba", totalTrips: 67, grossEarnings: 201_000, commissionRate: 0.2, commission: 40_200, netEarnings: 160_800, pendingPayout: 160_800, period: "Apr 2026" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const exportEarnings = (rows: DriverEarning[], filename: string): void =>
  exportToCsv(
    ["Driver ID", "Driver", "Trips", "Gross Earnings", "Commission", "Net Earnings", "Pending Payout", "Last Payout", "Period"],
    rows.map((e) => [e.driverId, e.driverName, e.totalTrips, e.grossEarnings, e.commission, e.netEarnings, e.pendingPayout, e.lastPayoutDate ?? "", e.period]),
    filename,
  );

// ─── Driver Earning Detail Modal ───────────────────────────────────────────────

function DriverEarningDetailModal({
  earning,
  onClose,
}: {
  earning: DriverEarning;
  onClose: () => void;
}): React.ReactNode {
  return (
    <ModalWrapper open onClose={onClose} title="Driver Earnings Breakdown" size="md">
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
          <span className="text-sm text-gray-500">Driver</span>
          <span className="text-sm font-semibold text-gray-900">{earning.driverName}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Driver ID", value: earning.driverId },
            { label: "Period", value: earning.period },
            { label: "Total Trips", value: earning.totalTrips.toLocaleString() },
            { label: "Gross Earnings", value: formatCurrency(earning.grossEarnings) },
            { label: "Commission Rate", value: `${(earning.commissionRate * 100).toFixed(0)}%` },
            { label: "Platform Commission", value: formatCurrency(earning.commission) },
            { label: "Net Earnings", value: formatCurrency(earning.netEarnings) },
            { label: "Pending Payout", value: formatCurrency(earning.pendingPayout) },
            { label: "Last Payout", value: earning.lastPayoutDate ?? "Never" },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-xs text-gray-400">{f.label}</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </ModalWrapper>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

type ActiveTab = "earnings" | "payouts";

export default function EarningsView(): React.ReactNode {
  const [tab, setTab] = useState<ActiveTab>("earnings");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<DriverEarning | null>(null);
  // swap with real query: const { data, isLoading } = useDriverEarnings({ search, period: "Apr 2026" });
  const loading = false;
  const data = MOCK_DRIVER_EARNINGS;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((e) => !q || e.driverName.toLowerCase().includes(q) || e.driverId.toLowerCase().includes(q));
  }, [data, search]);

  const summary = useMemo(
    () => ({
      totalGross: data.reduce((s, e) => s + e.grossEarnings, 0),
      totalCommission: data.reduce((s, e) => s + e.commission, 0),
      totalNet: data.reduce((s, e) => s + e.netEarnings, 0),
      totalPending: data.reduce((s, e) => s + e.pendingPayout, 0),
    }),
    [data],
  );

  const columns: ColumnDef<DriverEarning, unknown>[] = [
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
      id: "totalTrips",
      header: "Trips",
      accessorKey: "totalTrips",
      cell: ({ getValue }) => <span className="text-sm text-gray-700">{(getValue() as number).toLocaleString()}</span>,
    },
    {
      id: "grossEarnings",
      header: "Gross Earnings",
      accessorKey: "grossEarnings",
      cell: ({ getValue }) => <span className="text-sm font-medium text-gray-900">{formatCurrency(getValue() as number)}</span>,
    },
    {
      id: "commission",
      header: "Commission",
      accessorKey: "commission",
      cell: ({ row }) => (
        <div>
          <p className="text-sm text-gray-700">{formatCurrency(row.original.commission)}</p>
          <p className="text-xs text-gray-400">{(row.original.commissionRate * 100).toFixed(0)}% rate</p>
        </div>
      ),
    },
    {
      id: "netEarnings",
      header: "Net Earnings",
      accessorKey: "netEarnings",
      cell: ({ getValue }) => <span className="text-sm font-semibold text-gray-900">{formatCurrency(getValue() as number)}</span>,
    },
    {
      id: "pendingPayout",
      header: "Pending Payout",
      accessorKey: "pendingPayout",
      cell: ({ getValue }) => {
        const v = getValue() as number;
        return v > 0 ? (
          <span className="text-sm font-medium text-amber-700">{formatCurrency(v)}</span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        );
      },
    },
    {
      id: "lastPayoutDate",
      header: "Last Payout",
      accessorKey: "lastPayoutDate",
      cell: ({ getValue }) => <span className="text-xs text-gray-500">{(getValue() as string | undefined) ?? "Never"}</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <button
          onClick={(e) => { e.stopPropagation(); setDetail(row.original); }}
          title="View breakdown"
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

  const tabs: Array<{ key: ActiveTab; label: string }> = [
    { key: "earnings", label: "Driver Earnings" },
    { key: "payouts", label: "Payouts" },
  ];

  return (
    <div className="space-y-5">
      <DashboardHeader
        title="Earnings & Payouts"
        description="Driver earnings, platform commissions, and payout management"
        onExportToCsv={tab === "earnings" ? () => exportEarnings(filtered, "driver-earnings.csv") : undefined}
      />

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-md px-5 py-1.5 text-sm font-medium transition-all",
              tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "payouts" ? (
        <PayoutsView />
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Gross Earnings", value: summary.totalGross, color: "text-gray-900", bg: "bg-gray-50" },
              { label: "Platform Commission", value: summary.totalCommission, color: "text-blue-700", bg: "bg-blue-50" },
              { label: "Net Payable to Drivers", value: summary.totalNet, color: "text-emerald-700", bg: "bg-emerald-50" },
              { label: "Pending Payouts", value: summary.totalPending, color: "text-amber-700", bg: "bg-amber-50" },
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
              placeholder="Search by driver name or ID..."
              className="w-80"
            />
            <span className="text-xs text-gray-400">Period: Apr 2026</span>
            <span className="ml-auto text-xs text-gray-400">{filtered.length} results</span>
          </div>

          {/* Table */}
          <DataTable<DriverEarning>
            data={filtered}
            columns={columns}
            loading={loading}
            pageSize={10}
          />

          {/* Detail modal */}
          {detail && <DriverEarningDetailModal earning={detail} onClose={() => setDetail(null)} />}
        </>
      )}
    </div>
  );
}
