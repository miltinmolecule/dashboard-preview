import { getVehicleById } from "@/modules/vehicles/data/mock";
import VehicleDetailLayout from "@/modules/vehicles/ui/VehicleDetailLayout";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}): Promise<React.ReactNode> {
  const { id } = await params;
  const vehicle = getVehicleById(id);
  return (
    <VehicleDetailLayout id={id} vehicle={vehicle}>
      {children}
    </VehicleDetailLayout>
  );
}