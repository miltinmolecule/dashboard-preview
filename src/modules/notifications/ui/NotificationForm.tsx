"use client";

import { useState } from "react";
import AppInput from "@/shared/common/AppInput";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import { cn } from "@/utils/cn";
import type { NotificationChannel, NotificationPayload, NotificationTarget } from "../type/notifications";
import { VALID_CHANNELS } from "../type/notifications";

const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  push:   "Push Notification",
  sms:    "SMS",
  email:  "Email",
  in_app: "In-App",
};

const TARGET_OPTIONS: { value: NotificationTarget; label: string }[] = [
  { value: "all_users",      label: "All Users" },
  { value: "all_drivers",    label: "All Drivers" },
  { value: "all_passengers", label: "All Passengers" },
  { value: "city",           label: "City" },
  { value: "individual",     label: "Individual User" },
];

const BULK_TARGETS: NotificationTarget[] = ["all_drivers", "all_passengers", "all_users"];

interface Props {
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: NotificationPayload) => Promise<void>;
}

export default function NotificationForm({
  isSubmitting,
  onClose,
  onSubmit,
}: Props): React.ReactNode {
  const [title,       setTitle]       = useState("");
  const [body,        setBody]        = useState("");
  const [channels,    setChannels]    = useState<NotificationChannel[]>(["push"]);
  const [target,      setTarget]      = useState<NotificationTarget>("all_users");
  const [targetId,    setTargetId]    = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [errors,      setErrors]      = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleChannel = (ch: NotificationChannel): void => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch],
    );
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim())         errs.title    = "Title is required";
    if (title.length > 100)    errs.title    = "Max 100 characters";
    if (!body.trim())          errs.body     = "Body is required";
    if (body.length > 500)     errs.body     = "Max 500 characters";
    if (!channels.length)      errs.channels = "Select at least one channel";
    if ((target === "individual" || target === "city") && !targetId.trim())
      errs.targetId = `${target === "city" ? "City ID" : "User ID"} is required`;
    if (scheduledAt && new Date(scheduledAt) <= new Date())
      errs.scheduledAt = "Scheduled time must be in the future";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (): void => {
    if (!validate()) return;
    if (BULK_TARGETS.includes(target)) { setShowConfirm(true); return; }
    void doSubmit();
  };

  const doSubmit = async (): Promise<void> => {
    setShowConfirm(false);
    await onSubmit({
      title:    title.trim().slice(0, 100),
      body:     body.trim().slice(0, 500),
      channels,
      target,
      ...(targetId.trim() && { target_id:    targetId.trim() }),
      ...(scheduledAt     && { scheduled_at: scheduledAt }),
    });
  };

  const targetLabel = TARGET_OPTIONS.find((t) => t.value === target)?.label ?? target;
  const needsConsent = channels.includes("sms") || channels.includes("email");

  return (
    <>
      <ModalWrapper open onClose={onClose} title="Send Notification" size="lg">
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Title */}
          <div>
            <AppInput
              label="Title"
              name="title"
              placeholder="Notification title (max 100 chars)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              errors={errors.title}
            />
            <p
              className={cn(
                "mt-0.5 text-right text-xs",
                title.length > 90 ? "text-orange-500" : "text-gray-400",
              )}
            >
              {title.length}/100
            </p>
          </div>

          {/* Body */}
          <div>
            <AppInput
              label="Message body"
              name="body"
              inputRender="textarea"
              rows={3}
              placeholder="Notification message (max 500 chars)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              errors={errors.body}
            />
            <p
              className={cn(
                "mt-0.5 text-right text-xs",
                body.length > 450 ? "text-orange-500" : "text-gray-400",
              )}
            >
              {body.length}/500
            </p>
          </div>

          {/* Channels */}
          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-700">Channels</p>
            <div className="flex flex-wrap gap-2">
              {VALID_CHANNELS.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => toggleChannel(ch)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    channels.includes(ch)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
                  )}
                >
                  {CHANNEL_LABELS[ch]}
                </button>
              ))}
            </div>
            {errors.channels && (
              <p className="mt-1 text-xs text-red-500">{errors.channels}</p>
            )}
            {needsConsent && (
              <p className="mt-1.5 text-xs text-amber-600">
                ⚠ SMS and Email are only sent to users with marketing consent
                (NDPR / GDPR).
              </p>
            )}
          </div>

          {/* Target */}
          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-700">
              Target audience
            </p>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value as NotificationTarget)}
              className="w-full rounded-lg border border-gray-200 bg-[#F8FAFC] px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              {TARGET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Target ID */}
          {(target === "individual" || target === "city") && (
            <AppInput
              label={target === "city" ? "City ID" : "User ID"}
              name="targetId"
              placeholder={
                target === "city" ? "e.g. city-lagos-001" : "User UUID"
              }
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              errors={errors.targetId}
            />
          )}

          {/* Schedule */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Schedule{" "}
              <span className="font-normal text-gray-400">
                (optional — leave blank to send immediately)
              </span>
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-[#F8FAFC] px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            {errors.scheduledAt && (
              <p className="mt-1 text-xs text-red-500">{errors.scheduledAt}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isSubmitting ? "Sending…" : scheduledAt ? "Schedule" : "Send Now"}
            </button>
          </div>
        </div>
      </ModalWrapper>

      {/* Bulk confirm */}
      {showConfirm && (
        <ModalWrapper
          open
          onClose={() => setShowConfirm(false)}
          title="Confirm Bulk Send"
          size="sm"
        >
          <p className="text-sm text-gray-700">
            This will notify{" "}
            <span className="font-semibold">{targetLabel}</span>. This action
            cannot be undone.
          </p>
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Go back
            </button>
            <button
              onClick={() => void doSubmit()}
              disabled={isSubmitting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Sending…" : "Confirm Send"}
            </button>
          </div>
        </ModalWrapper>
      )}
    </>
  );
}
