import { cn } from "@/utils/cn";

interface SimplePaginationProps {
  currentPage?: number;
  totalPages?: number;
}

export default function SimplePagination({ currentPage = 1, totalPages = 3 }: SimplePaginationProps): React.ReactNode {
  return (
    <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
      <button
        disabled={currentPage === 1}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          className={cn(
            "h-7 w-7 rounded-lg border text-xs font-medium transition-colors",
            p === currentPage
              ? "bg-[#1e3a4c] text-white border-[#1e3a4c]"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          )}
        >
          {p}
        </button>
      ))}
      {totalPages > 3 && <span className="text-xs text-gray-400">...</span>}
      <button
        disabled={currentPage === totalPages}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
