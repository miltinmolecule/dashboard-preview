import { getDriverById } from "@/modules/drivers/data/mock";
import PersonalInfoContent from "@/shared/profile/PersonalInfoContent";

export default async function Page({ params }: { params: Promise<{ id: string }> }): Promise<React.ReactNode> {
  const { id } = await params;
  const profile = getDriverById(id);
  return <PersonalInfoContent profile={profile} userType={profile.userType} />;
}
