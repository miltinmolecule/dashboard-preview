import StatusBadge from "@/shared/common/StatusBadge";
import ModalWrapper from "@/shared/modals/ModalWrapper";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { Rating } from "../type/ratings";
import FlagModal from "./FlagModal";
import ScoreBadge from "./ScoreBadge";


function RatingDetailModal({
  rating,
  onClose,
  onFlag,
  onRemove,
  onRestore,
  onRespond,
}: {
  rating: Rating;
  onClose: () => void;
  onFlag: (id: string, reason: string) => void;
  onRemove: (id: string) => void;
  onRestore: (id: string) => void;
  onRespond: (id: string, response: string) => void;
}): React.ReactNode {
  const [showFlag, setShowFlag] = useState(false);
  const [note, setNote] = useState(rating.admin_response ?? "");
  const [noteSaved, setNoteSaved] = useState(false);

  const handleSaveNote = (): void => {
    onRespond(rating.id, note);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 3000);
  };

  return (
    <>
      <ModalWrapper open onClose={onClose} title="Review Details" size="md">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-400">Rater</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                {rating.rater.name}
              </p>
              <p className="text-xs text-gray-400">{rating.rater.phone}</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-400 capitalize">
                Ratee ({rating.ratee_type})
              </p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                {rating.ratee.name}
              </p>
              <p className="text-xs text-gray-400">{rating.ratee.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-gray-400">Score</p>
              <div className="mt-1">
                <ScoreBadge score={rating.score} />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400">Status</p>
              <div className="mt-1">
                <StatusBadge status={rating.status} />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400">Ride</p>
              <p className="mt-0.5 font-mono text-sm text-gray-700">
                {rating.ride_id}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400">Submitted</p>
            <p className="mt-0.5 text-sm text-gray-700">
              {new Date(rating.created_at).toLocaleString("en-NG")}
            </p>
          </div>

          {rating.flagged_reason && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
              <p className="text-xs font-medium text-orange-700">Flag reason</p>
              <p className="mt-0.5 text-sm text-orange-800">
                {rating.flagged_reason}
              </p>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">
              Admin note{" "}
              <span className="font-normal text-gray-400">
                (dashboard only — not shown to users)
              </span>
            </label>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value.slice(0, 1000));
                setNoteSaved(false);
              }}
              placeholder="Add an internal note about this rating..."
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="mt-1 flex items-center justify-between">
              <button
                onClick={handleSaveNote}
                disabled={!note.trim()}
                className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                Save Note
              </button>
              <span
                className={cn(
                  "text-xs",
                  noteSaved ? "text-emerald-600" : "text-gray-400",
                )}
              >
                {noteSaved ? "Saved." : `${note.length}/1000`}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
            {rating.status === "active" && (
              <>
                <button
                  onClick={() => setShowFlag(true)}
                  className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-100 transition-colors"
                >
                  Flag
                </button>
                <button
                  onClick={() => {
                    onRemove(rating.id);
                    onClose();
                  }}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                >
                  Remove
                </button>
              </>
            )}
            {rating.status === "flagged" && (
              <>
                <button
                  onClick={() => {
                    onRemove(rating.id);
                    onClose();
                  }}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                >
                  Remove
                </button>
                <button
                  onClick={() => {
                    onRestore(rating.id);
                    onClose();
                  }}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  Restore
                </button>
              </>
            )}
            {rating.status === "removed" && (
              <button
                onClick={() => {
                  onRestore(rating.id);
                  onClose();
                }}
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                Restore
              </button>
            )}
          </div>
        </div>
      </ModalWrapper>

      {showFlag && (
        <FlagModal
          rating={rating}
          onClose={() => setShowFlag(false)}
          onFlag={(id, reason) => {
            onFlag(id, reason);
            onClose();
          }}
        />
      )}
    </>
  );
}


export default RatingDetailModal;