import { getUserById } from "@/modules/users/data/mock";
import VerificationContent from "@/shared/profile/VerificationContent";

export default async function Page({ params }: { params: Promise<{ id: string }> }): Promise<React.ReactNode> {
  const { id } = await params;
  const profile = getUserById(id);
  return <VerificationContent profile={profile} />;
}
