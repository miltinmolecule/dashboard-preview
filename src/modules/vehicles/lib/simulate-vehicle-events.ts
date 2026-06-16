import type { Vehicle } from "../services/vehicles.service";

export function simulateVehicleEvents(
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>,
  vehicleIds: string[],
): () => void {
  if (process.env.NODE_ENV !== "development" || vehicleIds.length === 0) {
    return () => {};
  }
  const statusCycle: Vehicle["status"][] = ["active", "suspended", "active", "pending"];
  const verCycle: Vehicle["verificationStatus"][] = ["verified", "expired", "pending", "verified"];
  let tick = 0;
  const id = setInterval(() => {
    const vehicleId = vehicleIds[tick % vehicleIds.length];
    if (tick % 2 === 0) {
      const status = statusCycle[tick % statusCycle.length];
      setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, status } : v)));
    } else {
      const verificationStatus = verCycle[tick % verCycle.length];
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...v, verificationStatus } : v)),
      );
    }
    tick++;
  }, 4000);
  return () => clearInterval(id);
}
