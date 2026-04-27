import { getVehicleById } from "@/modules/vehicles/data/mock";
import { notFound } from "next/navigation";

export const metadata = { title: "Vehicle Logs | FleexyTrip Admin" };

const MOCK_LOGS = [
  { id: "log_1", event: "Status changed to Active", actor: "Admin (system)", timestamp: "2026-04-14 09:30", type: "status" },
  { id: "log_2", event: "Driver Emeka Okonkwo assigned", actor: "Driver App", timestamp: "2026-04-14 09:15", type: "driver" },
  { id: "log_3", event: "Verification status: Verified", actor: "Admin (kemi@fleexy.com)", timestamp: "2026-04-13 14:22", type: "verification" },
  { id: "log_4", event: "Insurance document approved", actor: "Admin (kemi@fleexy.com)", timestamp: "2026-04-13 14:20", type: "document" },
  { id: "log_5", event: "Vehicle Papers approved", actor: "Admin (kemi@fleexy.com)", timestamp: "2026-04-13 14:18", type: "document" },
  { id: "log_6", event: "Vehicle registered", actor: "Driver App", timestamp: "2026-04-10 10:00", type: "registration" },
];

const TYPE_COLORS: Record<string, string> = {
  status: "bg-blue-100 text-blue-700",
  driver: "bg-purple-100 text-purple-700",
  verification: "bg-emerald-100 text-emerald-700",
  document: "bg-amber-100 text-amber-700",
  registration: "bg-gray-100 text-gray-600",
};

export default async function VehicleLogsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactNode> {
  const { id } = await params;
  const vehicle = getVehicleById(id);
  if (!vehicle) notFound();

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Activity Logs</h2>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" />
        <ul className="space-y-4">
          {MOCK_LOGS.map((log) => (
            <li key={log.id} className="flex items-start gap-4 pl-10 relative">
              <div
                className={`absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-white ${TYPE_COLORS[log.type]?.split(" ")[0] ?? "bg-gray-200"}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm text-gray-900">{log.event}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${TYPE_COLORS[log.type] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {log.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-gray-400">{log.timestamp}</p>
                  <span className="text-gray-200">·</span>
                  <p className="text-xs text-gray-400">{log.actor}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}