"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileSidebar from "@/shared/profile/ProfileSidebar";
import ProfileActionButtons from "@/shared/profile/ProfileActionButtons";
import type {
  DriverProfile,
  ProfileNavItem,
  AccountStatus,
  UserProfile,
} from "@/shared/profile/types";
import DashboardHeader from "@/shared/cards/DashboardHeader";

const SEGMENT_LABELS: Record<string, string> = {
  personal: "Profile Info",
  verification: "Verification Info",
  vehicle: "Vehicle Information",
  activity: "Activity Overview",
  rides: "Rides History",
  transactions: "Transaction Summary",
  logs: "User Logs",
  settings: "Settings",
};

const SEGMENT_USER_LABELS: Record<string, string> = {
  personal: "Personal Information",
  verification: "Verification Info",
  activity: "Activity Overview",
  rides: "Rides History",
  transactions: "Transaction Summary",
  logs: "User Logs",
  settings: "Settings",
};

type UserTypeProp = "driver" | "user";

function getNavItems(id: string, userType: UserTypeProp): ProfileNavItem[] {
  return userType === "user"
    ? [
        {
          label: "Personal Info",
          href: `/users/${id}/personal`,
          iconKey: "personal",
        },
        {
          label: "Verification Info",
          href: `/users/${id}/verification`,
          iconKey: "verification",
        },
        {
          label: "Activity Overview",
          href: `/users/${id}/activity`,
          iconKey: "activity",
        },
        {
          label: "Rides History",
          href: `/users/${id}/rides`,
          iconKey: "rides",
        },
        {
          label: "Transaction Summary",
          href: `/users/${id}/transactions`,
          iconKey: "transactions",
        },
        { label: "User Logs", href: `/users/${id}/logs`, iconKey: "logs" },
        {
          label: "Settings",
          href: `/users/${id}/settings`,
          iconKey: "settings",
        },
      ]
    : [
        {
          label: "Profile Info",
          href: `/drivers/${id}/personal`,
          iconKey: "personal",
        },
        {
          label: "Verification Info",
          href: `/drivers/${id}/verification`,
          iconKey: "verification",
        },
        {
          label: "Vehicle Information",
          href: `/drivers/${id}/vehicle`,
          iconKey: "vehicle",
        },
        {
          label: "Activity Overview",
          href: `/drivers/${id}/activity`,
          iconKey: "activity",
        },
        {
          label: "Rides History",
          href: `/drivers/${id}/rides`,
          iconKey: "rides",
        },
        {
          label: "Transaction Summary",
          href: `/drivers/${id}/transactions`,
          iconKey: "transactions",
        },
        { label: "User Logs", href: `/drivers/${id}/logs`, iconKey: "logs" },
        {
          label: "Settings",
          href: `/drivers/${id}/settings`,
          iconKey: "settings",
        },
      ];
}

interface Props {
  id: string;
  profile: UserProfile | DriverProfile;
  children: React.ReactNode;
}

export default function ProfileLayoutView({
  id,
  profile,
  children,
}: Props): React.ReactNode {
  const pathname = usePathname();
  const [accountStatus, setAccountStatus] = useState<AccountStatus>(
    profile.accountStatus,
  );

  const segment = pathname.split("/").pop() ?? "personal";
  const userType = profile?.userType?.toLowerCase();
  const tabLabel =
    userType === "user"
      ? SEGMENT_USER_LABELS[segment]
      : (SEGMENT_LABELS[segment] ?? "Profile");

  return (
    <div className="space-y-4">
      <DashboardHeader
        title={`${userType} Details`}
        breadcrumbs={
          <nav className="flex items-center gap-1.5 text-gray-400">
            <Link 
              href={`/${userType}s`}
              className="hover:text-gray-600 text-sm transition-colors"
            >
              Users
            </Link>
            <span>/</span>
            <span className="text-gray-600 text-sm">{tabLabel}</span>
          </nav>
        }
      />
      <div className="flex gap-5 items-start">
        <ProfileSidebar
          firstName={profile.firstName}
          lastName={profile.lastName}
          isVerified={profile.isVerified}
          rating={profile.rating}
          createdAt={profile.createdAt}
          accountStatus={accountStatus}
          navItems={getNavItems(id, userType as UserTypeProp)}
        />
        <div className="flex-1 min-w-0">
          <ProfileActionButtons
            accountStatus={accountStatus}
            onSuspend={() => setAccountStatus("suspended")}
            onReactivate={() => setAccountStatus("active")}
          />
          {children}
        </div>
      </div>
    </div>
  );
}
