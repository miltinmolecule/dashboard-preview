"use client";

import { useState } from "react";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import AppInput from "@/shared/common/AppInput";
import type { AdminRecord } from "../type/admin-management";

interface Props {
  admin:      AdminRecord;
  isLoading:  boolean;
  onConfirm:  () => void;
  onClose:    () => void;
}

export default function DeactivateModal({
  admin,
  isLoading,
  onConfirm,
  onClose,
}: Props): React.ReactNode {
  const [step,         setStep]         = useState<"warn" | "confirm">("warn");
  const [confirmEmail, setConfirmEmail] = useState("");
  const canConfirm = confirmEmail.trim().toLowerCase() === admin.email.toLowerCase();

  return (
    <ModalWrapper open onClose={onClose} title="Deactivate Admin" size="sm">
      {step === "warn" ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">
              Deactivating{" "}
              <span className="font-bold">{admin.name}</span> will immediately
              revoke their access to this dashboard.
            </p>
          </div>
          <p className="text-sm text-gray-600">
            Role:{" "}
            <span className="font-medium capitalize">
              {admin.role.replace(/_/g, " ")}
            </span>
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setStep("confirm")}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Type <span className="font-mono font-semibold">{admin.email}</span>{" "}
            to confirm deactivation.
          </p>
          <AppInput
            name="confirmEmail"
            placeholder={admin.email}
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setStep("warn")}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={onConfirm}
              disabled={!canConfirm || isLoading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40 transition-colors"
            >
              {isLoading ? "Deactivating…" : "Deactivate Admin"}
            </button>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}
