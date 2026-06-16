"use client";

import ModalWrapper from "@/shared/modals/ModalWrapper";

interface Props {
  notificationTitle: string;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CancelModal({
  notificationTitle,
  isLoading,
  onConfirm,
  onClose,
}: Props): React.ReactNode {
  return (
    <ModalWrapper open onClose={onClose} title="Cancel Notification" size="sm">
      <p className="text-sm text-gray-700">
        Cancel{" "}
        <span className="font-semibold">"{notificationTitle}"</span>? This will
        prevent it from being sent.
      </p>
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Keep
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Cancelling…" : "Cancel Notification"}
        </button>
      </div>
    </ModalWrapper>
  );
}
