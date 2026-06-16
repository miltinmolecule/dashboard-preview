import { useSession } from "next-auth/react";
import { VALID_ROLES, type AdminRole } from "../type/admin-management";

export function useCurrentAdmin() {
  const { data: session } = useSession();
  const sessionRole = session?.role as AdminRole | undefined;
  const role: AdminRole =
    sessionRole && VALID_ROLES.includes(sessionRole) ? sessionRole : "support_admin";

  return {
    role,
    email:        session?.user?.email ?? "",
    name:         session?.user?.name  ?? "Admin",
    isSuperAdmin: role === "super_admin",
    isSelf:       (adminEmail: string) =>
      !!session?.user?.email && session.user.email === adminEmail,
  };
}
