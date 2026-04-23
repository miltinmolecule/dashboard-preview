"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "@/shared/common/DataTable";
import StatusBadge from "@/shared/common/StatusBadge";
import BulkActionBar from "@/shared/common/BulkActionBar";
import SearchInput from "@/shared/forms/SearchInput";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import { cn } from "@/utils/cn";
import type { Driver } from "../services/drivers.service";
import DashboardHeader from "@/shared/cards/DashboardHeader";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_DRIVERS: Driver[] = [
  {
    id: "drv_001",
    name: "Emeka Okonkwo",
    email: "emeka.o@email.com",
    phone: "+234 803 456 7890",
    kycStatus: "approved",
    accountStatus: "active",
    vehicleStatus: "active",
    totalTrips: 1842,
    totalEarnings: 4_628_400,
    vehicleModel: "Toyota Corolla 2020",
    vehiclePlate: "LND 234 XY",
    rating: 4.8,
    joinedAt: "2023-03-15",
    lastActive: "2026-04-14",
  },
  {
    id: "drv_002",
    name: "Fatima Al-Hassan",
    email: "fatima.h@email.com",
    phone: "+234 812 345 6789",
    kycStatus: "pending",
    accountStatus: "pending",
    vehicleStatus: "pending",
    totalTrips: 0,
    totalEarnings: 0,
    vehicleModel: "Honda Civic 2021",
    vehiclePlate: "ABJ 102 QR",
    rating: undefined,
    joinedAt: "2026-04-10",
    lastActive: undefined,
  },
  {
    id: "drv_003",
    name: "Chukwuemeka Eze",
    email: "ceze@email.com",
    phone: "+234 807 654 3210",
    kycStatus: "approved",
    accountStatus: "suspended",
    vehicleStatus: "suspended",
    totalTrips: 623,
    totalEarnings: 1_560_750,
    vehicleModel: "Hyundai Elantra 2019",
    vehiclePlate: "ENS 554 KL",
    rating: 3.9,
    joinedAt: "2022-11-20",
    lastActive: "2026-03-28",
  },
  {
    id: "drv_004",
    name: "Amina Bello",
    email: "amina.b@email.com",
    phone: "+234 806 987 6543",
    kycStatus: "approved",
    accountStatus: "active",
    vehicleStatus: "active",
    totalTrips: 3411,
    totalEarnings: 8_527_250,
    vehicleModel: "Toyota Camry 2022",
    vehiclePlate: "KJA 891 PQ",
    rating: 4.9,
    joinedAt: "2022-05-01",
    lastActive: "2026-04-15",
  },
  {
    id: "drv_005",
    name: "Biodun Adewale",
    email: "biodun.a@email.com",
    phone: "+234 809 111 2233",
    kycStatus: "rejected",
    accountStatus: "rejected",
    vehicleStatus: "suspended",
    totalTrips: 0,
    totalEarnings: 0,
    vehicleModel: "Kia Rio 2018",
    vehiclePlate: "OYO 321 MN",
    rating: undefined,
    joinedAt: "2026-03-01",
    lastActive: undefined,
  },
  {
    id: "drv_006",
    name: "Ngozi Ikenna",
    email: "ngozi.i@email.com",
    phone: "+234 814 222 3344",
    kycStatus: "approved",
    accountStatus: "active",
    vehicleStatus: "active",
    totalTrips: 978,
    totalEarnings: 2_445_000,
    vehicleModel: "Nissan Sentra 2020",
    vehiclePlate: "PH 678 RS",
    rating: 4.6,
    joinedAt: "2023-08-12",
    lastActive: "2026-04-14",
  },
  {
    id: "drv_007",
    name: "Taiwo Afolabi",
    email: "taiwo.af@email.com",
    phone: "+234 803 555 6677",
    kycStatus: "pending",
    accountStatus: "pending",
    vehicleStatus: "pending",
    totalTrips: 0,
    totalEarnings: 0,
    vehicleModel: "Ford Focus 2019",
    vehiclePlate: "LND 445 AB",
    rating: undefined,
    joinedAt: "2026-04-12",
    lastActive: undefined,
  },
  {
    id: "drv_008",
    name: "Suleiman Musa",
    email: "suleiman.m@email.com",
    phone: "+234 808 777 8899",
    kycStatus: "approved",
    accountStatus: "active",
    vehicleStatus: "active",
    totalTrips: 2105,
    totalEarnings: 5_262_500,
    vehicleModel: "Mazda 3 2021",
    vehiclePlate: "KD 903 UV",
    rating: 4.7,
    joinedAt: "2022-09-05",
    lastActive: "2026-04-15",
  },
  {
    id: "drv_009",
    name: "Adaeze Obi",
    email: "adaeze.o@email.com",
    phone: "+234 811 333 4455",
    kycStatus: "approved",
    accountStatus: "active",
    vehicleStatus: "active",
    totalTrips: 456,
    totalEarnings: 1_140_000,
    vehicleModel: "Volkswagen Jetta 2020",
    vehiclePlate: "AN 234 WX",
    rating: 4.5,
    joinedAt: "2024-01-20",
    lastActive: "2026-04-13",
  },
  {
    id: "drv_010",
    name: "Damilola Ogunyemi",
    email: "dami.o@email.com",
    phone: "+234 815 888 9900",
    kycStatus: "approved",
    accountStatus: "suspended",
    vehicleStatus: "active",
    totalTrips: 1287,
    totalEarnings: 3_217_500,
    vehicleModel: "Peugeot 301 2018",
    vehiclePlate: "LND 770 CD",
    rating: 4.1,
    joinedAt: "2023-02-14",
    lastActive: "2026-03-15",
  },
  {
    id: "drv_011",
    name: "Ismaila Garba",
    email: "ismaila.g@email.com",
    phone: "+234 810 444 5566",
    kycStatus: "pending",
    accountStatus: "pending",
    vehicleStatus: "pending",
    totalTrips: 0,
    totalEarnings: 0,
    vehicleModel: "Renault Logan 2020",
    vehiclePlate: "KN 120 EF",
    rating: undefined,
    joinedAt: "2026-04-08",
    lastActive: undefined,
  },
  {
    id: "drv_012",
    name: "Chisom Nwosu",
    email: "chisom.n@email.com",
    phone: "+234 816 999 0011",
    kycStatus: "approved",
    accountStatus: "active",
    vehicleStatus: "active",
    totalTrips: 3890,
    totalEarnings: 9_725_000,
    vehicleModel: "Toyota Highlander 2023",
    vehiclePlate: "IM 567 GH",
    rating: 4.9,
    joinedAt: "2021-07-30",
    lastActive: "2026-04-15",
  },
  {
    id: "drv_013",
    name: "Yetunde Fashola",
    email: "yetunde.f@email.com",
    phone: "+234 817 123 4567",
    kycStatus: "approved",
    accountStatus: "active",
    vehicleStatus: "active",
    totalTrips: 741,
    totalEarnings: 1_852_500,
    vehicleModel: "Honda Accord 2019",
    vehiclePlate: "LND 090 IJ",
    rating: 4.4,
    joinedAt: "2023-11-05",
    lastActive: "2026-04-14",
  },
  {
    id: "drv_014",
    name: "Murtala Abdullahi",
    email: "murtala.a@email.com",
    phone: "+234 818 234 5678",
    kycStatus: "rejected",
    accountStatus: "rejected",
    vehicleStatus: "suspended",
    totalTrips: 5,
    totalEarnings: 12_500,
    vehicleModel: "Toyota Corolla 2016",
    vehiclePlate: "SO 400 KL",
    rating: 2.8,
    joinedAt: "2026-02-20",
    lastActive: "2026-02-28",
  },
  {
    id: "drv_015",
    name: "Praise Uwem",
    email: "praise.u@email.com",
    phone: "+234 819 345 6789",
    kycStatus: "approved",
    accountStatus: "active",
    vehicleStatus: "active",
    totalTrips: 1543,
    totalEarnings: 3_857_500,
    vehicleModel: "Mitsubishi Lancer 2019",
    vehiclePlate: "AKS 234 MN",
    rating: 4.6,
    joinedAt: "2023-05-18",
    lastActive: "2026-04-15",
  },
];

// ─── Filter options ───────────────────────────────────────────────────────────

const KYC_FILTERS = [
  { label: "Pending KYC", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const STATUS_FILTERS = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
  { label: "Rejected", value: "rejected" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (v: number): string => {
  if (v >= 1_000_000) return `₦${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `₦${(v / 1_000).toFixed(0)}K`;
  return `₦${v.toLocaleString()}`;
};

const exportToCsv = (rows: Driver[], filename: string): void => {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "KYC Status",
    "Account Status",
    "Total Trips",
    "Total Earnings",
  ];
  const lines = rows.map((d) =>
    [
      d.name,
      d.email,
      d.phone,
      d.kycStatus,
      d.accountStatus,
      d.totalTrips,
      d.totalEarnings,
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

// ─── Driver Profile Modal ─────────────────────────────────────────────────────

function DriverProfileModal({
  driver,
  onClose,
  onAction,
}: {
  driver: Driver;
  onClose: () => void;
  onAction: (
    id: string,
    action: "approve" | "suspend" | "reactivate" | "reject",
  ) => void;
}): React.ReactNode {
  const [activeTab, setActiveTab] = useState<"profile" | "vehicle" | "kyc">(
    "profile",
  );

  const initials = driver.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <ModalWrapper open onClose={onClose} size="xl">
      {/* Driver header */}
      <div className="flex items-start gap-4 pb-5 border-b border-gray-100">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-lg font-bold">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900">
              {driver.name}
            </h3>
            <StatusBadge
              status={driver.kycStatus}
              label={`KYC: ${driver.kycStatus}`}
            />
            <StatusBadge status={driver.accountStatus} />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {driver.email} · {driver.phone}
          </p>
          {driver.rating && (
            <div className="mt-1 flex items-center gap-1">
              <svg
                className="h-4 w-4 text-amber-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {driver.rating}
              </span>
              <span className="text-xs text-gray-400">rating</span>
            </div>
          )}
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {driver.accountStatus === "pending" && (
            <button
              onClick={() => onAction(driver.id, "approve")}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              Approve
            </button>
          )}
          {driver.accountStatus === "pending" && (
            <button
              onClick={() => onAction(driver.id, "reject")}
              className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
            >
              Reject
            </button>
          )}
          {driver.accountStatus === "active" && (
            <button
              onClick={() => onAction(driver.id, "suspend")}
              className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
            >
              Suspend
            </button>
          )}
          {driver.accountStatus === "suspended" && (
            <button
              onClick={() => onAction(driver.id, "reactivate")}
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
          { label: "Total Trips", value: driver.totalTrips.toLocaleString() },
          {
            label: "Total Earnings",
            value: formatCurrency(driver.totalEarnings),
          },
          { label: "Joined", value: driver.joinedAt },
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
        {(["profile", "vehicle", "kyc"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 rounded-md py-1.5 text-xs font-medium transition-all capitalize",
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {tab === "kyc"
              ? "KYC Documents"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === "profile" && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Email", value: driver.email },
              { label: "Phone", value: driver.phone },
              { label: "Account Status", value: driver.accountStatus },
              { label: "Vehicle Status", value: driver.vehicleStatus },
              { label: "Joined", value: driver.joinedAt },
              { label: "Last Active", value: driver.lastActive ?? "Never" },
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

        {activeTab === "vehicle" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Vehicle Model",
                  value: driver.vehicleModel ?? "Not provided",
                },
                {
                  label: "Plate Number",
                  value: driver.vehiclePlate ?? "Not provided",
                },
                { label: "Vehicle Status", value: driver.vehicleStatus },
              ].map((f) => (
                <div key={f.label} className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">{f.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900 capitalize">
                    {f.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "kyc" && (
          <div className="space-y-2">
            {[
              { label: "Driver's License", status: driver.kycStatus },
              { label: "National ID (NIN/BVN)", status: driver.kycStatus },
              {
                label: "Vehicle Papers",
                status:
                  driver.vehicleStatus === "active" ? "approved" : "pending",
              },
              {
                label: "Insurance",
                status:
                  driver.vehicleStatus === "active" ? "approved" : "pending",
              },
              { label: "Profile Photo", status: "approved" },
            ].map((doc) => (
              <div
                key={doc.label}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">{doc.label}</span>
                </div>
                <StatusBadge status={doc.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}

// ─── Confirm Action Modal ─────────────────────────────────────────────────────

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

// ─── Main view ────────────────────────────────────────────────────────────────

export default function DriversView(): React.ReactNode {
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDrivers, setSelectedDrivers] = useState<Driver[]>([]);
  const [profileDriver, setProfileDriver] = useState<Driver | null>(null);
  const [confirm, setConfirm] = useState<{
    id: string | string[];
    action: "approve" | "suspend" | "reactivate" | "reject";
  } | null>(null);
  // swap with real query: const { data, isLoading } = useDrivers({ search, kycStatus: kycFilter, accountStatus: statusFilter });
  const loading = false;
  const [driverData, setDriverData] = useState<Driver[]>(MOCK_DRIVERS);

  const filtered = useMemo(() => {
    return driverData.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.phone.includes(q);
      const matchKyc = !kycFilter || d.kycStatus === kycFilter;
      const matchStatus = !statusFilter || d.accountStatus === statusFilter;
      return matchSearch && matchKyc && matchStatus;
    });
  }, [driverData, search, kycFilter, statusFilter]);

  const stats = useMemo(
    () => ({
      total: driverData.length,
      active: driverData.filter((d) => d.accountStatus === "active").length,
      pendingKyc: driverData.filter((d) => d.kycStatus === "pending").length,
      suspended: driverData.filter((d) => d.accountStatus === "suspended")
        .length,
    }),
    [driverData],
  );

  const applyAction = useCallback(
    (
      id: string | string[],
      action: "approve" | "suspend" | "reactivate" | "reject",
    ) => {
      setDriverData((prev) =>
        prev.map((d) => {
          const ids = Array.isArray(id) ? id : [id];
          if (!ids.includes(d.id)) return d;
          switch (action) {
            case "approve":
              return {
                ...d,
                accountStatus: "active" as const,
                kycStatus: "approved" as const,
                vehicleStatus: "active" as const,
              };
            case "reject":
              return {
                ...d,
                accountStatus: "rejected" as const,
                kycStatus: "rejected" as const,
              };
            case "suspend":
              return { ...d, accountStatus: "suspended" as const };
            case "reactivate":
              return { ...d, accountStatus: "active" as const };
            default:
              return d;
          }
        }),
      );
      if (profileDriver && !Array.isArray(id) && profileDriver.id === id) {
        setProfileDriver((prev) => {
          if (!prev) return prev;
          switch (action) {
            case "approve":
              return {
                ...prev,
                accountStatus: "active",
                kycStatus: "approved",
                vehicleStatus: "active",
              };
            case "reject":
              return {
                ...prev,
                accountStatus: "rejected",
                kycStatus: "rejected",
              };
            case "suspend":
              return { ...prev, accountStatus: "suspended" };
            case "reactivate":
              return { ...prev, accountStatus: "active" };
            default:
              return prev;
          }
        });
      }
    },
    [profileDriver],
  );

  const columns: ColumnDef<Driver, unknown>[] = [
    {
      id: "driver",
      header: "Driver",
      accessorKey: "name",
      cell: ({ row }) => {
        const d = row.original;
        const initials = d.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        return (
          <button
            onClick={() => setProfileDriver(d)}
            className="flex items-center gap-2.5 text-left hover:text-blue-600 transition-colors"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 leading-tight">
                {d.name}
              </p>
              <p className="text-xs text-gray-400">{d.email}</p>
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
      id: "kycStatus",
      header: "KYC",
      accessorKey: "kycStatus",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      id: "accountStatus",
      header: "Account",
      accessorKey: "accountStatus",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      id: "vehicleStatus",
      header: "Vehicle",
      accessorKey: "vehicleStatus",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
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
      id: "totalEarnings",
      header: "Earnings",
      accessorKey: "totalEarnings",
      cell: ({ getValue }) => (
        <span className="text-sm font-medium text-gray-700">
          {formatCurrency(getValue() as number)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={`/drivers/${d.id}/personal`}
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
            {d.accountStatus === "pending" && (
              <button
                onClick={() => setConfirm({ id: d.id, action: "approve" })}
                title="Approve"
                className="rounded-md p-1.5 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            )}
            {d.accountStatus === "active" && (
              <button
                onClick={() => setConfirm({ id: d.id, action: "suspend" })}
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
            {d.accountStatus === "suspended" && (
              <button
                onClick={() => setConfirm({ id: d.id, action: "reactivate" })}
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

  const confirmConfig = confirm
    ? {
        approve: {
          title: "Approve Driver",
          message:
            "This will approve the driver and allow them to start accepting trips.",
          confirmLabel: "Approve",
          confirmClass: "bg-emerald-600 hover:bg-emerald-700",
        },
        reject: {
          title: "Reject Driver",
          message:
            "This will reject the driver's KYC application. They will be notified.",
          confirmLabel: "Reject",
          confirmClass: "bg-red-600 hover:bg-red-700",
        },
        suspend: {
          title: "Suspend Driver",
          message:
            "This will suspend the driver and prevent them from accepting new trips.",
          confirmLabel: "Suspend",
          confirmClass: "bg-red-600 hover:bg-red-700",
        },
        reactivate: {
          title: "Reactivate Driver",
          message:
            "This will reactivate the driver and allow them to start accepting trips again.",
          confirmLabel: "Reactivate",
          confirmClass: "bg-[var(--primary)] hover:bg-blue-700",
        },
      }[confirm.action]
    : null;

  return (
    <div className="space-y-5">
      {/* Header */}

      <DashboardHeader
        title="Driver Management"
        description="Manage drivers, KYC verification, and account status"
        onExportToCsv={() => exportToCsv(filtered, "drivers.csv")}
      />

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "Total Drivers",
            value: stats.total,
            color: "text-gray-900",
          },
          { label: "Active", value: stats.active, color: "text-emerald-700" },
          {
            label: "Pending KYC",
            value: stats.pendingKyc,
            color: "text-amber-700",
          },
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
      <div className="flex items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email or phone..."
          className="w-72"
        />
        <FilterDropdown
          options={KYC_FILTERS}
          value={kycFilter}
          onChange={setKycFilter}
          placeholder="KYC Status"
        />
        <FilterDropdown
          options={STATUS_FILTERS}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Account Status"
        />
        {(search || kycFilter || statusFilter) && (
          <button
            onClick={() => {
              setSearch("");
              setKycFilter("");
              setStatusFilter("");
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} results
        </span>
      </div>

      {/* Bulk action bar */}
      <BulkActionBar
        selectedCount={selectedDrivers.length}
        onClear={() => setSelectedDrivers([])}
        onApprove={() => {
          const ids = selectedDrivers
            .filter((d) => d.accountStatus === "pending")
            .map((d) => d.id);
          if (ids.length > 0) setConfirm({ id: ids, action: "approve" });
        }}
        onSuspend={() => {
          const ids = selectedDrivers
            .filter((d) => d.accountStatus === "active")
            .map((d) => d.id);
          if (ids.length > 0) setConfirm({ id: ids, action: "suspend" });
        }}
        onExportCsv={() => exportToCsv(selectedDrivers, "selected-drivers.csv")}
        approveLabel="Approve Pending"
        suspendLabel="Suspend Active"
      />

      {/* Table */}
      <DataTable<Driver>
        data={filtered}
        columns={columns}
        loading={loading}
        pageSize={10}
        selectable
        onSelectionChange={setSelectedDrivers}
      />

      {/* Driver profile modal */}
      {profileDriver && (
        <DriverProfileModal
          driver={profileDriver}
          onClose={() => setProfileDriver(null)}
          onAction={(id, action) => {
            setConfirm({ id, action });
          }}
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
