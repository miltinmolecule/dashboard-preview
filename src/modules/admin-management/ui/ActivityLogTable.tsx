"use client";

import DataTable from "@/shared/common/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import type { ActivityLog } from "../type/admin-management";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

interface Props {
  logs:      ActivityLog[];
  loading?:  boolean;
}

export default function ActivityLogTable({ logs, loading = false }: Props): React.ReactNode {
  const columns: ColumnDef<ActivityLog, unknown>[] = [
    {
      id:     "admin",
      header: "Admin",
      cell:   ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {row.original.admin_name}
        </span>
      ),
    },
    {
      id:     "action",
      header: "Action",
      cell:   ({ row }) => (
        <span className="text-sm text-gray-700">{row.original.action}</span>
      ),
    },
    {
      id:     "entity",
      header: "Entity",
      cell:   ({ row }) => (
        <div>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600 capitalize">
            {row.original.entity_type}
          </span>
          <span className="ml-1 font-mono text-xs text-gray-400">
            {row.original.entity_id}
          </span>
        </div>
      ),
    },
    {
      id:     "ip",
      header: "IP Address",
      cell:   ({ row }) => (
        <span className="font-mono text-xs text-gray-500">
          {row.original.ip_address}
        </span>
      ),
    },
    {
      id:     "date",
      header: "Date",
      cell:   ({ row }) => (
        <span className="text-xs text-gray-500">
          {fmtDate(row.original.created_at)}
        </span>
      ),
    },
  ];

  return (
    <DataTable<ActivityLog>
      data={logs}
      columns={columns}
      loading={loading}
      pageSize={10}
    />
  );
}
