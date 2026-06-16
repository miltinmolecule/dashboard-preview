import ModalWrapper from "@/shared/modals/ModalWrapper";
import { useState } from "react";
import { Rating } from "../type/ratings";

function FlagModal({
  rating,
  onClose,
  onFlag,
}: {
  rating: Rating;
  onClose: () => void;
  onFlag: (id: string, reason: string) => void;
}): React.ReactNode {
  const [step, setStep] = useState<"input" | "confirm">("input");
  const [reason, setReason] = useState("");

  return (
    <ModalWrapper open onClose={onClose} title="Flag Review" size="sm">
      {step === "input" ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Flag the review by <span className="font-medium text-gray-900">{rating.rater.name}</span> for admin attention.
          </p>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 500))}
              placeholder="Describe why this review is being flagged..."
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="mt-1 text-right text-xs text-gray-400">{reason.length}/500</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!reason.trim()}
              onClick={() => setStep("confirm")}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-medium text-orange-800">Confirm flag</p>
            <p className="mt-1 text-xs text-orange-600">This marks the review as flagged. You can restore it later if needed.</p>
          </div>
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-500">Reason</p>
            <p className="mt-0.5 text-sm text-gray-800">{reason}</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setStep("input")}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => { onFlag(rating.id, reason); onClose(); }}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              Confirm Flag
            </button>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}

export default FlagModal;