"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import StarRating from "./StarRating";
import type { ProfileNavItem, AccountStatus } from "./types";

const ICONS: Record<string, React.ReactNode> = {
  personal: (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  verification: (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  vehicle: (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h2m4 2h2.5M5 16H3m0 0V6"
      />
    </svg>
  ),
  activity: (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  rides: (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>
  ),
  transactions: (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ),
  logs: (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 10h16M4 14h16M4 18h16"
      />
    </svg>
  ),
  settings: (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
};

interface ProfileSidebarProps {
  firstName: string;
  lastName: string;
  isVerified: boolean;
  rating: number;
  createdAt: string;
  accountStatus: AccountStatus;
  navItems: ProfileNavItem[];
}

export default function ProfileSidebar({
  firstName,
  lastName,
  isVerified,
  rating,
  createdAt,
  navItems,
}: ProfileSidebarProps): React.ReactNode {
  const pathname = usePathname();
  const initials = `${firstName[0]}${lastName[0]}`;

  return (
    <div className="w-70 shrink-0">
      <div className="bg-white rounded-xl border border-gray-100 mt-12 space-t-4">
        <div className="px-5 pt-0 -top-7 relative">
          <div className="relative mb-2 flex items-center gap-x-3">
            <div
              className="h-25 w-25 rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-white"
              style={{
                background: "linear-gradient(135deg, #1e3a4c 0%, #2d5876 100%)",
              }}
            >
              {initials}
            </div>
            <div className="mt-5">
              {isVerified && (
                <span className="bg-emerald-500 text-white text-[9px] font-semibold px-1.5 py-0.2 rounded-xs leading-none">
                  Verified
                </span>
              )}
              <StarRating rating={rating} />
            </div>
          </div>
          <h3 className="mt-2 text-normal font-bold text-gray-900 leading-tight">
            {firstName} {lastName}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            CreatedAt: {createdAt}
          </p>
        </div>
      </div>
      <nav className="py-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] duration-300 transition-all my-3 bg-white",
                isActive
                  ? "text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
              )}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, #1e3a4c 0%, #2d5876 100%)",
                    }
                  : {}
              }
            >
              <span
                className={cn(
                  "shrink-0",
                  isActive ? "text-white" : "text-gray-400",
                )}
              >
                {ICONS[item.iconKey]}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
