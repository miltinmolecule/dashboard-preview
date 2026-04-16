"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import type { BaseProfile } from "./types";
import CardWrapper from "../cards/CardWrapper";

type VerStatus = "pending" | "verified" | "rejected";

export default function VerificationContent({ profile }: { profile: BaseProfile }): React.ReactNode {
  const [status, setStatus] = useState<VerStatus>(profile.verificationStatus);

  return (
    <CardWrapper>
      <h2 className="text-base font-semibold text-gray-900 mb-5">Verification Info</h2>

      <div className="space-y-3 mb-7">
        {[
          { label: "Submission date:", value: status.charAt(0).toUpperCase() + status.slice(1) },
          { label: "Submission date:", value: profile.verificationDate },
          { label: "Reviewed by:", value: profile.reviewedBy },
          { label: "Last reviewed date:", value: profile.verificationDate },
          { label: "Reason for rejection:", value: profile.rejectionReason ?? "—" },
        ].map(({ label, value }, i) => (
          <div key={i} className="flex items-start gap-6">
            <span className="w-44 shrink-0 text-sm text-gray-400">{label}</span>
            <span className="text-sm font-medium text-gray-900">{value}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-8 mb-7">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Image Comparison</h3>
          <div className="flex gap-4">
            {["Device Image", "NIN Image"].map((label) => (
              <div key={label} className="flex-1">
                <div className="aspect-square rounded-xl bg-gray-100 border border-dashed border-gray-200 flex items-center justify-center">
                  <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xs text-center text-gray-500 mt-1.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">License Information</h3>
          <div className="space-y-2.5 mb-4">
            {[
              { label: "License number:", value: profile.licenseNumber },
              { label: "Expiry date:", value: profile.licenseExpiry },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="w-32 shrink-0 text-sm text-gray-400">{label}</span>
                <span className="text-sm font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mb-2">Attached driver&apos;s license</p>
          <div className="h-20 w-28 rounded-lg bg-gray-100 border border-dashed border-gray-200 flex items-center justify-center">
            <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-5 border-t border-gray-100">
        {(["pending", "resubmission", "verified", "rejected", "accept"] as const).map((btn) => {
          const label = btn === "resubmission" ? "Request Resubmission" : btn.charAt(0).toUpperCase() + btn.slice(1);
          const isRejectedActive = btn === "rejected" && status === "rejected";
          const isAcceptActive = btn === "accept" && status === "verified";
          return (
            <button
              key={btn}
              onClick={() => {
                if (btn === "verified" || btn === "accept") setStatus("verified");
                else if (btn === "rejected") setStatus("rejected");
                else if (btn === "pending") setStatus("pending");
              }}
              className={cn(
                "rounded-lg px-4 py-2 text-xs font-medium border transition-colors",
                isRejectedActive ? "bg-red-500 text-white border-red-500" :
                isAcceptActive ? "bg-emerald-500 text-white border-emerald-500" :
                "border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </CardWrapper>
  );
}
