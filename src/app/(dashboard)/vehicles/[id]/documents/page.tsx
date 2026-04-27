"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { getVehicleById } from "@/modules/vehicles/data/mock";
import StatusBadge from "@/shared/common/StatusBadge";
import { cn } from "@/utils/cn";
import type { VehicleDocument } from "@/modules/vehicles/services/vehicles.service";

export default function VehicleDocumentsPage(): React.ReactNode {
  const { id } = useParams<{ id: string }>();
  const vehicle = getVehicleById(id);

  const [docs, setDocs] = useState<VehicleDocument[]>(vehicle?.documents ?? []);

  if (!vehicle) {
    return <p className="text-sm text-gray-400">Vehicle not found.</p>;
  }

  const updateDoc = (
    type: VehicleDocument["type"],
    status: "approved" | "rejected",
  ) => {
    setDocs((prev) =>
      prev.map((d) => (d.type === type ? { ...d, status } : d)),
    );
    // swap comment for real API call:
    // updateVehicleDocument(id, type, status);
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 space-y-3">
      <h2 className="text-sm font-semibold text-gray-900">Vehicle Documents</h2>
      {docs.map((doc) => (
        <div
          key={doc.type}
          className="flex items-start justify-between rounded-xl border border-gray-100 px-4 py-3 gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
              <svg
                className="h-5 w-5"
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
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{doc.label}</p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <StatusBadge status={doc.status} />
                {doc.uploadedAt && (
                  <span className="text-xs text-gray-400">
                    Uploaded {doc.uploadedAt}
                  </span>
                )}
                {doc.expiresAt && (
                  <span
                    className={cn(
                      "text-xs",
                      doc.status === "expired"
                        ? "text-red-500 font-medium"
                        : "text-gray-400",
                    )}
                  >
                    Expires {doc.expiresAt}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => updateDoc(doc.type, "approved")}
              disabled={doc.status === "approved"}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                doc.status === "approved"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
              )}
            >
              Approve
            </button>
            <button
              onClick={() => updateDoc(doc.type, "rejected")}
              disabled={doc.status === "rejected"}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                doc.status === "rejected"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-100 text-red-700 hover:bg-red-200",
              )}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
