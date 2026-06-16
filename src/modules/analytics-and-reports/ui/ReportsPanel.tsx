"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/format-date";
import { useReports } from "../hooks/useAnalytics";
import type { AnalyticsFilters, ReportFormat, ReportMeta, ReportStatus, ReportType } from "../type/analytics";

const REPORT_TYPES: { label: string; value: ReportType }[] = [
  { label: "Rides",      value: "rides" },
  { label: "Revenue",    value: "revenue" },
  { label: "Drivers",    value: "drivers" },
  { label: "Passengers", value: "passengers" },
  { label: "Surge",      value: "surge" },
];

const STATUS_BADGE: Record<ReportStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  ready:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed:  "bg-red-50 text-red-700 border-red-200",
};

interface Props { filters: AnalyticsFilters }

export default function ReportsPanel({ filters }: Props): React.ReactNode {
  const { reports, isLoading, request } = useReports();
  const [selectedType, setSelectedType] = useState<ReportType>("rides");
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>("csv");
  const [complianceAcked, setComplianceAcked] = useState(false);
  const [showComplianceNotice, setShowComplianceNotice] = useState(false);
  const [pendingDownloadUrl, setPendingDownloadUrl] = useState<string | null>(null);

  const handleRequestReport = (): void => {
    request.mutate({ type: selectedType, format: selectedFormat, filters });
  };

  const handleDownload = (report: ReportMeta): void => {
    if (!report.download_url) return;
    if (!complianceAcked) {
      setPendingDownloadUrl(report.download_url);
      setShowComplianceNotice(true);
      return;
    }
    window.open(report.download_url, "_blank", "noopener,noreferrer");
  };

  const confirmDownload = (): void => {
    setComplianceAcked(true);
    setShowComplianceNotice(false);
    if (pendingDownloadUrl) {
      window.open(pendingDownloadUrl, "_blank", "noopener,noreferrer");
      setPendingDownloadUrl(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Request a new report */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Request a Report</h3>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Report Type</label>
            <div className="flex gap-1.5 flex-wrap">
              {REPORT_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                    selectedType === t.value
                      ? "border-blue-400 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Format</label>
            <div className="flex gap-1.5">
              {(["csv", "pdf"] as ReportFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFormat(f)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium uppercase transition-all",
                    selectedFormat === f
                      ? "border-blue-400 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRequestReport}
            disabled={request.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {request.isPending ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Requesting…
              </>
            ) : "Generate Report"}
          </button>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Report will use the current filter range: <strong>{filters.from}</strong> — <strong>{filters.to}</strong>
        </p>
      </div>

      {/* Report list */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Generated Reports</h3>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">No reports generated yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-2 text-left text-xs font-medium text-gray-400">Type</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-400">Format</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-400">Status</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-400">Created</th>
                  <th className="pb-2 text-right text-xs font-medium text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 font-medium capitalize text-gray-900">{report.type}</td>
                    <td className="py-3 uppercase text-gray-500">{report.format}</td>
                    <td className="py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                        STATUS_BADGE[report.status],
                      )}>
                        {report.status === "pending" && (
                          <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        )}
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-gray-500">{formatDate(report.created_at)}</td>
                    <td className="py-3 text-right">
                      {report.status === "ready" && report.download_url ? (
                        <button
                          onClick={() => handleDownload(report)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Download
                        </button>
                      ) : report.status === "failed" ? (
                        <button
                          onClick={handleRequestReport}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Retry
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compliance notice modal */}
      {showComplianceNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h4 className="text-sm font-semibold text-gray-900">Data Policy Notice</h4>
            <p className="mt-2 text-sm text-gray-600">
              This file may contain personal data. Handle in accordance with your organisation&apos;s data policy and applicable regulations (NDPR / GDPR).
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => { setShowComplianceNotice(false); setPendingDownloadUrl(null); }}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDownload}
                className="flex-1 rounded-lg bg-[var(--primary)] py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Understood — Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
