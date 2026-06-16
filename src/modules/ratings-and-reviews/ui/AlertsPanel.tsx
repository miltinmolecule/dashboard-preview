import StatusBadge from "@/shared/common/StatusBadge";
import { formatDate } from "@/utils/format-date";
import { RatingAlert } from "../type/ratings";

function AlertsPanel({
  alerts,
  undismissed_count,
  onDismiss,
}: {
  alerts: RatingAlert[];
  undismissed_count: number;
  onDismiss: (id: string) => void;
}): React.ReactNode {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">
            Low Rating Alerts
          </h2>
          {undismissed_count > 0 && (
            <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
              {undismissed_count}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400">
          Triggered when average drops below threshold
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-gray-400">
          No active alerts
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {[...alerts]
            .sort(
              (a, b) =>
                new Date(b.triggered_at).getTime() -
                new Date(a.triggered_at).getTime(),
            )
            .map((alert) => (
              <div key={alert.id} className="flex items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.ratee_name}
                    </p>
                    <StatusBadge
                      status={alert.ratee_type}
                      label={
                        alert.ratee_type === "driver" ? "Driver" : "Passenger"
                      }
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-gray-400">
                    Avg{" "}
                    <span className="font-semibold text-red-600">
                      {alert.current_average.toFixed(1)}
                    </span>
                    {" · "}Threshold {alert.threshold.toFixed(1)}
                    {" · "}
                    {alert.rating_count} ratings
                    {" · "}Triggered {formatDate(alert.triggered_at)}
                  </p>
                </div>
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="flex-shrink-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default AlertsPanel;