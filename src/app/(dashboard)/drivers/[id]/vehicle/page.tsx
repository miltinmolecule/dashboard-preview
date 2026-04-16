import { getDriverById } from "@/modules/drivers/data/mock";
import VehicleContent from "@/shared/profile/VehicleContent";

export default async function Page({ params }: { params: Promise<{ id: string }> }): Promise<React.ReactNode> {
  const { id } = await params;
  const profile = getDriverById(id);
  return <VehicleContent profile={profile} />;
}
