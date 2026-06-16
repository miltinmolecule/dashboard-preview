"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "@/shared/common/DataTable";
import StatusBadge from "@/shared/common/StatusBadge";
import DashboardHeader from "@/shared/cards/DashboardHeader";
import SearchInput from "@/shared/forms/SearchInput";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format-currency";
import { exportToCsv } from "@/utils/export-csv";
import type { Promotion, PromotionType, PromotionStatus, PromotionAudience } from "../services/promotions.service";
import DiscountCodesView from "./DiscountCodesView";
import ReferralsView from "./ReferralsView";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PROMOTIONS: Promotion[] = [
  { id: "PRM-001", name: "Welcome Ride Discount", description: "20% off for first-time riders", type: "percentage", value: 20, audience: "new_users", status: "active", startDate: "2026-01-01", endDate: "2026-12-31", usageCount: 1_240, usageLimit: 5_000, totalDiscountGiven: 1_860_000 },
  { id: "PRM-002", name: "Weekend Flat Off", description: "₦500 off weekend rides", type: "fixed_amount", value: 500, audience: "all_users", status: "active", startDate: "2026-05-01", endDate: "2026-06-30", usageCount: 860, totalDiscountGiven: 430_000 },
  { id: "PRM-003", name: "Lekki Launch Promo", description: "30% off rides to/from Lekki Phase 1", type: "percentage", value: 30, audience: "specific_zone", zone: "Lekki Phase 1", status: "scheduled", startDate: "2026-06-15", endDate: "2026-07-15", usageCount: 0, usageLimit: 2_000, totalDiscountGiven: 0 },
  { id: "PRM-004", name: "Driver Loyalty Bonus", description: "1 free ride credit for top-rated drivers", type: "free_ride", value: 1, audience: "drivers", status: "active", startDate: "2026-03-01", endDate: "2026-12-31", usageCount: 312, totalDiscountGiven: 936_000 },
  { id: "PRM-005", name: "Independence Day Special", description: "15% off all rides", type: "percentage", value: 15, audience: "all_users", status: "expired", startDate: "2025-10-01", endDate: "2025-10-05", usageCount: 2_100, totalDiscountGiven: 1_050_000 },
  { id: "PRM-006", name: "Festive Season Cashback", description: "₦1,000 wallet cashback on rides", type: "fixed_amount", value: 1_000, audience: "all_users", status: "paused", startDate: "2026-04-01", endDate: "2026-12-31", usageCount: 540, usageLimit: 3_000, totalDiscountGiven: 540_000 },
  { id: "PRM-007", name: "Abuja Expansion Offer", description: "25% off rides in Maitama for launch week", type: "percentage", value: 25, audience: "specific_zone", zone: "Maitama", status: "draft", startDate: "2026-07-01", endDate: "2026-08-31", usageCount: 0, totalDiscountGiven: 0 },
  { id: "PRM-008", name: "Referral Top-Up Boost", description: "₦250 off for users from referral signups", type: "fixed_amount", value: 250, audience: "new_users", status: "active", startDate: "2026-02-01", endDate: "2026-12-31", usageCount: 1_800, usageLimit: 10_000, totalDiscountGiven: 450_000 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<PromotionType, string> = {
  percentage: "Percentage",
  fixed_amount: "Fixed Amount",
  free_ride: "Free Ride(s)",
};

const AUDIENCE_LABELS: Record<PromotionAudience, string> = {
  all_users: "All Users",
  new_users: "New Users",
  drivers: "Drivers",
  specific_zone: "Specific Zone",
};

const formatPromotionValue = (promo: Pick<Promotion, "type" | "value">): string => {
  switch (promo.type) {
    case "percentage":
      return `${promo.value}%`;
    case "fixed_amount":
      return formatCurrency(promo.value);
    case "free_ride":
      return `${promo.value} ride${promo.value === 1 ? "" : "s"}`;
  }
};

const exportPromotions = (rows: Promotion[], filename: string): void =>
  exportToCsv(
    ["Name", "Description", "Type", "Value", "Audience", "Status", "Start Date", "End Date", "Usage", "Usage Limit", "Total Discount Given"],
    rows.map((p) => [p.name, p.description, p.type, p.value, p.audience, p.status, p.startDate, p.endDate, p.usageCount, p.usageLimit ?? "", p.totalDiscountGiven]),
    filename,
  );

function genId(): string {
  return `PRM-${Date.now().toString(36).toUpperCase()}`;
}

// Status transitions available from each campaign status
const STATUS_FLOW: Partial<Record<PromotionStatus, { label: string; next: PromotionStatus }>> = {
  draft: { label: "Activate", next: "active" },
  scheduled: { label: "Activate Now", next: "active" },
  active: { label: "Pause", next: "paused" },
  paused: { label: "Resume", next: "active" },
};

// ─── Promotion Form Modal ───────────────────────────────────────────────────────

interface PromotionFormState {
  name: string;
  description: string;
  type: PromotionType;
  value: string;
  audience: PromotionAudience;
  zone: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
}

const EMPTY_FORM: PromotionFormState = {
  name: "",
  description: "",
  type: "percentage",
  value: "",
  audience: "all_users",
  zone: "",
  startDate: "",
  endDate: "",
  usageLimit: "",
};

function PromotionFormModal({
  promotion,
  onClose,
  onSave,
}: {
  promotion: Promotion | null;
  onClose: () => void;
  onSave: (form: PromotionFormState, id?: string) => void;
}): React.ReactNode {
  const isEdit = promotion !== null;
  const [form, setForm] = useState<PromotionFormState>(
    isEdit
      ? {
          name: promotion.name,
          description: promotion.description,
          type: promotion.type,
          value: String(promotion.value),
          audience: promotion.audience,
          zone: promotion.zone ?? "",
          startDate: promotion.startDate,
          endDate: promotion.endDate,
          usageLimit: promotion.usageLimit?.toString() ?? "",
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof PromotionFormState, string>>>({});

  const set = <K extends keyof PromotionFormState>(key: K, value: PromotionFormState[K]): void =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const errs: Partial<Record<keyof PromotionFormState, string>> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.value || isNaN(Number(form.value)) || Number(form.value) <= 0) errs.value = "Enter a valid value";
    if (form.type === "percentage" && Number(form.value) > 100) errs.value = "Percentage cannot exceed 100";
    if (!form.startDate) errs.startDate = "Start date is required";
    if (!form.endDate) errs.endDate = "End date is required";
    if (form.startDate && form.endDate && form.endDate < form.startDate) errs.endDate = "Must be after start date";
    if (form.audience === "specific_zone" && !form.zone.trim()) errs.zone = "Zone is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form, promotion?.id);
  };

  return (
    <ModalWrapper open onClose={onClose} title={isEdit ? "Edit Campaign" : "Create Campaign"} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Campaign Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Welcome Ride Discount"
            className={cn(
              "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-900 outline-none",
              "placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
              errors.name ? "border-red-400" : "border-gray-200",
            )}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="e.g. 20% off for first-time riders"
            className={cn(
              "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-900 outline-none",
              "placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
              errors.description ? "border-red-400" : "border-gray-200",
            )}
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>

        {/* Type */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Discount Type</label>
          <div className="flex gap-2">
            {(Object.keys(TYPE_LABELS) as PromotionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("type", t)}
                className={cn(
                  "flex-1 rounded-lg border py-2 text-xs font-medium transition-all",
                  form.type === t
                    ? "border-blue-400 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50",
                )}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Value */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">
              {form.type === "percentage" ? "Discount (%)" : form.type === "fixed_amount" ? "Discount Amount (₦)" : "Number of Free Rides"}
            </label>
            <input
              type="number"
              min="0"
              max={form.type === "percentage" ? "100" : undefined}
              value={form.value}
              onChange={(e) => set("value", e.target.value)}
              placeholder={form.type === "percentage" ? "e.g. 20" : form.type === "fixed_amount" ? "e.g. 500" : "e.g. 1"}
              className={cn(
                "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-900 outline-none",
                "placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
                errors.value ? "border-red-400" : "border-gray-200",
              )}
            />
            {errors.value && <p className="mt-1 text-xs text-red-500">{errors.value}</p>}
          </div>

          {/* Usage limit */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">
              Usage Limit <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="number"
              min="0"
              value={form.usageLimit}
              onChange={(e) => set("usageLimit", e.target.value)}
              placeholder="e.g. 5000"
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Audience */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Audience</label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(AUDIENCE_LABELS) as PromotionAudience[]).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => set("audience", a)}
                className={cn(
                  "rounded-lg border py-2 text-xs font-medium transition-all",
                  form.audience === a
                    ? "border-blue-400 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50",
                )}
              >
                {AUDIENCE_LABELS[a]}
              </button>
            ))}
          </div>
        </div>

        {/* Zone (specific_zone audience only) */}
        {form.audience === "specific_zone" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Zone</label>
            <input
              type="text"
              value={form.zone}
              onChange={(e) => set("zone", e.target.value)}
              placeholder="e.g. Lekki Phase 1"
              className={cn(
                "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-900 outline-none",
                "placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
                errors.zone ? "border-red-400" : "border-gray-200",
              )}
            />
            {errors.zone && <p className="mt-1 text-xs text-red-500">{errors.zone}</p>}
          </div>
        )}

        {/* Schedule */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              className={cn(
                "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-900 outline-none",
                "focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
                errors.startDate ? "border-red-400" : "border-gray-200",
              )}
            />
            {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => set("endDate", e.target.value)}
              className={cn(
                "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-900 outline-none",
                "focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
                errors.endDate ? "border-red-400" : "border-gray-200",
              )}
            />
            {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-[var(--primary)] py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            {isEdit ? "Save Changes" : "Create Campaign"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

const STATUS_FILTERS = [
  { label: "Active", value: "active" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Paused", value: "paused" },
  { label: "Draft", value: "draft" },
  { label: "Expired", value: "expired" },
];

type ActiveTab = "campaigns" | "discount-codes" | "referrals";

export default function PromotionsView(): React.ReactNode {
  const [tab, setTab] = useState<ActiveTab>("campaigns");

  // swap with real query: const { data, isLoading } = usePromotions({ search, status: statusFilter });
  const [data, setData] = useState<Promotion[]>(MOCK_PROMOTIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Promotion | null>(null);
  const loading = false;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((p) => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data, search, statusFilter]);

  const stats = useMemo(
    () => ({
      active: data.filter((p) => p.status === "active").length,
      scheduled: data.filter((p) => p.status === "scheduled").length,
      totalRedemptions: data.reduce((s, p) => s + p.usageCount, 0),
      totalDiscountGiven: data.reduce((s, p) => s + p.totalDiscountGiven, 0),
    }),
    [data],
  );

  const openEdit = (promo: Promotion): void => {
    setEditTarget(promo);
    setModal("edit");
  };

  const handleSetStatus = (id: string, status: PromotionStatus): void => {
    // swap with real mutation: useUpdatePromotionStatus().mutate({ id, status })
    setData((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const handleSave = (form: PromotionFormState, id?: string): void => {
    const payload = {
      name: form.name,
      description: form.description,
      type: form.type,
      value: Number(form.value),
      audience: form.audience,
      zone: form.audience === "specific_zone" ? form.zone : undefined,
      startDate: form.startDate,
      endDate: form.endDate,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
    };
    // swap with real mutation: useCreatePromotion() / useUpdatePromotion()
    if (id) {
      setData((prev) => prev.map((p) => (p.id === id ? { ...p, ...payload } : p)));
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const status: PromotionStatus = payload.startDate > today ? "scheduled" : "active";
      setData((prev) => [{ id: genId(), ...payload, status, usageCount: 0, totalDiscountGiven: 0 }, ...prev]);
    }
    setModal(null);
    setEditTarget(null);
  };

  const columns: ColumnDef<Promotion, unknown>[] = [
    {
      id: "name",
      header: "Campaign",
      accessorKey: "name",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.original.name}</p>
          <p className="text-xs text-gray-400">{row.original.description}</p>
        </div>
      ),
    },
    {
      id: "value",
      header: "Discount",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{formatPromotionValue(row.original)}</p>
          <p className="text-xs text-gray-400">{TYPE_LABELS[row.original.type]}</p>
        </div>
      ),
    },
    {
      id: "audience",
      header: "Audience",
      cell: ({ row }) => (
        <div>
          <p className="text-sm text-gray-700">{AUDIENCE_LABELS[row.original.audience]}</p>
          {row.original.zone && <p className="text-xs text-gray-400">{row.original.zone}</p>}
        </div>
      ),
    },
    {
      id: "schedule",
      header: "Schedule",
      cell: ({ row }) => (
        <div className="text-xs text-gray-500">
          <p>{row.original.startDate}</p>
          <p>to {row.original.endDate}</p>
        </div>
      ),
    },
    {
      id: "usage",
      header: "Usage",
      cell: ({ row }) => (
        <div>
          <p className="text-sm text-gray-700">
            {row.original.usageCount.toLocaleString()}
            {row.original.usageLimit ? ` / ${row.original.usageLimit.toLocaleString()}` : ""}
          </p>
          <p className="text-xs text-gray-400">{formatCurrency(row.original.totalDiscountGiven)} given</p>
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
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const p = row.original;
        const flow = STATUS_FLOW[p.status];
        const canEnd = p.status === "active" || p.status === "paused" || p.status === "scheduled";
        return (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => openEdit(p)}
              title="Edit"
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            {flow && (
              <button
                onClick={() => handleSetStatus(p.id, flow.next)}
                title={flow.label}
                className="rounded-md p-1.5 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {flow.next === "paused" ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            )}
            {canEnd && (
              <button
                onClick={() => handleSetStatus(p.id, "expired")}
                title="End Campaign"
                className="rounded-md p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v6H9z" />
                </svg>
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const tabs: Array<{ key: ActiveTab; label: string }> = [
    { key: "campaigns", label: "Campaigns" },
    { key: "discount-codes", label: "Discount Codes" },
    { key: "referrals", label: "Referrals" },
  ];

  return (
    <div className="space-y-5">
      <DashboardHeader
        title="Promotions & Discounts"
        description="Create promotional campaigns, discount codes, and manage referral rewards"
        onExportToCsv={tab === "campaigns" ? () => exportPromotions(filtered, "promotions.csv") : undefined}
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

      {tab === "discount-codes" ? (
        <DiscountCodesView />
      ) : tab === "referrals" ? (
        <ReferralsView />
      ) : (
        <>
          {/* Stats strip */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Active Campaigns", value: stats.active, color: "text-emerald-700", bg: "bg-emerald-50" },
              { label: "Scheduled", value: stats.scheduled, color: "text-blue-700", bg: "bg-blue-50" },
              { label: "Total Redemptions", value: stats.totalRedemptions.toLocaleString(), color: "text-gray-900", bg: "bg-gray-50" },
              { label: "Total Discount Given", value: formatCurrency(stats.totalDiscountGiven), color: "text-amber-700", bg: "bg-amber-50" },
            ].map((s) => (
              <div key={s.label} className={cn("rounded-xl border border-gray-100 px-4 py-3 shadow-sm", s.bg)}>
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
              placeholder="Search by campaign name..."
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
              onClick={() => setModal("create")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Campaign
            </button>
          </div>

          {/* Table */}
          <DataTable<Promotion> data={filtered} columns={columns} loading={loading} pageSize={10} />

          {/* Modal */}
          {(modal === "create" || modal === "edit") && (
            <PromotionFormModal
              promotion={modal === "edit" ? editTarget : null}
              onClose={() => { setModal(null); setEditTarget(null); }}
              onSave={handleSave}
            />
          )}
        </>
      )}
    </div>
  );
}
