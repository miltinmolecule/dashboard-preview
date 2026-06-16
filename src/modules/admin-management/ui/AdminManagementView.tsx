"use client";

import { useMemo, useState } from "react";
import SearchInput from "@/shared/forms/SearchInput";
import FilterDropdown from "@/shared/forms/FilterDropdown";
import { cn } from "@/utils/cn";
import { useAdmins, useActivityLog } from "../hooks/useAdmins";
import { ROLE_LABELS, VALID_ROLES, type AdminStatus } from "../type/admin-management";
import AdminForm from "./AdminForm";
import AdminsTable from "./AdminsTable";
import ActivityLogTable from "./ActivityLogTable";

type TabKey = "all" | "active" | "inactive" | "activity";

const TABS: { key: TabKey; label: string; status?: AdminStatus }[] = [
  { key: "all",      label: "All Admins" },
  { key: "active",   label: "Active",    status: "active" },
  { key: "inactive", label: "Inactive",  status: "inactive" },
  { key: "activity", label: "Activity Log" },
];

const ROLE_FILTER_OPTIONS = [
  { label: "All Roles", value: "" },
  ...VALID_ROLES.map((r) => ({ label: ROLE_LABELS[r], value: r })),
];

export default function AdminManagementView(): React.ReactNode {
  const [activeTab,  setActiveTab]  = useState<TabKey>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [search,     setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const currentTabStatus = TABS.find((t) => t.key === activeTab)?.status;
  const hook = useAdmins(currentTabStatus ? { status: currentTabStatus } : {});
  const logHook = useActivityLog();

  const filteredAdmins = useMemo(() => {
    const q = search.toLowerCase();
    return hook.admins.filter((a) => {
      const matchSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.city_name?.toLowerCase() ?? "").includes(q);
      const matchRole = !roleFilter || a.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [hook.admins, search, roleFilter]);

  const stats = useMemo(() => {
    const all     = hook.admins.length;
    const active  = hook.admins.filter((a) => a.status === "active").length;
    const inactive = all - active;
    return { all, active, inactive };
  }, [hook.admins]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Management</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage admin accounts, roles, and permissions
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Admin
        </button>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { label: "Total Admins",    value: stats.all,      color: "text-gray-900",    bg: "bg-gray-50" },
          { label: "Active",          value: stats.active,   color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Inactive",        value: stats.inactive, color: "text-gray-500",    bg: "bg-gray-50" },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border border-gray-100 px-5 py-4 shadow-sm ${s.bg}`}
          >
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="mt-5 rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-0.5 overflow-x-auto border-b border-gray-100 px-5 pt-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "whitespace-nowrap rounded-t px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab !== "activity" ? (
            <>
              {/* Toolbar */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search by name, email, or city…"
                  className="w-72"
                />
                <FilterDropdown
                  options={ROLE_FILTER_OPTIONS}
                  value={roleFilter}
                  onChange={setRoleFilter}
                  placeholder="All Roles"
                />
                {(search || roleFilter) && (
                  <button
                    onClick={() => { setSearch(""); setRoleFilter(""); }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Clear
                  </button>
                )}
                <span className="ml-auto text-xs text-gray-400">
                  {filteredAdmins.length} results
                </span>
              </div>

              <AdminsTable
                data={filteredAdmins}
                loading={hook.isLoading}
                isDeactivating={hook.deactivate.isPending}
                isResettingPwd={hook.resetPassword.isPending}
                isUpdating={hook.update.isPending}
                onDeactivate={(id) => hook.deactivate.mutate(id)}
                onReactivate={(id) => hook.reactivate.mutate(id)}
                onResetPassword={(id) => hook.resetPassword.mutate(id)}
                onUpdate={async (id, dto) => {
                  await hook.update.mutateAsync({ id, body: dto });
                }}
              />
            </>
          ) : (
            <ActivityLogTable
              logs={logHook.logs}
              loading={logHook.isLoading}
            />
          )}
        </div>
      </div>

      {showCreate && (
        <AdminForm
          mode="create"
          isSubmitting={hook.create.isPending}
          onClose={() => setShowCreate(false)}
          onSubmit={async (dto) => {
            await hook.create.mutateAsync(dto);
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}
