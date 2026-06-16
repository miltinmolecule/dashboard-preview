"use client";

import type { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/shared/common/DataTable";
import {
  ACTION_CATEGORY,
  CATEGORY_STYLES,
  ENTITY_TYPE_STYLES,
  type AuditEntry,
} from "../type/audit-log";

function fmtAction(action: string): string {
  return action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function truncate(s: string, n = 16): string {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

interface Props {
  entries:    AuditEntry[];
  loading?:   boolean;
  onView:     (entry: AuditEntry) => void;
}

export default function AuditLogTable({
  entries,
  loading = false,
  onView,
}: Props): React.ReactNode {
  const columns: ColumnDef<AuditEntry, unknown>[] = [
    {
      id:     "action",
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => {
        const category = ACTION_CATEGORY[row.original.action];
        return (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${CATEGORY_STYLES[category]}`}>
              {fmtAction(row.original.action)}
            </span>
            {row.original.is_archived && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                Archived
              </span>
            )}
          </div>
        );
      },
    },
    {
      id:     "admin",
      header: "Admin",
      cell:   ({ row }) => (
        <div>
          <p className="text-sm font-medium text-gray-800">{row.original.admin.name}</p>
          <p className="text-xs capitalize text-gray-400">
            {row.original.admin.role.replace(/_/g, " ")}
          </p>
        </div>
      ),
    },
    {
      id:     "entity",
      header: "Entity",
      cell:   ({ row }) => (
        <div className="flex flex-col gap-1">
          <span
            className={`w-fit rounded-full px-2 py-0.5 text-xs font-semibold ${ENTITY_TYPE_STYLES[row.original.entity_type]}`}
          >
            {row.original.entity_type.charAt(0).toUpperCase() + row.original.entity_type.slice(1)}
          </span>
          <span className="font-mono text-xs text-gray-400" title={row.original.entity_id}>
            {truncate(row.original.entity_id)}
          </span>
        </div>
      ),
    },
    {
      id:     "city",
      header: "City",
      cell:   ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.original.city_name ?? "—"}
        </span>
      ),
    },
    {
      id:     "ip",
      header: "IP",
      cell:   ({ row }) => (
        <span className="font-mono text-xs text-gray-500">{row.original.ip_address}</span>
      ),
    },
    {
      id:          "created_at",
      header:      "Date",
      accessorKey: "created_at",
      cell:        ({ row }) => (
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {fmtDate(row.original.created_at)}
        </span>
      ),
    },
    {
      id:     "actions",
      header: "",
      size:   60,
      cell:   ({ row }) => (
        <button
          onClick={() => onView(row.original)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <DataTable<AuditEntry>
      data={entries}
      columns={columns}
      loading={loading}
      pageSize={20}
    />
  );
}
