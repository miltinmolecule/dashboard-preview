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
import type { Trip } from "../services/trips.service";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_TRIPS: Trip[] = [
  {
    id: "TRP-2026-0001", driver: { id: "drv_001", name: "Emeka Okonkwo", phone: "+234 803 456 7890", rating: 4.8 }, rider: { id: "usr_001", name: "Tunde Bakare", phone: "+234 803 100 2200", rating: 4.7 },
    pickup: "Ikeja, Lagos", destination: "Victoria Island, Lagos", fare: 3_200, fareBreakdown: { baseFare: 500, distanceFare: 2_100, timeFare: 400, surge: 200, discount: 0, total: 3_200 },
    status: "completed", distanceKm: 24.5, durationMin: 38, createdAt: "2026-04-14T10:22:00Z", completedAt: "2026-04-14T11:00:00Z",
  },
  {
    id: "TRP-2026-0002", driver: { id: "drv_004", name: "Amina Bello", phone: "+234 806 987 6543", rating: 4.9 }, rider: { id: "usr_006", name: "Aisha Yusuf", phone: "+234 815 600 7700", rating: 4.6 },
    pickup: "Maitama, Abuja", destination: "Gwarinpa, Abuja", fare: 2_800, fareBreakdown: { baseFare: 400, distanceFare: 1_900, timeFare: 300, surge: 200, discount: 0, total: 2_800 },
    status: "in_progress", distanceKm: 18.2, durationMin: 25, createdAt: "2026-04-15T09:10:00Z",
  },
  {
    id: "TRP-2026-0003", driver: { id: "drv_006", name: "Ngozi Ikenna", phone: "+234 814 222 3344", rating: 4.6 }, rider: { id: "usr_002", name: "Chidinma Okafor", phone: "+234 812 200 3300", rating: 4.9 },
    pickup: "Wuse II, Abuja", destination: "Central Area, Abuja", fare: 1_500, fareBreakdown: { baseFare: 300, distanceFare: 900, timeFare: 300, total: 1_500 },
    status: "completed", distanceKm: 8.1, durationMin: 15, createdAt: "2026-04-13T14:05:00Z", completedAt: "2026-04-13T14:20:00Z",
  },
  {
    id: "TRP-2026-0004", driver: { id: "drv_008", name: "Suleiman Musa", phone: "+234 808 777 8899", rating: 4.7 }, rider: { id: "usr_004", name: "Blessing Eze", phone: "+234 814 400 5500", rating: 4.8 },
    pickup: "Surulere, Lagos", destination: "Lekki Phase 1, Lagos", fare: 4_100, fareBreakdown: { baseFare: 600, distanceFare: 2_700, timeFare: 500, surge: 300, discount: 0, total: 4_100 },
    status: "cancelled", distanceKm: 31.0, durationMin: 0, createdAt: "2026-04-12T16:30:00Z",
  },
  {
    id: "TRP-2026-0005", driver: { id: "drv_012", name: "Chisom Nwosu", phone: "+234 816 999 0011", rating: 4.9 }, rider: { id: "usr_010", name: "Adaeze Obiora", phone: "+234 817 011 1122", rating: 4.9 },
    pickup: "GRA, Port Harcourt", destination: "Rumuola, Port Harcourt", fare: 2_200, fareBreakdown: { baseFare: 400, distanceFare: 1_400, timeFare: 400, total: 2_200 },
    status: "completed", distanceKm: 12.4, durationMin: 20, createdAt: "2026-04-11T08:45:00Z", completedAt: "2026-04-11T09:05:00Z",
  },
  {
    id: "TRP-2026-0006", driver: { id: "drv_015", name: "Praise Uwem", phone: "+234 819 345 6789", rating: 4.6 }, rider: { id: "usr_008", name: "Grace Okonkwo", phone: "+234 816 800 9900", rating: 4.8 },
    pickup: "Calabar Road, Cross River", destination: "State House, Calabar", fare: 1_800, fareBreakdown: { baseFare: 350, distanceFare: 1_100, timeFare: 350, total: 1_800 },
    status: "completed", distanceKm: 9.8, durationMin: 18, createdAt: "2026-04-10T11:20:00Z", completedAt: "2026-04-10T11:38:00Z",
  },
  {
    id: "TRP-2026-0007", driver: { id: "drv_009", name: "Adaeze Obi", phone: "+234 811 333 4455", rating: 4.5 }, rider: { id: "usr_007", name: "Emmanuel Nwosu", phone: "+234 810 700 8800", rating: 4.5 },
    pickup: "Benin City, Edo", destination: "Sapele Road, Benin", fare: 1_200, fareBreakdown: { baseFare: 250, distanceFare: 700, timeFare: 250, total: 1_200 },
    status: "requested", distanceKm: 6.2, durationMin: 0, createdAt: "2026-04-15T12:05:00Z",
  },
  {
    id: "TRP-2026-0008", driver: { id: "drv_013", name: "Yetunde Fashola", phone: "+234 817 123 4567", rating: 4.4 }, rider: { id: "usr_012", name: "Oluwakemi Adeyemi", phone: "+234 813 233 3344", rating: 4.6 },
    pickup: "Bodija, Ibadan", destination: "UI, Ibadan", fare: 900, fareBreakdown: { baseFare: 200, distanceFare: 500, timeFare: 200, total: 900 },
    status: "failed", distanceKm: 4.5, durationMin: 0, createdAt: "2026-04-09T17:15:00Z",
  },
  {
    id: "TRP-2026-0009", driver: { id: "drv_001", name: "Emeka Okonkwo", phone: "+234 803 456 7890", rating: 4.8 }, rider: { id: "usr_003", name: "Hakeem Adisa", phone: "+234 808 300 4400", rating: 3.2 },
    pickup: "Yaba, Lagos", destination: "Oshodi, Lagos", fare: 2_500, fareBreakdown: { baseFare: 400, distanceFare: 1_600, timeFare: 500, total: 2_500 },
    status: "driver_assigned", distanceKm: 15.0, durationMin: 0, createdAt: "2026-04-15T13:00:00Z",
  },
  {
    id: "TRP-2026-0010", driver: { id: "drv_004", name: "Amina Bello", phone: "+234 806 987 6543", rating: 4.9 }, rider: { id: "usr_011", name: "Festus Agbaje", phone: "+234 808 122 2233", rating: 3.8 },
    pickup: "Allen Avenue, Ikeja", destination: "Opebi, Ikeja", fare: 1_100, fareBreakdown: { baseFare: 250, distanceFare: 600, timeFare: 250, total: 1_100 },
    status: "completed", distanceKm: 5.5, durationMin: 12, createdAt: "2026-04-08T09:30:00Z", completedAt: "2026-04-08T09:42:00Z",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (v: number): string => `₦${v.toLocaleString()}`;

const STATUS_FILTERS = [
  { label: "Requested", value: "requested" },
  { label: "Driver Assigned", value: "driver_assigned" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Failed", value: "failed" },
];

const TRIP_STATUS_STEPS: Array<{ key: string; label: string }> = [
  { key: "requested", label: "Requested" },
  { key: "driver_assigned", label: "Driver Assigned" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

const STATUS_ORDER: Record<string, number> = {
  requested: 0,
  driver_assigned: 1,
  in_progress: 2,
  completed: 3,
  cancelled: -1,
  failed: -1,
};

// ─── Trip Detail Modal ────────────────────────────────────────────────────────

function TripDetailModal({
  trip,
  onClose,
  onCancel,
}: {
  trip: Trip;
  onClose: () => void;
  onCancel: (id: string) => void;
}): React.ReactNode {
  const statusIdx = STATUS_ORDER[trip.status] ?? -1;
  const isTerminal = trip.status === "cancelled" || trip.status === "failed";

  return (
    <ModalWrapper open onClose={onClose} size="xl">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">{trip.id}</h3>
            <StatusBadge status={trip.status} />
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(trip.createdAt).toLocaleString()} · {trip.distanceKm} km
            {trip.durationMin ? ` · ${trip.durationMin} min` : ""}
          </p>
        </div>
        {(trip.status === "in_progress" || trip.status === "driver_assigned" || trip.status === "requested") && (
          <button
            onClick={() => onCancel(trip.id)}
            className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
          >
            Cancel Trip
          </button>
        )}
      </div>

      {/* Status timeline */}
      {!isTerminal && (
        <div className="mt-4">
          <div className="flex items-center">
            {TRIP_STATUS_STEPS.map((step, i) => {
              const done = statusIdx >= i;
              const active = statusIdx === i;
              return (
                <div key={step.key} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold",
                      done ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 bg-white text-gray-300",
                      active && "ring-2 ring-blue-200"
                    )}>
                      {done ? (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : i + 1}
                    </div>
                    <span className={cn("mt-1 text-center text-xs leading-tight", done ? "text-blue-700 font-medium" : "text-gray-400")} style={{ width: 72 }}>
                      {step.label}
                    </span>
                  </div>
                  {i < TRIP_STATUS_STEPS.length - 1 && (
                    <div className={cn("mx-1 mb-4 h-0.5 flex-1", done && statusIdx > i ? "bg-blue-500" : "bg-gray-200")} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isTerminal && (
        <div className={cn(
          "mt-4 rounded-lg px-4 py-2.5 text-sm font-medium",
          trip.status === "cancelled" ? "bg-red-50 text-red-700" : "bg-orange-50 text-orange-700"
        )}>
          This trip was {trip.status === "cancelled" ? "cancelled before completion." : "failed due to a system error."}
        </div>
      )}

      {/* Driver & Rider */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {[
          { role: "Driver", person: trip.driver, color: "bg-blue-50 text-blue-700" },
          { role: "Rider", person: trip.rider, color: "bg-violet-50 text-violet-700" },
        ].map(({ role, person, color }) => {
          const initials = person.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
          return (
            <div key={role} className="rounded-xl border border-gray-100 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">{role}</p>
              <div className="flex items-center gap-2">
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold", color)}>
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{person.name}</p>
                  <p className="text-xs text-gray-400">{person.phone}</p>
                  {person.rating && <p className="text-xs text-amber-600">★ {person.rating}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Route */}
      <div className="mt-4 rounded-xl border border-gray-100 p-3">
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center pt-1">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <div className="my-1 h-8 w-0.5 bg-gray-200" />
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs text-gray-400">Pickup</p>
              <p className="text-sm font-medium text-gray-900">{trip.pickup}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Destination</p>
              <p className="text-sm font-medium text-gray-900">{trip.destination}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fare breakdown */}
      <div className="mt-4 rounded-xl border border-gray-100 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Fare Breakdown</p>
        <div className="space-y-1.5">
          {[
            { label: "Base Fare", value: trip.fareBreakdown.baseFare },
            { label: "Distance Fare", value: trip.fareBreakdown.distanceFare },
            { label: "Time Fare", value: trip.fareBreakdown.timeFare },
            ...(trip.fareBreakdown.surge ? [{ label: "Surge", value: trip.fareBreakdown.surge }] : []),
            ...(trip.fareBreakdown.discount ? [{ label: "Discount", value: -(trip.fareBreakdown.discount) }] : []),
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{item.label}</span>
              <span className={cn("font-medium", item.value < 0 ? "text-emerald-600" : "text-gray-700")}>
                {item.value < 0 ? `-₦${Math.abs(item.value).toLocaleString()}` : formatCurrency(item.value)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-1">
            <span className="text-sm font-semibold text-gray-900">Total</span>
            <span className="text-sm font-bold text-gray-900">{formatCurrency(trip.fareBreakdown.total)}</span>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export default function RideAndTripsView(): React.ReactNode {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTrips, setSelectedTrips] = useState<Trip[]>([]);
  const [detailTrip, setDetailTrip] = useState<Trip | null>(null);
  // swap with real query: const { data, isLoading } = useTrips({ search, status: statusFilter });
  const loading = false;
  const [tripData, setTripData] = useState<Trip[]>(MOCK_TRIPS);

  const filtered = useMemo(() => {
    return tripData.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.driver.name.toLowerCase().includes(q) ||
        t.rider.name.toLowerCase().includes(q) ||
        t.pickup.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q);
      const matchStatus = !statusFilter || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tripData, search, statusFilter]);

  const stats = useMemo(() => ({
    active: tripData.filter((t) => ["in_progress", "driver_assigned", "requested"].includes(t.status)).length,
    completed: tripData.filter((t) => t.status === "completed").length,
    cancelled: tripData.filter((t) => t.status === "cancelled").length,
    failed: tripData.filter((t) => t.status === "failed").length,
  }), [tripData]);

  const handleCancelTrip = (id: string): void => {
    setTripData((prev) => prev.map((t) => t.id === id ? { ...t, status: "cancelled" as const } : t));
    if (detailTrip?.id === id) {
      setDetailTrip((prev) => prev ? { ...prev, status: "cancelled" as const } : prev);
    }
  };

  const exportToCsv = (rows: Trip[], filename: string): void => {
    const headers = ["Trip ID", "Driver", "Rider", "Pickup", "Destination", "Fare", "Status", "Date"];
    const lines = rows.map((t) =>
      [t.id, t.driver.name, t.rider.name, t.pickup, t.destination, t.fare, t.status, t.createdAt].join(",")
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

  const columns: ColumnDef<Trip, unknown>[] = [
    {
      id: "tripId",
      header: "Trip ID",
      accessorKey: "id",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs font-medium text-blue-700">{getValue() as string}</span>
      ),
    },
    {
      id: "driver",
      header: "Driver",
      accessorKey: "driver",
      enableSorting: false,
      cell: ({ getValue }) => {
        const d = getValue() as Trip["driver"];
        return <span className="text-sm text-gray-700">{d.name}</span>;
      },
    },
    {
      id: "rider",
      header: "Rider",
      accessorKey: "rider",
      enableSorting: false,
      cell: ({ getValue }) => {
        const r = getValue() as Trip["rider"];
        return <span className="text-sm text-gray-700">{r.name}</span>;
      },
    },
    {
      id: "route",
      header: "Route",
      enableSorting: false,
      cell: ({ row }) => {
        const t = row.original;
        return (
          <div className="text-xs text-gray-600 max-w-[200px]">
            <p className="truncate">{t.pickup}</p>
            <p className="truncate text-gray-400">→ {t.destination}</p>
          </div>
        );
      },
    },
    {
      id: "fare",
      header: "Fare",
      accessorKey: "fare",
      cell: ({ getValue }) => (
        <span className="text-sm font-semibold text-gray-800">{formatCurrency(getValue() as number)}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      id: "createdAt",
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ getValue }) => (
        <span className="text-xs text-gray-500">
          {new Date(getValue() as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <button
          onClick={(e) => { e.stopPropagation(); setDetailTrip(row.original); }}
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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">Ride &amp; Trip Management</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {stats.active} live
            </span>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">Monitor, inspect, and manage all platform trips</p>
        </div>
        <button
          onClick={() => exportToCsv(filtered, "trips.csv")}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Active Trips", value: stats.active, color: "text-blue-700" },
          { label: "Completed", value: stats.completed, color: "text-emerald-700" },
          { label: "Cancelled", value: stats.cancelled, color: "text-red-700" },
          { label: "Failed", value: stats.failed, color: "text-orange-700" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={cn("mt-1 text-xl font-bold", s.color)}>{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search trip ID, driver, rider, or location..."
          className="w-80"
        />
        <FilterDropdown
          options={STATUS_FILTERS}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Trip Status"
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
        selectedCount={selectedTrips.length}
        onClear={() => setSelectedTrips([])}
        onExportCsv={() => exportToCsv(selectedTrips, "selected-trips.csv")}
      />

      {/* Table */}
      <DataTable<Trip>
        data={filtered}
        columns={columns}
        loading={loading}
        pageSize={10}
        selectable
        onSelectionChange={setSelectedTrips}
      />

      {/* Trip detail modal */}
      {detailTrip && (
        <TripDetailModal
          trip={detailTrip}
          onClose={() => setDetailTrip(null)}
          onCancel={(id) => { handleCancelTrip(id); setDetailTrip(null); }}
        />
      )}
    </div>
  );
}
