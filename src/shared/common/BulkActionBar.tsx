"use client";

import { cn } from "@/utils/cn";

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  onApprove?: () => void;
  onSuspend?: () => void;
  onExportCsv?: () => void;
  approveLabel?: string;
  suspendLabel?: string;
  className?: string;
}

export default function BulkActionBar({
  selectedCount,
  onClear,
  onApprove,
  onSuspend,
  onExportCsv,
  approveLabel = "Approve Selected",
  suspendLabel = "Suspend Selected",
  className,
}: BulkActionBarProps): React.ReactNode {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5",
        className
      )}
    >
      <div className="flex items-center gap-2 mr-auto">
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-2 text-xs font-bold text-white">
          {selectedCount}
        </span>
        <span className="text-sm font-medium text-blue-900">
          {selectedCount === 1 ? "1 row selected" : `${selectedCount} rows selected`}
        </span>
        <button
          onClick={onClear}
          className="ml-1 text-xs text-blue-600 underline hover:text-blue-800 transition-colors"
        >
          Clear
        </button>
      </div>

      {onApprove && (
        <button
          onClick={onApprove}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {approveLabel}
        </button>
      )}

      {onSuspend && (
        <button
          onClick={onSuspend}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          {suspendLabel}
        </button>
      )}

      {onExportCsv && (
        <button
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      )}
    </div>
  );
}
