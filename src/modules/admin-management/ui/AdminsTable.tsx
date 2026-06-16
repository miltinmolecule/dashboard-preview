"use client";

import DataTable from "@/shared/common/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { ROLE_LABELS, ROLE_STYLES, type AdminRecord, type AdminStatus } from "../type/admin-management";
import { useCurrentAdmin } from "../hooks/useCurrentAdmin";
import AdminDetailModal from "./AdminDetailModal";
import AdminForm from "./AdminForm";
import DeactivateModal from "./DeactivateModal";
import ResetPasswordModal from "./ResetPasswordModal";
import type { UpdateAdminDto } from "../type/admin-management";

function fmtLastLogin(iso?: string): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

interface Props {
  data:              AdminRecord[];
  loading?:          boolean;
  onDeactivate:      (id: string) => void;
  onReactivate:      (id: string) => void;
  onResetPassword:   (id: string) => void;
  onUpdate:          (id: string, dto: UpdateAdminDto) => Promise<void>;
  isDeactivating:    boolean;
  isResettingPwd:    boolean;
  isUpdating:        boolean;
}

export default function AdminsTable({
  data,
  loading = false,
  onDeactivate,
  onReactivate,
  onResetPassword,
  onUpdate,
  isDeactivating,
  isResettingPwd,
  isUpdating,
}: Props): React.ReactNode {
  const { isSelf } = useCurrentAdmin();
  const [detail,      setDetail]      = useState<AdminRecord | null>(null);
  const [editing,     setEditing]     = useState<AdminRecord | null>(null);
  const [deactivating, setDeactivating] = useState<AdminRecord | null>(null);
  const [resetting,   setResetting]   = useState<AdminRecord | null>(null);

  const columns: ColumnDef<AdminRecord, unknown>[] = [
    {
      id:     "name",
      header: "Admin",
      cell:   ({ row }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.original.name}</p>
          <p className="text-xs text-gray-400">{row.original.email}</p>
        </div>
      ),
    },
    {
      id:     "role",
      header: "Role",
      cell:   ({ row }) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_STYLES[row.original.role]}`}>
          {ROLE_LABELS[row.original.role]}
        </span>
      ),
    },
    {
      id:     "scope",
      header: "Scope",
      cell:   ({ row }) => (
        <div>
          <span className="text-xs capitalize text-gray-700">{row.original.scope}</span>
          {row.original.city_name && (
            <span className="ml-1 text-xs text-gray-400">— {row.original.city_name}</span>
          )}
        </div>
      ),
    },
    {
      id:     "status",
      header: "Status",
      cell:   ({ row }) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            row.original.status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {row.original.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id:     "last_login",
      header: "Last Login",
      cell:   ({ row }) => (
        <span className="text-xs text-gray-500">
          {fmtLastLogin(row.original.last_login)}
        </span>
      ),
    },
    {
      id:             "actions",
      header:         "",
      enableSorting:  false,
      cell:           ({ row }) => {
        const a = row.original;
        const self = isSelf(a.email);
        return (
          <div className="flex items-center gap-0.5">
            <button
              onClick={(e) => { e.stopPropagation(); setDetail(a); }}
              title="View details"
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setEditing(a); }}
              title="Edit admin"
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            {!self && (
              a.status === "active" ? (
                <button
                  onClick={(e) => { e.stopPropagation(); setDeactivating(a); }}
                  title="Deactivate"
                  className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); onReactivate(a.id); }}
                  title="Reactivate"
                  className="rounded p-1.5 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              )
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable<AdminRecord>
        data={data}
        columns={columns}
        loading={loading}
        pageSize={10}
      />

      {detail && (
        <AdminDetailModal
          admin={detail}
          onClose={() => setDetail(null)}
          onEdit={(a) => { setDetail(null); setEditing(a); }}
          onDeactivate={(a) => { setDetail(null); setDeactivating(a); }}
          onReactivate={(id) => { onReactivate(id); setDetail(null); }}
          onResetPassword={(a) => { setDetail(null); setResetting(a); }}
        />
      )}

      {editing && (
        <AdminForm
          mode="edit"
          admin={editing}
          isSubmitting={isUpdating}
          onClose={() => setEditing(null)}
          onSubmit={async (dto) => {
            await onUpdate(editing.id, dto);
            setEditing(null);
          }}
        />
      )}

      {deactivating && (
        <DeactivateModal
          admin={deactivating}
          isLoading={isDeactivating}
          onConfirm={() => { onDeactivate(deactivating.id); setDeactivating(null); }}
          onClose={() => setDeactivating(null)}
        />
      )}

      {resetting && (
        <ResetPasswordModal
          admin={resetting}
          isLoading={isResettingPwd}
          onConfirm={() => { onResetPassword(resetting.id); setResetting(null); }}
          onClose={() => setResetting(null)}
        />
      )}
    </>
  );
}
