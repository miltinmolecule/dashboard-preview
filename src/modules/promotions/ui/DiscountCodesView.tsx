"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "@/shared/common/DataTable";
import StatusBadge from "@/shared/common/StatusBadge";
import SearchInput from "@/shared/forms/SearchInput";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format-currency";
import { exportToCsv } from "@/utils/export-csv";
import type { DiscountCode, DiscountType } from "../services/discount-codes.service";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_DISCOUNT_CODES: DiscountCode[] = [
  { id: "DSC-001", code: "WELCOME20", description: "20% off for new sign-ups", type: "percentage", value: 20, maxDiscount: 1_000, minTripAmount: 1_500, usageLimit: 5_000, usageCount: 2_340, perUserLimit: 1, status: "active", expiresAt: "2026-12-31", createdAt: "2026-01-01" },
  { id: "DSC-002", code: "FLEEXY500", description: "₦500 off rides above ₦2,000", type: "fixed_amount", value: 500, minTripAmount: 2_000, usageLimit: 1_000, usageCount: 845, perUserLimit: 2, status: "active", expiresAt: "2026-08-31", createdAt: "2026-02-15" },
  { id: "DSC-003", code: "RAMADAN25", description: "Ramadan season discount", type: "percentage", value: 25, maxDiscount: 1_500, minTripAmount: 1_000, usageLimit: 3_000, usageCount: 3_000, perUserLimit: 1, status: "expired", expiresAt: "2026-04-10", createdAt: "2026-02-20" },
  { id: "DSC-004", code: "LEKKI10", description: "10% off rides in Lekki Phase 1", type: "percentage", value: 10, maxDiscount: 500, usageCount: 412, perUserLimit: 5, status: "active", expiresAt: "2026-09-30", createdAt: "2026-03-01" },
  { id: "DSC-005", code: "SAVE1K", description: "₦1,000 off rides above ₦5,000", type: "fixed_amount", value: 1_000, minTripAmount: 5_000, usageLimit: 500, usageCount: 120, perUserLimit: 1, status: "inactive", expiresAt: "2026-12-31", createdAt: "2026-04-01" },
  { id: "DSC-006", code: "NEWDRIVER15", description: "15% off for newly onboarded drivers' first riders", type: "percentage", value: 15, maxDiscount: 750, usageLimit: 2_000, usageCount: 88, perUserLimit: 1, status: "active", expiresAt: "2026-12-31", createdAt: "2026-05-01" },
  { id: "DSC-007", code: "EASTER2026", description: "Easter holiday flat discount", type: "fixed_amount", value: 300, minTripAmount: 1_000, usageLimit: 5_000, usageCount: 1_980, perUserLimit: 3, status: "active", expiresAt: "2026-04-12", createdAt: "2026-03-20" },
  { id: "DSC-008", code: "VIP50", description: "50% off for VIP loyalty tier", type: "percentage", value: 50, maxDiscount: 2_500, usageLimit: 100, usageCount: 100, perUserLimit: 1, status: "expired", expiresAt: "2026-05-31", createdAt: "2026-05-01" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatValue = (code: Pick<DiscountCode, "type" | "value">): string =>
  code.type === "percentage" ? `${code.value}%` : formatCurrency(code.value);

const exportDiscountCodes = (rows: DiscountCode[], filename: string): void =>
  exportToCsv(
    ["Code", "Description", "Type", "Value", "Min Trip", "Max Discount", "Usage", "Usage Limit", "Per User Limit", "Status", "Expires"],
    rows.map((d) => [d.code, d.description, d.type, d.value, d.minTripAmount ?? "", d.maxDiscount ?? "", d.usageCount, d.usageLimit ?? "", d.perUserLimit ?? "", d.status, d.expiresAt]),
    filename,
  );

function genId(): string {
  return `DSC-${Date.now().toString(36).toUpperCase()}`;
}

// ─── Discount Code Form Modal ──────────────────────────────────────────────────

interface DiscountCodeFormState {
  code: string;
  description: string;
  type: DiscountType;
  value: string;
  maxDiscount: string;
  minTripAmount: string;
  usageLimit: string;
  perUserLimit: string;
  expiresAt: string;
}

const EMPTY_FORM: DiscountCodeFormState = {
  code: "",
  description: "",
  type: "percentage",
  value: "",
  maxDiscount: "",
  minTripAmount: "",
  usageLimit: "",
  perUserLimit: "",
  expiresAt: "",
};

function DiscountCodeFormModal({
  discountCode,
  onClose,
  onSave,
}: {
  discountCode: DiscountCode | null;
  onClose: () => void;
  onSave: (form: DiscountCodeFormState, id?: string) => void;
}): React.ReactNode {
  const isEdit = discountCode !== null;
  const [form, setForm] = useState<DiscountCodeFormState>(
    isEdit
      ? {
          code: discountCode.code,
          description: discountCode.description,
          type: discountCode.type,
          value: String(discountCode.value),
          maxDiscount: discountCode.maxDiscount?.toString() ?? "",
          minTripAmount: discountCode.minTripAmount?.toString() ?? "",
          usageLimit: discountCode.usageLimit?.toString() ?? "",
          perUserLimit: discountCode.perUserLimit?.toString() ?? "",
          expiresAt: discountCode.expiresAt,
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof DiscountCodeFormState, string>>>({});

  const set = <K extends keyof DiscountCodeFormState>(key: K, value: DiscountCodeFormState[K]): void =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const errs: Partial<Record<keyof DiscountCodeFormState, string>> = {};
    if (!form.code.trim()) errs.code = "Code is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.value || isNaN(Number(form.value)) || Number(form.value) <= 0) errs.value = "Enter a valid value";
    if (form.type === "percentage" && Number(form.value) > 100) errs.value = "Percentage cannot exceed 100";
    if (!form.expiresAt) errs.expiresAt = "Expiry date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form, discountCode?.id);
  };

  return (
    <ModalWrapper open onClose={onClose} title={isEdit ? "Edit Discount Code" : "Create Discount Code"} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Code */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Code</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => set("code", e.target.value.toUpperCase())}
              placeholder="e.g. WELCOME20"
              className={cn(
                "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm font-mono uppercase text-gray-900 outline-none",
                "placeholder:text-gray-400 placeholder:normal-case focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
                errors.code ? "border-red-400" : "border-gray-200",
              )}
            />
            {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code}</p>}
          </div>

          {/* Expiry date */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Expires On</label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(e) => set("expiresAt", e.target.value)}
              className={cn(
                "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-900 outline-none",
                "focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
                errors.expiresAt ? "border-red-400" : "border-gray-200",
              )}
            />
            {errors.expiresAt && <p className="mt-1 text-xs text-red-500">{errors.expiresAt}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="e.g. 20% off for new sign-ups"
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
            {(
              [
                { key: "percentage", label: "Percentage" },
                { key: "fixed_amount", label: "Fixed Amount" },
              ] as Array<{ key: DiscountType; label: string }>
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => set("type", t.key)}
                className={cn(
                  "flex-1 rounded-lg border py-2 text-xs font-medium transition-all",
                  form.type === t.key
                    ? "border-blue-400 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Value */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">
              {form.type === "percentage" ? "Discount (%)" : "Discount Amount (₦)"}
            </label>
            <input
              type="number"
              min="0"
              max={form.type === "percentage" ? "100" : undefined}
              value={form.value}
              onChange={(e) => set("value", e.target.value)}
              placeholder={form.type === "percentage" ? "e.g. 20" : "e.g. 500"}
              className={cn(
                "h-9 w-full rounded-lg border bg-gray-50 px-3 text-sm text-gray-900 outline-none",
                "placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all",
                errors.value ? "border-red-400" : "border-gray-200",
              )}
            />
            {errors.value && <p className="mt-1 text-xs text-red-500">{errors.value}</p>}
          </div>

          {/* Max discount (percentage only) */}
          {form.type === "percentage" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Max Discount (₦) <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.maxDiscount}
                onChange={(e) => set("maxDiscount", e.target.value)}
                placeholder="e.g. 1000"
                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Min trip amount */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">
              Min Trip (₦) <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="number"
              min="0"
              value={form.minTripAmount}
              onChange={(e) => set("minTripAmount", e.target.value)}
              placeholder="e.g. 1500"
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
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

          {/* Per-user limit */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">
              Per-User Limit <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="number"
              min="0"
              value={form.perUserLimit}
              onChange={(e) => set("perUserLimit", e.target.value)}
              placeholder="e.g. 1"
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
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
            {isEdit ? "Save Changes" : "Create Code"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

// ─── Main view ──────────────────────────────────────────────────────────────────

const STATUS_FILTERS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Expired", value: "expired" },
];

export default function DiscountCodesView(): React.ReactNode {
  // swap with real query: const { data, isLoading } = useDiscountCodes({ search, status: statusFilter });
  const [data, setData] = useState<DiscountCode[]>(MOCK_DISCOUNT_CODES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<DiscountCode | null>(null);
  const loading = false;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((d) => {
      const matchSearch = !q || d.code.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
      const matchStatus = !statusFilter || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: data.length,
      active: data.filter((d) => d.status === "active").length,
      totalRedemptions: data.reduce((s, d) => s + d.usageCount, 0),
      expired: data.filter((d) => d.status === "expired").length,
    }),
    [data],
  );

  const openEdit = (code: DiscountCode): void => {
    setEditTarget(code);
    setModal("edit");
  };

  const handleToggleStatus = (id: string): void => {
    // swap with real mutation: useUpdateDiscountCodeStatus().mutate({ id, status })
    setData((prev) =>
      prev.map((d) =>
        d.id === id && d.status !== "expired"
          ? { ...d, status: d.status === "active" ? "inactive" : "active" }
          : d,
      ),
    );
  };

  const handleSave = (form: DiscountCodeFormState, id?: string): void => {
    const payload = {
      code: form.code,
      description: form.description,
      type: form.type,
      value: Number(form.value),
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      minTripAmount: form.minTripAmount ? Number(form.minTripAmount) : undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      perUserLimit: form.perUserLimit ? Number(form.perUserLimit) : undefined,
      expiresAt: form.expiresAt,
    };
    // swap with real mutation: useCreateDiscountCode() / useUpdateDiscountCode()
    if (id) {
      setData((prev) => prev.map((d) => (d.id === id ? { ...d, ...payload } : d)));
    } else {
      setData((prev) => [{ id: genId(), ...payload, usageCount: 0, status: "active", createdAt: new Date().toISOString().slice(0, 10) }, ...prev]);
    }
    setModal(null);
    setEditTarget(null);
  };

  const columns: ColumnDef<DiscountCode, unknown>[] = [
    {
      id: "code",
      header: "Code",
      accessorKey: "code",
      cell: ({ row }) => (
        <div>
          <p className="font-mono text-sm font-semibold text-gray-900">{row.original.code}</p>
          <p className="text-xs text-gray-400">{row.original.description}</p>
        </div>
      ),
    },
    {
      id: "value",
      header: "Discount",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{formatValue(row.original)}</p>
          {row.original.maxDiscount && (
            <p className="text-xs text-gray-400">up to {formatCurrency(row.original.maxDiscount)}</p>
          )}
        </div>
      ),
    },
    {
      id: "minTripAmount",
      header: "Min Trip",
      cell: ({ row }) =>
        row.original.minTripAmount ? (
          <span className="text-sm text-gray-600">{formatCurrency(row.original.minTripAmount)}</span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
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
          {row.original.perUserLimit && (
            <p className="text-xs text-gray-400">{row.original.perUserLimit}/user</p>
          )}
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
      id: "expiresAt",
      header: "Expires",
      accessorKey: "expiresAt",
      cell: ({ getValue }) => <span className="text-xs text-gray-500">{getValue() as string}</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => openEdit(d)}
              title="Edit"
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            {d.status !== "expired" && (
              <button
                onClick={() => handleToggleStatus(d.id)}
                title={d.status === "active" ? "Deactivate" : "Activate"}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  d.status === "active"
                    ? "text-red-400 hover:bg-red-50 hover:text-red-600"
                    : "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700",
                )}
              >
                {d.status === "active" ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Codes", value: stats.total, color: "text-gray-900", bg: "bg-gray-50" },
          { label: "Active Codes", value: stats.active, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Total Redemptions", value: stats.totalRedemptions.toLocaleString(), color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Expired", value: stats.expired, color: "text-gray-500", bg: "bg-gray-50" },
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
          placeholder="Search by code or description..."
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
          onClick={() => exportDiscountCodes(filtered, "discount-codes.csv")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
        <button
          onClick={() => setModal("create")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Code
        </button>
      </div>

      {/* Table */}
      <DataTable<DiscountCode> data={filtered} columns={columns} loading={loading} pageSize={10} />

      {/* Modal */}
      {(modal === "create" || modal === "edit") && (
        <DiscountCodeFormModal
          discountCode={modal === "edit" ? editTarget : null}
          onClose={() => { setModal(null); setEditTarget(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
