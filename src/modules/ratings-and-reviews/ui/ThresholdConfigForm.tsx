"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/utils/format-date";
import { ThresholdConfig, ThresholdForm } from "../type/ratings";
import AppInput from "@/shared/common/AppInput";

function ThresholdConfigForm({
  thresholds,
  isLoading = false,
  onSave,
}: {
  thresholds: ThresholdConfig[];
  isLoading?: boolean;
  onSave: (id: string, body: Partial<ThresholdConfig>) => void;
}): React.ReactNode {
  const [forms, setForms] = useState<Record<string, ThresholdForm>>({});
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    if (thresholds.length === 0) return;
    setForms(
      Object.fromEntries(
        thresholds.map((t) => [
          t.id,
          {
            ratee_type: t.ratee_type,
            threshold: t.threshold,
            min_ratings: t.min_ratings,
            notify_email: t.notify_email,
            notify_dashboard: t.notify_dashboard,
          },
        ]),
      ),
    );
  }, [thresholds]);

  const setField = <K extends keyof ThresholdForm>(
    id: string,
    key: K,
    value: ThresholdForm[K],
  ): void => {
    setForms((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
    setSavedId(null);
  };

  const handleSave = (id: string): void => {
    const f = forms[id];
    if (!f || (!f.notify_email && !f.notify_dashboard)) return;
    onSave(id, f);
    setSavedId(id);
    setTimeout(() => setSavedId(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[0, 1].map((i) => (
          <div key={i} className="h-52 animate-pulse rounded-xl border border-gray-100 bg-gray-50" />
        ))}
      </div>
    );
  }

  if (thresholds.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">No threshold configurations found.</p>
    );
  }

  return (
    <div className="space-y-4">
      {thresholds.map((threshold) => {
        const f = forms[threshold.id];
        if (!f) return null;
        const notifyError = !f.notify_email && !f.notify_dashboard;

        return (
          <div
            key={threshold.id}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <h3 className="text-sm font-semibold capitalize text-gray-900">
                {threshold.ratee_type} Thresholds
              </h3>
              <span className="text-xs text-gray-400">
                Last updated {formatDate(threshold.updated_at)}
              </span>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Alert threshold (1.0 – 5.0)
                </label>
                <input
                  type="number"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={f.threshold}
                  onChange={(e) =>
                    setField(
                      threshold.id,
                      "threshold",
                      parseFloat(e.target.value),
                    )
                  }
                  className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Alert fires when average drops below this
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Min ratings required
                </label>
                <AppInput
                  type="number"
                  min="1"
                  value={f.min_ratings}
                  onChange={(e) =>
                    setField(
                      threshold.id,
                      "min_ratings",
                      parseInt(e.target.value, 10),
                    )
                  }
                  className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Minimum ratings before alert can trigger
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-xs font-medium text-gray-700">
                Notification methods
              </label>
              <div className="flex gap-5">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={f.notify_email}
                    onChange={(e) =>
                      setField(threshold.id, "notify_email", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 accent-blue-600"
                  />
                  Email
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={f.notify_dashboard}
                    onChange={(e) =>
                      setField(
                        threshold.id,
                        "notify_dashboard",
                        e.target.checked,
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 accent-blue-600"
                  />
                  Dashboard
                </label>
              </div>
              {notifyError && (
                <p className="mt-1.5 text-xs text-red-500">
                  At least one notification method required
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSave(threshold.id)}
                disabled={notifyError}
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                Save Changes
              </button>
              {savedId === threshold.id && (
                <span className="text-xs text-emerald-600">
                  Threshold updated.
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}


export default ThresholdConfigForm;