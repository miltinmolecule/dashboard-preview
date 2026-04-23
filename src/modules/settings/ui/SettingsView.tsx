"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlatformSettings {
  baseFare: number;
  commissionPercentage: number;
  surgeMultiplier: number;
  maintenanceMode: boolean;
  payoutThreshold: number;
  supportEmail: string;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  baseFare: 500,
  commissionPercentage: 20,
  surgeMultiplier: 1.5,
  maintenanceMode: false,
  payoutThreshold: 5000,
  supportEmail: "support@fleexytrip.com",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 pb-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function NumberField({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  disabled,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
}): React.ReactNode {
  const [error, setError] = useState("");

  const handleChange = (raw: string): void => {
    const n = parseFloat(raw);
    if (isNaN(n)) {
      setError("Must be a valid number");
      return;
    }
    if (min !== undefined && n < min) {
      setError(`Minimum value is ${min}`);
      return;
    }
    if (max !== undefined && n > max) {
      setError(`Maximum value is ${max}`);
      return;
    }
    setError("");
    onChange(n);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-sm text-gray-500 pointer-events-none select-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          defaultValue={value}
          min={min}
          max={max}
          step={step ?? 1}
          disabled={disabled}
          onBlur={(e) => handleChange(e.target.value)}
          className={cn(
            "w-full rounded-lg border border-gray-200 bg-white py-2 text-sm text-gray-900",
            "focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10",
            "disabled:bg-gray-50 disabled:text-gray-400",
            prefix ? "pl-8 pr-3" : "px-3",
            suffix ? "pr-10" : "",
            error && "border-red-400 focus:border-red-400 focus:ring-red-100",
          )}
        />
        {suffix && (
          <span className="absolute right-3 text-sm text-gray-500 pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function TextField({
  label,
  hint,
  value,
  onChange,
  type,
  disabled,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
}): React.ReactNode {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type ?? "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900",
          "focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10",
          "disabled:bg-gray-50 disabled:text-gray-400",
        )}
      />
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function ToggleField({
  label,
  description,
  checked,
  onChange,
  danger,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  danger?: boolean;
}): React.ReactNode {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p
          className={cn(
            "text-sm font-medium",
            danger && checked ? "text-red-700" : "text-gray-900",
          )}
        >
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
          "transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1",
          checked
            ? danger
              ? "bg-red-600 focus:ring-red-500"
              : "bg-[var(--primary)] focus:ring-[var(--primary)]"
            : "bg-gray-200 focus:ring-gray-400",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}

function ConfirmSaveModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}): React.ReactNode {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 mb-4">
          <svg
            className="h-6 w-6 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-900">
          Save platform settings?
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          These changes will affect all users and active trips. This action
          cannot be undone without manually reverting.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-[var(--primary)] py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export default function SettingsView(): React.ReactNode {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [draft, setDraft] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasChanges =
    draft.baseFare !== settings.baseFare ||
    draft.commissionPercentage !== settings.commissionPercentage ||
    draft.surgeMultiplier !== settings.surgeMultiplier ||
    draft.maintenanceMode !== settings.maintenanceMode ||
    draft.payoutThreshold !== settings.payoutThreshold ||
    draft.supportEmail !== settings.supportEmail;

  const handleSave = (): void => {
    setSettings(draft);
    setShowConfirm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDiscard = (): void => {
    setDraft(settings);
  };

  const patch = (partial: Partial<PlatformSettings>): void => {
    setDraft((prev) => ({ ...prev, ...partial }));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Platform Settings</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Configure fare rates, commissions, and system behavior
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Saved
            </span>
          )}
          {hasChanges && (
            <button
              onClick={handleDiscard}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Discard
            </button>
          )}
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!hasChanges}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all",
              hasChanges
                ? "bg-[var(--primary)] hover:opacity-90"
                : "bg-gray-200 text-gray-400 cursor-not-allowed",
            )}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Maintenance mode banner */}
      {draft.maintenanceMode && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <svg
            className="h-5 w-5 shrink-0 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
          <p className="text-sm font-medium text-red-700">
            Maintenance mode is active — users cannot book trips.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Fare & Pricing */}
        <SectionCard
          title="Fare & Pricing"
          description="Base fare rates and surge multiplier configuration"
        >
          <NumberField
            label="Base Fare (₦)"
            hint="Minimum fare charged per trip regardless of distance"
            value={draft.baseFare}
            onChange={(v) => patch({ baseFare: v })}
            prefix="₦"
            min={0}
            step={50}
          />
          <NumberField
            label="Surge Multiplier"
            hint="Applied during peak hours. 1.0 = no surge. Max 5.0"
            value={draft.surgeMultiplier}
            onChange={(v) => patch({ surgeMultiplier: v })}
            suffix="×"
            min={1}
            max={5}
            step={0.1}
          />
        </SectionCard>

        {/* Commission & Payouts */}
        <SectionCard
          title="Commission & Payouts"
          description="Platform commission rate and minimum payout threshold"
        >
          <NumberField
            label="Commission Percentage (%)"
            hint="Percentage of each trip fare retained as platform commission"
            value={draft.commissionPercentage}
            onChange={(v) => patch({ commissionPercentage: v })}
            suffix="%"
            min={0}
            max={50}
            step={1}
          />
          <NumberField
            label="Payout Threshold (₦)"
            hint="Minimum driver wallet balance required before payout can be requested"
            value={draft.payoutThreshold}
            onChange={(v) => patch({ payoutThreshold: v })}
            prefix="₦"
            min={0}
            step={500}
          />
        </SectionCard>

        {/* Support */}
        <SectionCard
          title="Support Contact"
          description="Platform-wide support email shown to users in the app"
        >
          <TextField
            label="Support Email"
            hint="Displayed in the user app's help section"
            value={draft.supportEmail}
            onChange={(v) => patch({ supportEmail: v })}
            type="email"
          />
        </SectionCard>

        {/* System */}
        <SectionCard
          title="System"
          description="Platform-wide operational controls"
        >
          <ToggleField
            label="Maintenance Mode"
            description="Disables new trip bookings and shows a maintenance message to all users. Drivers already on trips are unaffected."
            checked={draft.maintenanceMode}
            onChange={(v) => patch({ maintenanceMode: v })}
            danger
          />
        </SectionCard>
      </div>

      {showConfirm && (
        <ConfirmSaveModal
          onConfirm={handleSave}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
