import { getUserById } from "@/modules/users/data/mock";
import ActivityContent from "@/shared/profile/ActivityContent";

export default async function Page({ params }: { params: Promise<{ id: string }> }): Promise<React.ReactNode> {
  const { id } = await params;
  const profile = getUserById(id);
  return <ActivityContent activities={profile.activities} />;
}
