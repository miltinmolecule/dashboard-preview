"use client";

import { useState } from "react";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import { useAdminPermissions } from "../hooks/useAdmins";
import { useCurrentAdmin } from "../hooks/useCurrentAdmin";
import {
  PERMISSION_LABELS,
  ROLE_LABELS,
  ROLE_STYLES,
  type AdminPermissions,
  type AdminRecord,
} from "../type/admin-management";

function fmtDate(iso?: string): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-NG", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

interface Props {
  admin:              AdminRecord;
  onClose:            () => void;
  onEdit:             (admin: AdminRecord) => void;
  onDeactivate:       (admin: AdminRecord) => void;
  onReactivate:       (id: string) => void;
  onResetPassword:    (admin: AdminRecord) => void;
}

export default function AdminDetailModal({
  admin,
  onClose,
  onEdit,
  onDeactivate,
  onReactivate,
  onResetPassword,
}: Props): React.ReactNode {
  const [activeTab, setActiveTab] = useState<"profile" | "permissions">("profile");
  const { isSelf, isSuperAdmin } = useCurrentAdmin();
  const permHook = useAdminPermissions(admin.id, admin.role);
  const [localPerms, setLocalPerms] = useState<AdminPermissions | null>(null);
  const [saving, setSaving] = useState(false);

  const self = isSelf(admin.email);
  const perms = localPerms ?? permHook.permissions;

  const handlePermToggle = (key: keyof AdminPermissions): void => {
    setLocalPerms({ ...(localPerms ?? permHook.permissions), [key]: !perms[key] });
  };

  const handleSavePerms = async (): Promise<void> => {
    if (!localPerms) return;
    setSaving(true);
    await permHook.update.mutateAsync(localPerms);
    setSaving(false);
    setLocalPerms(null);
  };

  return (
    <ModalWrapper open onClose={onClose} title="Admin Details" size="lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-600">
            {admin.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900">{admin.name}</h3>
              {self && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">You</span>
              )}
            </div>
            <p className="text-sm text-gray-500">{admin.email}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_STYLES[admin.role]}`}>
                {ROLE_LABELS[admin.role]}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  admin.status === "active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {(["profile", "permissions"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-400">Scope</p>
              <p className="mt-0.5 text-sm font-medium capitalize text-gray-800">
                {admin.scope}
                {admin.city_name && (
                  <span className="ml-1 text-gray-500">— {admin.city_name}</span>
                )}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-400">Last login</p>
              <p className="mt-0.5 text-sm font-medium text-gray-800">
                {fmtDate(admin.last_login)}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-400">Created at</p>
              <p className="mt-0.5 text-sm font-medium text-gray-800">
                {fmtDate(admin.created_at)}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-400">Created by</p>
              <p className="mt-0.5 text-sm font-medium text-gray-800">
                {admin.created_by}
              </p>
            </div>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="space-y-3">
            {permHook.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-9 animate-pulse rounded-lg bg-gray-100" />
                ))}
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
                  {(Object.keys(PERMISSION_LABELS) as (keyof AdminPermissions)[]).map((key) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm text-gray-700">{PERMISSION_LABELS[key]}</span>
                      <input
                        type="checkbox"
                        checked={perms[key]}
                        onChange={() => isSuperAdmin && handlePermToggle(key)}
                        disabled={!isSuperAdmin}
                        className="h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)] disabled:opacity-60"
                      />
                    </label>
                  ))}
                </div>
                {isSuperAdmin && localPerms && (
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setLocalPerms(null)}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => void handleSavePerms()}
                      disabled={saving}
                      className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      {saving ? "Saving…" : "Save Permissions"}
                    </button>
                  </div>
                )}
                {!isSuperAdmin && (
                  <p className="text-xs text-gray-400">
                    Only Super Admins can edit permissions.
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
          <button
            onClick={() => { onEdit(admin); onClose(); }}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => { onResetPassword(admin); onClose(); }}
            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
          >
            Reset Password
          </button>
          {!self && (
            admin.status === "active" ? (
              <button
                onClick={() => { onDeactivate(admin); onClose(); }}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
              >
                Deactivate
              </button>
            ) : (
              <button
                onClick={() => { onReactivate(admin.id); onClose(); }}
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                Reactivate
              </button>
            )
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}
