"use client";

import { useState } from "react";
import Link from "next/link";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import StatusBadge from "@/shared/common/StatusBadge";
import { cn } from "@/utils/cn";
import type { Vehicle } from "../services/vehicles.service";

interface Props {
  vehicle: Vehicle;
  onClose: () => void;
  onAction: (
    id: string,
    action: "approve" | "reject" | "suspend" | "reactivate",
  ) => void;
}

export default function VehicleQuickModal({
  vehicle,
  onClose,
  onAction,
}: Props): React.ReactNode {
  const [tab, setTab] = useState<"overview" | "documents" | "driver">(
    "overview",
  );

  return (
    <ModalWrapper open onClose={onClose} size="lg">
      {/* Header */}
      <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h2m4 2h4.5M5 16H3" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900">
              {vehicle.make} {vehicle.model} {vehicle.year}
            </h3>
            <StatusBadge status={vehicle.status} />
            <StatusBadge
              status={vehicle.verificationStatus}
              label={`Docs: ${vehicle.verificationStatus}`}
            />
          </div>
          <p className="text-sm text-gray-500 mt-0.5 font-mono">
            {vehicle.plateNumber}
          </p>
          {vehicle.vehicleType && (
            <p className="text-xs text-gray-400 mt-0.5">{vehicle.vehicleType}</p>
          )}
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {vehicle.status === "pending" && (
            <>
              <button
                onClick={() => onAction(vehicle.id, "approve")}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => onAction(vehicle.id, "reject")}
                className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
              >
                Reject
              </button>
            </>
          )}
          {vehicle.status === "active" && (
            <button
              onClick={() => onAction(vehicle.id, "suspend")}
              className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
            >
              Suspend
            </button>
          )}
          {vehicle.status === "suspended" && (
            <button
              onClick={() => onAction(vehicle.id, "reactivate")}
              className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Reactivate
            </button>
          )}
          <Link
            href={`/vehicles/${vehicle.id}/overview`}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Full Profile →
          </Link>
        </div>
      </div>

      {/* Stats strip */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Total Trips", value: vehicle.totalTrips.toLocaleString() },
          { label: "Registered", value: vehicle.registeredAt },
          { label: "Last Active", value: vehicle.lastActiveAt ?? "Never" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-1 rounded-lg bg-gray-100 p-1">
        {(["overview", "documents", "driver"] as const).map((t) => (
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
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {tab === "overview" && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Make", value: vehicle.make },
              { label: "Model", value: vehicle.model },
              { label: "Year", value: String(vehicle.year) },
              { label: "Color", value: vehicle.color },
              { label: "Plate Number", value: vehicle.plateNumber },
              { label: "VIN", value: vehicle.vin ?? "—" },
              { label: "Vehicle Type", value: vehicle.vehicleType ?? "—" },
              { label: "Status", value: vehicle.status },
              { label: "Verification", value: vehicle.verificationStatus },
              { label: "Last Active", value: vehicle.lastActiveAt ?? "Never" },
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

        {tab === "documents" && (
          <div className="space-y-2">
            {vehicle.documents.map((doc) => (
              <div
                key={doc.type}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-700">{doc.label}</p>
                    {doc.expiresAt && (
                      <p className="text-xs text-gray-400">Expires {doc.expiresAt}</p>
                    )}
                  </div>
                </div>
                <StatusBadge status={doc.status} />
              </div>
            ))}
          </div>
        )}

        {tab === "driver" && (
          <div>
            {vehicle.driver ? (
              <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                  {vehicle.driver.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {vehicle.driver.name}
                  </p>
                  <p className="text-xs text-gray-500">{vehicle.driver.phone}</p>
                  <p className="text-xs text-gray-500">{vehicle.driver.email}</p>
                </div>
                <Link
                  href={`/drivers/${vehicle.driver.id}/personal`}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  View Driver →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-10 text-center">
                <svg className="h-8 w-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm text-gray-400">No driver assigned</p>
              </div>
            )}
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}