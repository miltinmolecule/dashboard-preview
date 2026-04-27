"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "@/shared/common/DataTable";
import StatusBadge from "@/shared/common/StatusBadge";
import BulkActionBar from "@/shared/common/BulkActionBar";
import SearchInput from "@/shared/forms/SearchInput";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import DashboardHeader from "@/shared/cards/DashboardHeader";
import { cn } from "@/utils/cn";
import { MOCK_VEHICLES } from "../data/mock";
import { useVehiclesRealtime } from "../hooks/useVehiclesRealtime";
import { simulateVehicleEvents } from "@/lib/socket";
import VehicleQuickModal from "./VehicleQuickModal";
import type { Vehicle } from "../services/vehicles.service";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_FILTERS = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
  { label: "Rejected", value: "rejected" },
];

const VERIFICATION_FILTERS = [
  { label: "Verified", value: "verified" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
  { label: "Expired", value: "expired" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const exportToCsv = (rows: Vehicle[], filename: string): void => {
  const headers = ["ID", "Make", "Model", "Year", "Plate", "Type", "Status", "Verification", "Driver", "Trips", "Registered"];
  const lines = rows.map((v) =>
    [
      v.id,
      v.make,
      v.model,
      v.year,
      v.plateNumber,
      v.vehicleType ?? "",
      v.status,
      v.verificationStatus,
      v.driver?.name ?? "Unassigned",
      v.totalTrips,
      v.registeredAt,
    ].join(","),
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

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  confirmClass,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmClass: string;
  onConfirm: () => void;
  onCancel: () => void;
}): React.ReactNode {
  return (
    <ModalWrapper open={open} onClose={onCancel} title={title} size="sm">
      <p className="text-sm text-gray-600">{message}</p>
      <div className="mt-5 flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors",
            confirmClass,
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </ModalWrapper>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export default function VehiclesView(): React.ReactNode {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [verFilter, setVerFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selected, setSelected] = useState<Vehicle[]>([]);
  const [quickModal, setQuickModal] = useState<Vehicle | null>(null);
  const [confirm, setConfirm] = useState<{
    id: string | string[];
    action: "approve" | "reject" | "suspend" | "reactivate";
  } | null>(null);
  const [connected, setConnected] = useState(false);
  const [flashingIds, setFlashingIds] = useState<Set<string>>(new Set());
  const [deletedBanners, setDeletedBanners] = useState<
    { id: string; plate: string }[]
  >([]);

  const flashRow = useCallback((vehicleId: string) => {
    setFlashingIds((prev) => new Set(prev).add(vehicleId));
    setTimeout(
      () =>
        setFlashingIds((prev) => {
          const next = new Set(prev);
          next.delete(vehicleId);
          return next;
        }),
      1500,
    );
  }, []);

  const handleDeleted = useCallback((vehicleId: string, plate: string) => {
    setDeletedBanners((prev) => [...prev, { id: vehicleId, plate }]);
  }, []);

  useVehiclesRealtime(setVehicles, setConnected, flashRow, handleDeleted);

  // Dev simulator — fires fake events to demonstrate real-time UI
  useEffect(() => {
    const ids = vehicles.map((v) => v.id);
    const stop = simulateVehicleEvents(setVehicles, ids);
    return stop;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return vehicles.filter((v) => {
      const matchSearch =
        !q ||
        v.plateNumber.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.driver?.name.toLowerCase().includes(q);
      const matchStatus = !statusFilter || v.status === statusFilter;
      const matchVer = !verFilter || v.verificationStatus === verFilter;
      const matchType =
        !typeFilter ||
        (v.vehicleType ?? "").toLowerCase().includes(typeFilter.toLowerCase());
      return matchSearch && matchStatus && matchVer && matchType;
    });
  }, [vehicles, search, statusFilter, verFilter, typeFilter]);

  const stats = useMemo(
    () => ({
      total: vehicles.length,
      active: vehicles.filter((v) => v.status === "active").length,
      pendingVerification: vehicles.filter(
        (v) => v.verificationStatus === "pending",
      ).length,
      suspended: vehicles.filter((v) => v.status === "suspended").length,
    }),
    [vehicles],
  );

  const applyAction = useCallback(
    (
      id: string | string[],
      action: "approve" | "reject" | "suspend" | "reactivate",
    ) => {
      const ids = Array.isArray(id) ? id : [id];
      setVehicles((prev) =>
        prev.map((v) => {
          if (!ids.includes(v.id)) return v;
          switch (action) {
            case "approve":
              return {
                ...v,
                status: "active" as const,
                verificationStatus: "verified" as const,
              };
            case "reject":
              return {
                ...v,
                status: "rejected" as const,
                verificationStatus: "rejected" as const,
              };
            case "suspend":
              return { ...v, status: "suspended" as const };
            case "reactivate":
              return { ...v, status: "active" as const };
          }
        }),
      );
      if (quickModal && !Array.isArray(id) && quickModal.id === id) {
        setQuickModal((prev) => {
          if (!prev) return prev;
          switch (action) {
            case "approve":
              return { ...prev, status: "active", verificationStatus: "verified" };
            case "reject":
              return { ...prev, status: "rejected", verificationStatus: "rejected" };
            case "suspend":
              return { ...prev, status: "suspended" };
            case "reactivate":
              return { ...prev, status: "active" };
          }
        });
      }
    },
    [quickModal],
  );

  const confirmConfig = confirm
    ? {
        approve: {
          title: "Approve Vehicle",
          message:
            "This will approve the vehicle registration and mark it as active.",
          confirmLabel: "Approve",
          confirmClass: "bg-emerald-600 hover:bg-emerald-700",
        },
        reject: {
          title: "Reject Vehicle",
          message:
            "This will reject the vehicle registration. The driver will be notified.",
          confirmLabel: "Reject",
          confirmClass: "bg-red-600 hover:bg-red-700",
        },
        suspend: {
          title: "Suspend Vehicle",
          message:
            "This will suspend the vehicle and prevent it from accepting trips.",
          confirmLabel: "Suspend",
          confirmClass: "bg-red-600 hover:bg-red-700",
        },
        reactivate: {
          title: "Reactivate Vehicle",
          message: "This will reactivate the vehicle.",
          confirmLabel: "Reactivate",
          confirmClass: "bg-[var(--primary)] hover:bg-blue-700",
        },
      }[confirm.action]
    : null;

  const columns: ColumnDef<Vehicle, unknown>[] = [
    {
      id: "vehicle",
      header: "Vehicle",
      accessorKey: "make",
      cell: ({ row }) => {
        const v = row.original;
        const isFlashing = flashingIds.has(v.id);
        return (
          <button
            onClick={() => setQuickModal(v)}
            className={cn(
              "flex items-center gap-2.5 text-left hover:text-blue-600 transition-colors rounded-lg px-1 py-0.5 -mx-1",
              isFlashing && "ring-2 ring-amber-400 ring-offset-1 transition-all duration-300",
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 leading-tight">
                {v.make} {v.model} {v.year}
              </p>
              <p className="text-xs text-gray-400 font-mono">{v.plateNumber}</p>
            </div>
          </button>
        );
      },
    },
    {
      id: "vehicleType",
      header: "Type",
      accessorKey: "vehicleType",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">
          {(getValue() as string | undefined) ?? "—"}
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
      id: "verificationStatus",
      header: "Verification",
      accessorKey: "verificationStatus",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      id: "driver",
      header: "Driver",
      accessorKey: "driver",
      cell: ({ row }) => {
        const d = row.original.driver;
        if (!d)
          return <span className="text-xs text-gray-400 italic">Unassigned</span>;
        return (
          <div>
            <p className="text-sm text-gray-700">{d.name}</p>
            <p className="text-xs text-gray-400">{d.phone}</p>
          </div>
        );
      },
    },
    {
      id: "totalTrips",
      header: "Trips",
      accessorKey: "totalTrips",
      cell: ({ getValue }) => (
        <span className="text-sm font-medium text-gray-700">
          {(getValue() as number).toLocaleString()}
        </span>
      ),
    },
    {
      id: "registeredAt",
      header: "Registered",
      accessorKey: "registeredAt",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-500">{getValue() as string}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const v = row.original;
        return (
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuickModal(v)}
              title="Quick view"
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <Link
              href={`/vehicles/${v.id}/overview`}
              title="Full profile"
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
            {v.status === "pending" && (
              <button
                onClick={() => setConfirm({ id: v.id, action: "approve" })}
                title="Approve"
                className="rounded-md p-1.5 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
            {v.status === "active" && (
              <button
                onClick={() => setConfirm({ id: v.id, action: "suspend" })}
                title="Suspend"
                className="rounded-md p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </button>
            )}
            {v.status === "suspended" && (
              <button
                onClick={() => setConfirm({ id: v.id, action: "reactivate" })}
                title="Reactivate"
                className="rounded-md p-1.5 text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
      {/* Header */}
      <DashboardHeader
        title="Vehicle Management"
        description="Monitor registered vehicles, verify documents, and track real-time status changes"
        onExportToCsv={() => exportToCsv(filtered, "vehicles.csv")}
      />

      {/* Deleted vehicle banners */}
      {deletedBanners.map((b) => (
        <div
          key={b.id}
          className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5"
        >
          <span className="text-sm text-amber-800">
            Vehicle <span className="font-mono font-semibold">{b.plate}</span> was removed from the platform.
          </span>
          <button
            onClick={() =>
              setDeletedBanners((prev) => prev.filter((x) => x.id !== b.id))
            }
            className="ml-4 text-amber-600 hover:text-amber-800"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      {/* Stat strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Vehicles", value: stats.total, color: "text-gray-900" },
          { label: "Active", value: stats.active, color: "text-emerald-700" },
          { label: "Pending Verification", value: stats.pendingVerification, color: "text-amber-700" },
          { label: "Suspended", value: stats.suspended, color: "text-red-700" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
          >
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={cn("mt-1 text-xl font-bold", s.color)}>
              {s.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search plate, make, model, driver..."
          className="w-72"
        />
        <FilterDropdown
          options={STATUS_FILTERS}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Status"
        />
        <FilterDropdown
          options={VERIFICATION_FILTERS}
          value={verFilter}
          onChange={setVerFilter}
          placeholder="Verification"
        />
        <input
          type="text"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          placeholder="Vehicle type..."
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        {(search || statusFilter || verFilter || typeFilter) && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
              setVerFilter("");
              setTypeFilter("");
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} results
        </span>
        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              connected
                ? "bg-emerald-500 animate-pulse"
                : "bg-gray-300",
            )}
          />
          <span className="text-xs text-gray-400">
            {connected ? "Live" : "Offline"}
          </span>
        </div>
      </div>

      {/* Bulk actions */}
      <BulkActionBar
        selectedCount={selected.length}
        onClear={() => setSelected([])}
        onApprove={() => {
          const ids = selected
            .filter((v) => v.status === "pending")
            .map((v) => v.id);
          if (ids.length > 0) setConfirm({ id: ids, action: "approve" });
        }}
        onSuspend={() => {
          const ids = selected
            .filter((v) => v.status === "active")
            .map((v) => v.id);
          if (ids.length > 0) setConfirm({ id: ids, action: "suspend" });
        }}
        onExportCsv={() => exportToCsv(selected, "selected-vehicles.csv")}
        approveLabel="Approve Pending"
        suspendLabel="Suspend Active"
      />

      {/* Table */}
      <DataTable<Vehicle>
        data={filtered}
        columns={columns}
        loading={false}
        pageSize={10}
        selectable
        onSelectionChange={setSelected}
      />

      {/* Quick modal */}
      {quickModal && (
        <VehicleQuickModal
          vehicle={quickModal}
          onClose={() => setQuickModal(null)}
          onAction={(id, action) => setConfirm({ id, action })}
        />
      )}

      {/* Confirm action modal */}
      {confirm && confirmConfig && (
        <ConfirmModal
          open
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmLabel={confirmConfig.confirmLabel}
          confirmClass={confirmConfig.confirmClass}
          onConfirm={() => {
            applyAction(confirm.id, confirm.action);
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}