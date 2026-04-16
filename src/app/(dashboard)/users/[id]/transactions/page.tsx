import { getUserById } from "@/modules/users/data/mock";
import TransactionsContent from "@/shared/profile/TransactionsContent";

export default async function Page({ params }: { params: Promise<{ id: string }> }): Promise<React.ReactNode> {
  const { id } = await params;
  const profile = getUserById(id);
  return (
    <TransactionsContent
      transactions={profile.transactions}
      walletBalance={profile.walletBalance}
      totalSpent={profile.totalSpent}
      pendingPayment={profile.pendingPayment}
      totalTrips={profile.totalTrips}
    />
  );
}
