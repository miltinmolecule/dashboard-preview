import { getUserById } from "@/modules/users/data/mock";
import RidesContent from "@/shared/profile/RidesContent";

export default async function Page({ params }: { params: Promise<{ id: string }> }): Promise<React.ReactNode> {
  const { id } = await params;
  const profile = getUserById(id);
  return <RidesContent rides={profile.rides} />;
}
