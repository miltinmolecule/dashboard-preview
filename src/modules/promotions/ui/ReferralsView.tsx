"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "@/shared/common/DataTable";
import StatusBadge from "@/shared/common/StatusBadge";
import SearchInput from "@/shared/forms/SearchInput";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format-currency";
import { exportToCsv } from "@/utils/export-csv";
import type { ReferralProgram, ReferralActivity, ReferralRewardType } from "../services/referrals.service";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_REFERRAL_PROGRAM: ReferralProgram = {
  id: "RFP-001",
  name: "Standard Referral Program",
  referrerReward: 1_000,
  refereeReward: 500,
  rewardType: "wallet_credit",
  minTripsRequired: 1,
  status: "active",
  startDate: "2026-01-01",
};

const MOCK_REFERRAL_ACTIVITY: ReferralActivity[] = [
  { id: "REF-001", referrerId: "usr_001", referrerName: "Tunde Bakare", refereeId: "usr_002", refereeName: "Chidinma Okafor", status: "rewarded", rewardAmount: 1_000, date: "2026-05-01" },
  { id: "REF-002", referrerId: "usr_001", referrerName: "Tunde Bakare", refereeId: "usr_003", refereeName: "Hakeem Adisa", status: "completed", rewardAmount: 1_000, date: "2026-05-10" },
  { id: "REF-003", referrerId: "usr_004", referrerName: "Blessing Eze", refereeId: "usr_005", refereeName: "Olusegun Martins", status: "pending", rewardAmount: 0, date: "2026-06-01" },
  { id: "REF-004", referrerId: "usr_006", referrerName: "Aisha Yusuf", refereeId: "usr_007", refereeName: "Emmanuel Nwosu", status: "rewarded", rewardAmount: 1_000, date: "2026-04-15" },
  { id: "REF-005", referrerId: "usr_008", referrerName: "Grace Okonkwo", refereeId: "usr_009", refereeName: "Kabiru Salami", status: "expired", rewardAmount: 0, date: "2026-03-01" },
  { id: "REF-006", referrerId: "usr_010", referrerName: "Adaeze Obiora", refereeId: "usr_011", refereeName: "Festus Agbaje", status: "rewarded", rewardAmount: 1_000, date: "2026-02-20" },
  { id: "REF-007", referrerId: "usr_012", referrerName: "Oluwakemi Adeyemi", refereeId: "usr_001", refereeName: "Tunde Bakare", status: "completed", rewardAmount: 1_000, date: "2026-05-25" },
  { id: "REF-008", referrerId: "usr_002", referrerName: "Chidinma Okafor", refereeId: "usr_004", refereeName: "Blessing Eze", status: "pending", rewardAmount: 0, date: "2026-06-05" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const REWARD_TYPE_LABELS: Record<ReferralRewardType, string> = {
  wallet_credit: "Wallet Credit",
  free_ride: "Free Ride",
  discount: "Discount Voucher",
};

const exportReferrals = (rows: ReferralActivity[], filename: string): void =>
  exportToCsv(
    ["Referrer", "Referrer ID", "Referee", "Referee ID", "Status", "Reward", "Date"],
    rows.map((r) => [r.referrerName, r.referrerId, r.refereeName, r.refereeId, r.status, r.rewardAmount, r.date]),
    filename,
  );

// ─── Activity status filters ───────────────────────────────────────────────────

const STATUS_FILTERS = [
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Rewarded", value: "rewarded" },
  { label: "Expired", value: "expired" },
];

// ─── Main view ──────────────────────────────────────────────────────────────────

export default function ReferralsView(): React.ReactNode {
  // swap with real query: const { data: program } = useReferralProgram();
  const [program, setProgram] = useState<ReferralProgram>(MOCK_REFERRAL_PROGRAM);
  const [form, setForm] = useState({
    referrerReward: String(MOCK_REFERRAL_PROGRAM.referrerReward),
    refereeReward: String(MOCK_REFERRAL_PROGRAM.refereeReward),
    rewardType: MOCK_REFERRAL_PROGRAM.rewardType,
    minTripsRequired: String(MOCK_REFERRAL_PROGRAM.minTripsRequired),
  });
  const [saved, setSaved] = useState(false);

  // swap with real query: const { data, isLoading } = useReferralActivity({ search, status: statusFilter });
  const [data] = useState<ReferralActivity[]>(MOCK_REFERRAL_ACTIVITY);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const loading = false;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((r) => {
      const matchSearch =
        !q || r.referrerName.toLowerCase().includes(q) || r.refereeName.toLowerCase().includes(q);
      const matchStatus = !statusFilter || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: data.length,
      pending: data.filter((r) => r.status === "pending").length,
      rewarded: data.filter((r) => r.status === "rewarded").length,
      totalPaid: data.filter((r) => r.status === "rewarded").reduce((s, r) => s + r.rewardAmount, 0),
    }),
    [data],
  );

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSaveProgram = (e: React.FormEvent): void => {
    e.preventDefault();
    // swap with real mutation: useUpdateReferralProgram().mutate(payload)
    setProgram((prev) => ({
      ...prev,
      referrerReward: Number(form.referrerReward),
      refereeReward: Number(form.refereeReward),
      rewardType: form.rewardType,
      minTripsRequired: Number(form.minTripsRequired),
    }));
    setSaved(true);
  };

  const handleToggleProgramStatus = (): void => {
    setProgram((prev) => ({ ...prev, status: prev.status === "active" ? "inactive" : "active" }));
  };

  const columns: ColumnDef<ReferralActivity, unknown>[] = [
    {
      id: "referrer",
      header: "Referrer",
      accessorKey: "referrerName",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.original.referrerName}</p>
          <p className="text-xs text-gray-400">{row.original.referrerId}</p>
        </div>
      ),
    },
    {
      id: "referee",
      header: "Referee",
      accessorKey: "refereeName",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.original.refereeName}</p>
          <p className="text-xs text-gray-400">{row.original.refereeId}</p>
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
      id: "rewardAmount",
      header: "Reward",
      accessorKey: "rewardAmount",
      cell: ({ getValue }) => {
        const v = getValue() as number;
        return v > 0 ? (
          <span className="text-sm font-medium text-emerald-700">{formatCurrency(v)}</span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        );
      },
    },
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
      cell: ({ getValue }) => <span className="text-xs text-gray-500">{getValue() as string}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Referrals", value: stats.total, color: "text-gray-900", bg: "bg-gray-50" },
          { label: "Pending", value: stats.pending, color: "text-amber-700", bg: "bg-amber-50" },
          { label: "Rewarded", value: stats.rewarded, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Total Rewards Paid", value: formatCurrency(stats.totalPaid), color: "text-blue-700", bg: "bg-blue-50" },
        ].map((s) => (
          <div key={s.label} className={cn("rounded-xl border border-gray-100 px-4 py-3 shadow-sm", s.bg)}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={cn("mt-1 text-xl font-bold", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Program settings */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{program.name}</h2>
            <p className="mt-0.5 text-xs text-gray-400">Active since {program.startDate}</p>
          </div>
          <button
            onClick={handleToggleProgramStatus}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              program.status === "active"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            {program.status === "active" ? "Active — click to disable" : "Inactive — click to enable"}
          </button>
        </div>

        <form onSubmit={handleSaveProgram} className="grid grid-cols-4 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Referrer Reward (₦)</label>
            <input
              type="number"
              min="0"
              value={form.referrerReward}
              onChange={(e) => set("referrerReward", e.target.value)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Referee Reward (₦)</label>
            <input
              type="number"
              min="0"
              value={form.refereeReward}
              onChange={(e) => set("refereeReward", e.target.value)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Reward Type</label>
            <select
              value={form.rewardType}
              onChange={(e) => set("rewardType", e.target.value as ReferralRewardType)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              {(Object.keys(REWARD_TYPE_LABELS) as ReferralRewardType[]).map((t) => (
                <option key={t} value={t}>
                  {REWARD_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Min Trips Required</label>
            <input
              type="number"
              min="0"
              value={form.minTripsRequired}
              onChange={(e) => set("minTripsRequired", e.target.value)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div className="col-span-4 flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
            {saved && <span className="text-xs text-emerald-600">Program settings updated.</span>}
          </div>
        </form>
      </div>

      {/* Activity toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by referrer or referee..."
          className="w-72"
        />
        <FilterDropdown options={STATUS_FILTERS} value={statusFilter} onChange={setStatusFilter} placeholder="Status" />
        {(search || statusFilter) && (
          <button
            onClick={() => { setSearch(""); setStatusFilter(""); }}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">{filtered.length} results</span>
        <button
          onClick={() => exportReferrals(filtered, "referral-activity.csv")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Activity table */}
      <DataTable<ReferralActivity> data={filtered} columns={columns} loading={loading} pageSize={10} />
    </div>
  );
}
