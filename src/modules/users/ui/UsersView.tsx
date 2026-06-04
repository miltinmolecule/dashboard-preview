"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "@/shared/common/DataTable";
import StatusBadge from "@/shared/common/StatusBadge";
import BulkActionBar from "@/shared/common/BulkActionBar";
import SearchInput from "@/shared/forms/SearchInput";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import { cn } from "@/utils/cn";
import type { Rider, RiderTrip } from "../services/users.service";
import DashboardHeader from "@/shared/cards/DashboardHeader";
import {
  useUsers,
  useSuspendUser,
  useReactivateUser,
  useUserRides,
} from "../hooks/useUsers";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (v: number): string => {
  if (v >= 1_000) return `₦${(v / 1_000).toFixed(1)}K`;
  return `₦${v.toLocaleString()}`;
};

const exportToCsv = (rows: Rider[], filename: string): void => {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Status",
    "Wallet Balance",
    "Total Trips",
    "Last Trip",
    "Joined",
  ];
  const lines = rows.map((r) =>
    [
      r.name,
      r.email,
      r.phone,
      r.accountStatus,
      r.walletBalance,
      r.totalTrips,
      r.lastTripDate ?? "",
      r.joinedAt,
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

// ─── Rider Profile Modal ──────────────────────────────────────────────────────

function RiderProfileModal({
  rider,
  onClose,
  onAction,
}: {
  rider: Rider;
  onClose: () => void;
  onAction: (id: string, action: "suspend" | "reactivate") => void;
}): React.ReactNode {
  const [tab, setTab] = useState<"profile" | "trips">("profile");
  const { data: trips = [], isLoading: tripsLoading } = useUserRides(rider.id);
  const initials = rider.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <ModalWrapper open onClose={onClose} size="lg">
      {/* Header */}
      <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-base font-bold">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900">
              {rider.name}
            </h3>
            <StatusBadge status={rider.accountStatus} />
          </div>
          <p className="text-sm text-gray-500">
            {rider.email} · {rider.phone}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {rider.accountStatus === "active" && (
            <button
              onClick={() => onAction(rider.id, "suspend")}
              className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
            >
              Suspend
            </button>
          )}
          {rider.accountStatus === "suspended" && (
            <button
              onClick={() => onAction(rider.id, "reactivate")}
              className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Reactivate
            </button>
          )}
        </div>
      </div>

      {/* Stats strip */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          {
            label: "Wallet Balance",
            value: formatCurrency(rider.walletBalance),
          },
          { label: "Total Trips", value: rider.totalTrips.toLocaleString() },
          { label: "Last Trip", value: rider.lastTripDate ?? "None" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-900">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-1 rounded-lg bg-gray-100 p-1">
        {(["profile", "trips"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-md py-1.5 text-xs font-medium transition-all capitalize",
              tab === t
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {t === "trips" ? "Trip History" : "Profile"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-4">
        {tab === "profile" && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Email", value: rider.email },
              { label: "Phone", value: rider.phone },
              { label: "Account Status", value: rider.accountStatus },
              {
                label: "Wallet Balance",
                value: formatCurrency(rider.walletBalance),
              },
              { label: "Joined", value: rider.joinedAt },
              {
                label: "Rating",
                value: rider.rating ? `${rider.rating} ★` : "N/A",
              },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs text-gray-400">{f.label}</p>
                <p className="mt-0.5 text-sm font-medium text-gray-900 capitalize">
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {tab === "trips" && (
          <div>
            {tripsLoading ? (
              <p className="text-center py-8 text-sm text-gray-400">
                Loading trips…
              </p>
            ) : trips.length === 0 ? (
              <p className="text-center py-8 text-sm text-gray-400">
                No trip history available.
              </p>
            ) : (
              <div className="space-y-2">
                {trips.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-start justify-between rounded-lg border border-gray-100 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {t.pickup} → {t.destination}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Driver: {t.driverName} · {t.date}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-sm font-semibold text-gray-900">
                        ₦{t.fare.toLocaleString()}
                      </p>
                      <StatusBadge status={t.status} className="mt-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

const STATUS_FILTERS = [
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
  { label: "Flagged", value: "flagged" },
  { label: "Deleted", value: "deleted" },
];

export default function UsersView(): React.ReactNode {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRiders, setSelectedRiders] = useState<Rider[]>([]);
  const [profileRider, setProfileRider] = useState<Rider | null>(null);

  const { data: page, isLoading } = useUsers({ search, status: statusFilter });
  const riderData: Rider[] = page?.items ?? [];

  const suspendMutation = useSuspendUser();
  const reactivateMutation = useReactivateUser();

  const filtered = riderData; // filtering is server-side via query params

  const stats = useMemo(
    () => ({
      total: page?.total ?? 0,
      active: riderData.filter((r) => r.accountStatus === "active").length,
      suspended: riderData.filter((r) => r.accountStatus === "suspended")
        .length,
      flagged: riderData.filter((r) => r.accountStatus === "flagged").length,
    }),
    [riderData, page],
  );

  const handleAction = (id: string, action: "suspend" | "reactivate"): void => {
    if (action === "suspend") {
      suspendMutation.mutate(id);
    } else {
      reactivateMutation.mutate(id);
    }
    // Optimistically update the open modal
    if (profileRider?.id === id) {
      setProfileRider((prev) =>
        prev
          ? {
              ...prev,
              accountStatus: action === "suspend" ? "suspended" : "active",
            }
          : prev,
      );
    }
  };

  const columns: ColumnDef<Rider, unknown>[] = [
    {
      id: "rider",
      header: "Rider",
      accessorKey: "name",
      cell: ({ row }) => {
        const r = row.original;
        const initials = r.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        return (
          <button
            onClick={() => setProfileRider(r)}
            className="flex items-center gap-2.5 text-left hover:text-violet-600 transition-colors"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700 text-xs font-bold">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 leading-tight">
                {r.name}
              </p>
              <p className="text-xs text-gray-400">{r.email}</p>
            </div>
          </button>
        );
      },
    },
    {
      id: "phone",
      header: "Phone",
      accessorKey: "phone",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">{getValue() as string}</span>
      ),
    },
    {
      id: "walletBalance",
      header: "Wallet",
      accessorKey: "walletBalance",
      cell: ({ getValue }) => (
        <span
          className={cn(
            "text-sm font-medium",
            (getValue() as number) > 0 ? "text-emerald-700" : "text-gray-400",
          )}
        >
          {formatCurrency(getValue() as number)}
        </span>
      ),
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
      id: "lastTripDate",
      header: "Last Trip",
      accessorKey: "lastTripDate",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-500">
          {(getValue() as string | undefined) ?? "Never"}
        </span>
      ),
    },
    {
      id: "accountStatus",
      header: "Status",
      accessorKey: "accountStatus",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const r = row.original;
        return (
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={`/users/${r.id}/personal`}
              title="View full profile"
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </Link>
            {r.accountStatus === "active" && (
              <button
                onClick={() => handleAction(r.id, "suspend")}
                title="Suspend"
                className="rounded-md p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              </button>
            )}
            {r.accountStatus === "suspended" && (
              <button
                onClick={() => handleAction(r.id, "reactivate")}
                title="Reactivate"
                className="rounded-md p-1.5 text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
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
        title="User Management"
        description="Manage passengers and their account status"
        onExportToCsv={() => exportToCsv(filtered, "riders.csv")}
      />

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Riders", value: stats.total, color: "text-gray-900" },
          { label: "Active", value: stats.active, color: "text-emerald-700" },
          { label: "Suspended", value: stats.suspended, color: "text-red-700" },
          { label: "Flagged", value: stats.flagged, color: "text-orange-700" },
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
      <div className="flex items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email or phone..."
          className="w-72"
        />
        <FilterDropdown
          options={STATUS_FILTERS}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Account Status"
        />
        {(search || statusFilter) && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">
          {page?.total ?? 0} results
        </span>
      </div>

      {/* Bulk action bar */}
      <BulkActionBar
        selectedCount={selectedRiders.length}
        onClear={() => setSelectedRiders([])}
        onSuspend={() => {
          selectedRiders
            .filter((r) => r.accountStatus === "active")
            .forEach((r) => suspendMutation.mutate(r.id));
          setSelectedRiders([]);
        }}
        onExportCsv={() => exportToCsv(selectedRiders, "selected-riders.csv")}
        suspendLabel="Suspend Active"
      />

      {/* Table */}
      <DataTable<Rider>
        data={filtered}
        columns={columns}
        loading={isLoading}
        pageSize={20}
        selectable
        onSelectionChange={setSelectedRiders}
      />

      {/* Rider profile modal */}
      {profileRider && (
        <RiderProfileModal
          rider={profileRider}
          onClose={() => setProfileRider(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}
