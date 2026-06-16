"use client";

import ModalWrapper from "@/shared/modals/ModalWrapper";
import {
  ACTION_CATEGORY,
  CATEGORY_STYLES,
  ENTITY_TYPE_STYLES,
  REDACTED_FIELDS,
  type AuditEntry,
} from "../type/audit-log";

function fmtAction(action: string): string {
  return action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtVal(key: string, val: unknown): string {
  if (REDACTED_FIELDS.has(key)) return "[redacted]";
  if (val === null || val === undefined) return "—";
  if (Array.isArray(val)) return val.join(", ");
  if (typeof val === "boolean") return val ? "Yes" : "No";
  return String(val);
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function fieldLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface Props {
  entry:   AuditEntry;
  onClose: () => void;
}

export default function AuditDetailModal({ entry, onClose }: Props): React.ReactNode {
  const category = ACTION_CATEGORY[entry.action];

  return (
    <ModalWrapper open onClose={onClose} title="Audit Entry" size="lg">
      <div className="max-h-[75vh] space-y-4 overflow-y-auto pr-1">
        {/* Action + badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_STYLES[category]}`}>
            {fmtAction(entry.action)}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ENTITY_TYPE_STYLES[entry.entity_type]}`}>
            {entry.entity_type.charAt(0).toUpperCase() + entry.entity_type.slice(1)}
          </span>
          {entry.is_archived && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
              Archived
            </span>
          )}
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-400">Admin</p>
            <p className="mt-0.5 text-sm font-medium text-gray-800">{entry.admin.name}</p>
            <p className="text-xs capitalize text-gray-400">
              {entry.admin.role.replace(/_/g, " ")}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-400">Entity ID</p>
            <p className="mt-0.5 font-mono text-sm text-gray-700">{entry.entity_id}</p>
          </div>
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-400">IP Address</p>
            <p className="mt-0.5 font-mono text-sm text-gray-700">{entry.ip_address}</p>
          </div>
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-400">Timestamp</p>
            <p className="mt-0.5 text-sm text-gray-700">{fmtDate(entry.created_at)}</p>
          </div>
          {entry.city_name && (
            <div className="rounded-lg bg-gray-50 px-4 py-3 col-span-2">
              <p className="text-xs text-gray-400">City</p>
              <p className="mt-0.5 text-sm text-gray-700">
                {entry.city_name}
                <span className="ml-1.5 font-mono text-xs text-gray-400">
                  ({entry.city_id})
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Diff viewer */}
        {entry.is_archived ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
            Detailed diff was archived after 60 days and is no longer available.
          </div>
        ) : entry.diff && Object.keys(entry.diff).length > 0 ? (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Changes
            </p>
            <div className="overflow-hidden rounded-lg border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Field</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-red-500">Before</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-emerald-600">After</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Object.entries(entry.diff).map(([key, { before, after }]) => (
                    <tr key={key} className="bg-white">
                      <td className="px-4 py-2.5 text-xs font-medium text-gray-600">
                        {fieldLabel(key)}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-red-600">
                        {fmtVal(key, before)}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-emerald-700">
                        {fmtVal(key, after)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </ModalWrapper>
  );
}
