"use client";

import DataTable from "@/shared/common/DataTable";
import StatusBadge from "@/shared/common/StatusBadge";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import SearchInput from "@/shared/forms/SearchInput";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/format-date";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Rating, RatingStatus } from "../type/ratings";
import FlagModal from "./FlagModal";
import RatingDetailModal from "./RatingDetailModal";
import ScoreBadge from "./ScoreBadge";


const STATUS_FILTER_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Flagged", value: "flagged" },
  { label: "Removed", value: "removed" },
];

const SCORE_FILTER_OPTIONS = [
  { label: "★★★★★  5", value: "5" },
  { label: "★★★★  4", value: "4" },
  { label: "★★★  3", value: "3" },
  { label: "★★  2", value: "2" },
  { label: "★  1", value: "1" },
];

function RatingsTablePanel({
  data,
  loading = false,
  onFlag,
  onRemove,
  onRestore,
  onRespond,
}: {
  data: Rating[];
  loading?: boolean;
  onFlag: (id: string, reason: string) => void;
  onRemove: (id: string) => void;
  onRestore: (id: string) => void;
  onRespond: (id: string, response: string) => void;
}): React.ReactNode {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");
  const [detail, setDetail] = useState<Rating | null>(null);
  const [flagging, setFlagging] = useState<Rating | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((r) => {
      const matchSearch =
        !q ||
        r.rater.name.toLowerCase().includes(q) ||
        r.ratee.name.toLowerCase().includes(q) ||
        r.booking_id.toLowerCase().includes(q);
      const matchStatus = !statusFilter || r.status === statusFilter;
      const matchScore = !scoreFilter || String(r.score) === scoreFilter;
      return matchSearch && matchStatus && matchScore;
    });
  }, [data, search, statusFilter, scoreFilter]);

  const stats = useMemo(() => {
    let scoreSum = 0,
      scoreCount = 0,
      flagged = 0,
      removed = 0;
    for (const r of data) {
      if (r.status !== "removed") {
        scoreSum += r.score;
        scoreCount++;
      }
      if (r.status === "flagged") flagged++;
      if (r.status === "removed") removed++;
    }
    return {
      average: scoreCount > 0 ? scoreSum / scoreCount : 0,
      total: data.length,
      flagged,
      removed,
    };
  }, [data]);

  const columns: ColumnDef<Rating, unknown>[] = [
    {
      id: "rater",
      header: "Rater",
      accessorKey: "rater",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {row.original.rater.name}
          </p>
          <p className="text-xs text-gray-400">{row.original.rater.phone}</p>
        </div>
      ),
    },
    {
      id: "ratee",
      header: "Ratee",
      accessorKey: "ratee",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {row.original.ratee.name}
          </p>
          <p className="font-mono text-xs text-gray-400">
            {row.original.booking_id}
          </p>
        </div>
      ),
    },
    {
      id: "score",
      header: "Score",
      accessorKey: "score",
      cell: ({ getValue }) => <ScoreBadge score={getValue() as number} />,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => (
        <StatusBadge status={getValue() as RatingStatus} />
      ),
    },
    {
      id: "created_at",
      header: "Date",
      accessorKey: "created_at",
      cell: ({ getValue }) => (
        <span className="text-xs text-gray-500">
          {formatDate(getValue() as string)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const r = row.original;
        return (
          <div className="flex items-center gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDetail(r);
              }}
              title="View details"
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
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
            </button>
            {r.status === "active" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFlagging(r);
                }}
                title="Flag review"
                className="rounded p-1.5 text-gray-400 hover:bg-orange-50 hover:text-orange-600 transition-colors"
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
                    d="M3 21V5a2 2 0 012-2h14l-4 4H5v12"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 21l18-8"
                  />
                </svg>
              </button>
            )}
            {(r.status === "flagged" || r.status === "removed") && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(r.id);
                }}
                title="Restore review"
                className="rounded p-1.5 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
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
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "Average Rating",
            value: stats.average > 0 ? `${stats.average.toFixed(1)} ★` : "—",
            color: "text-amber-700",
            bg: "bg-amber-50",
          },
          {
            label: "Total Reviews",
            value: stats.total,
            color: "text-gray-900",
            bg: "bg-gray-50",
          },
          {
            label: "Flagged",
            value: stats.flagged,
            color: "text-orange-700",
            bg: "bg-orange-50",
          },
          {
            label: "Removed",
            value: stats.removed,
            color: "text-red-700",
            bg: "bg-red-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={cn(
              "rounded-xl border border-gray-100 px-4 py-3 shadow-sm",
              s.bg,
            )}
          >
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={cn("mt-1 text-xl font-bold", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name or booking ID..."
          className="w-72"
        />
        <FilterDropdown
          options={STATUS_FILTER_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Status"
        />
        <FilterDropdown
          options={SCORE_FILTER_OPTIONS}
          value={scoreFilter}
          onChange={setScoreFilter}
          placeholder="Score"
        />
        {(search || statusFilter || scoreFilter) && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
              setScoreFilter("");
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

      {/* Table */}
      <DataTable<Rating>
        data={filtered}
        columns={columns}
        loading={loading}
        pageSize={10}
      />

      {/* Modals */}
      {detail && (
        <RatingDetailModal
          rating={detail}
          onClose={() => setDetail(null)}
          onFlag={(id, reason) => {
            onFlag(id, reason);
            setDetail(null);
          }}
          onRemove={(id) => {
            onRemove(id);
            setDetail(null);
          }}
          onRestore={(id) => {
            onRestore(id);
            setDetail(null);
          }}
          onRespond={onRespond}
        />
      )}
      {flagging && (
        <FlagModal
          rating={flagging}
          onClose={() => setFlagging(null)}
          onFlag={(id, reason) => {
            onFlag(id, reason);
            setFlagging(null);
          }}
        />
      )}
    </div>
  );
}

export default RatingsTablePanel;