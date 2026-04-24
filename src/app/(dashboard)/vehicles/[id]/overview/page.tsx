import { getVehicleById } from "@/modules/vehicles/data/mock";
import StatusBadge from "@/shared/common/StatusBadge";
import { notFound } from "next/navigation";

export const metadata = { title: "Vehicle Overview | FleexyTrip Admin" };

export default async function VehicleOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactNode> {
  const { id } = await params;
  const vehicle = getVehicleById(id);
  if (!vehicle) notFound();

  const fields = [
    { label: "Make", value: vehicle.make },
    { label: "Model", value: vehicle.model },
    { label: "Year", value: String(vehicle.year) },
    { label: "Color", value: vehicle.color },
    { label: "Plate Number", value: vehicle.plateNumber },
    { label: "VIN", value: vehicle.vin ?? "—" },
    { label: "Vehicle Type", value: vehicle.vehicleType ?? "—" },
    { label: "Status", value: vehicle.status, badge: true },
    { label: "Verification", value: vehicle.verificationStatus, badge: true },
    { label: "Registered", value: vehicle.registeredAt },
    { label: "Last Active", value: vehicle.lastActiveAt ?? "Never" },
  ];

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Trips", value: vehicle.totalTrips.toLocaleString() },
          { label: "Registered", value: vehicle.registeredAt },
          { label: "Last Active", value: vehicle.lastActiveAt ?? "Never" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white px-4 py-3">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Info grid */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Vehicle Information</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {fields.map((f) => (
            <div key={f.label}>
              <p className="text-xs text-gray-400">{f.label}</p>
              {f.badge ? (
                <div className="mt-0.5">
                  <StatusBadge status={f.value} />
                </div>
              ) : (
                <p className="mt-0.5 text-sm font-medium text-gray-900">{f.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Assigned driver */}
      {vehicle.driver && (
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Assigned Driver</h2>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
              {vehicle.driver.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{vehicle.driver.name}</p>
              <p className="text-xs text-gray-500">{vehicle.driver.phone} · {vehicle.driver.email}</p>
            </div>
            <a
              href={`/drivers/${vehicle.driver.id}/personal`}
              className="ml-auto text-xs font-medium text-blue-600 hover:underline"
            >
              View Driver Profile →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}