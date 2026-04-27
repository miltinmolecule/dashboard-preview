import { getVehicleById, getDriverHistoryByVehicleId } from "@/modules/vehicles/data/mock";
import { notFound } from "next/navigation";
import { cn } from "@/utils/cn";

export const metadata = { title: "Driver History | FleexyTrip Admin" };

export default async function VehicleDriverHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactNode> {
  const { id } = await params;
  const vehicle = getVehicleById(id);
  if (!vehicle) notFound();

  const history = getDriverHistoryByVehicleId(id);
  const currentDriverId = vehicle.driver?.id;

  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Driver History</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          All drivers who have operated this vehicle
        </p>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg className="h-8 w-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="text-sm text-gray-400">No driver history available</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Driver", "Phone", "Assigned Date", "Unassigned Date", "Trips"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-medium text-gray-500"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => {
              const isCurrent = entry.driverId === currentDriverId;
              return (
                <tr
                  key={entry.driverId}
                  className={cn(
                    "border-b border-gray-50 last:border-0",
                    isCurrent && "bg-emerald-50",
                  )}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{entry.driverName}</p>
                      {isCurrent && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          Current
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{entry.phone}</td>
                  <td className="px-5 py-3 text-gray-500">{entry.assignedAt}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {entry.unassignedAt ?? (
                      <span className="text-emerald-600 text-xs font-medium">Active</span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {entry.tripsCount.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}