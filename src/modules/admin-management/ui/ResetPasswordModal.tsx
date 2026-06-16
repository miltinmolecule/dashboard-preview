"use client";

import ModalWrapper from "@/shared/modals/ModalWrapper";
import type { AdminRecord } from "../type/admin-management";

interface Props {
  admin:     AdminRecord;
  isLoading: boolean;
  onConfirm: () => void;
  onClose:   () => void;
}

export default function ResetPasswordModal({
  admin,
  isLoading,
  onConfirm,
  onClose,
}: Props): React.ReactNode {
  return (
    <ModalWrapper open onClose={onClose} title="Reset Password" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          A password reset link will be sent to{" "}
          <span className="font-semibold">{admin.email}</span>.
        </p>
        <p className="text-xs text-gray-500">
          The admin will be required to set a new password on their next login.
          Active sessions are not affected.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? "Sending…" : "Send Reset Link"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
