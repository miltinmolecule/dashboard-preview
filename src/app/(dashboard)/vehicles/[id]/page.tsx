import { redirect } from "next/navigation";

export default async function VehicleDetailIndexPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<never> {
  const { id } = await params;
  redirect(`/vehicles/${id}/overview`);
}
