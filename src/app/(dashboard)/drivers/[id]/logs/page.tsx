import { getDriverById } from "@/modules/drivers/data/mock";
import LogsContent from "@/shared/profile/LogsContent";

export default async function Page({ params }: { params: Promise<{ id: string }> }): Promise<React.ReactNode> {
  const { id } = await params;
  const profile = getDriverById(id);
  return <LogsContent logs={profile.logs} />;
}
