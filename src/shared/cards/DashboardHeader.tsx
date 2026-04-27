import type { ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: ReactNode;
  onExportToCsv?: () => void;
}

const DashboardHeader = ({
  title,
  description,
  breadcrumbs,
  onExportToCsv,
}: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900 capitalize">{title}</h1>
        {description && <p className="mt-0.5 text-sm text-gray-500 [&_a]:text-sm [&_a]:text-gray-500">{description}</p>}
        { breadcrumbs && <div className="mt-0.5">{breadcrumbs}</div>}
      </div>
      {onExportToCsv && (
        <button
          onClick={onExportToCsv}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export CSV
        </button>
      )}
    </div>
  );
};

export default DashboardHeader;
