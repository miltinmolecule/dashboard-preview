import DashboardLayout from "@/shared/common/DashboardLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return <DashboardLayout>{children}</DashboardLayout>;
}
