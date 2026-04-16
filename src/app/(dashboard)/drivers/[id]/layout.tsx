import { getDriverById } from "@/modules/drivers/data/mock";
import ProfileLayoutView from "@/shared/layouts/ProfileLayoutView";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}): Promise<React.ReactNode> {
  const { id } = await params;
  const profile = getDriverById(id);
  return (
    <ProfileLayoutView id={id} profile={profile}>
      {children}
    </ProfileLayoutView>
  );
}
