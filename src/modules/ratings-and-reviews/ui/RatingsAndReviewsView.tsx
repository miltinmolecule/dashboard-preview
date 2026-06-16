"use client";

import { useState, useMemo } from "react";
import DashboardHeader from "@/shared/cards/DashboardHeader";
import { cn } from "@/utils/cn";
import type {
  Rating,
  RatingAlert,
  RateeType,
  ThresholdConfig,
  ActiveTab,
} from "../type/ratings";
import RatingsTablePanel from "./RatingsTablePanel";
import AlertsPanel from "./AlertsPanel";
import ThresholdConfigForm from "./ThresholdConfigForm";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_DRIVER_RATINGS: Rating[] = [
  {
    id: "RTG-001",
    ride_id: "RDE-3412",
    rater: { id: "usr_001", name: "Tunde Bakare", phone: "+234 *** *** 4521" },
    ratee: { id: "drv_001", name: "Emeka Okonkwo", phone: "+234 *** *** 7823" },
    ratee_type: "driver",
    score: 5,
    status: "active",
    created_at: "2026-06-01T10:23:00Z",
  },
  {
    id: "RTG-002",
    ride_id: "RDE-3398",
    rater: {
      id: "usr_002",
      name: "Chidinma Okafor",
      phone: "+234 *** *** 6612",
    },
    ratee: { id: "drv_001", name: "Emeka Okonkwo", phone: "+234 *** *** 7823" },
    ratee_type: "driver",
    score: 4,
    status: "active",
    created_at: "2026-05-28T14:10:00Z",
  },
  {
    id: "RTG-003",
    ride_id: "RDE-3201",
    rater: { id: "usr_003", name: "Hakeem Adisa", phone: "+234 *** *** 2291" },
    ratee: {
      id: "drv_002",
      name: "Fatima Al-Hassan",
      phone: "+234 *** *** 9900",
    },
    ratee_type: "driver",
    score: 1,
    status: "flagged",
    flagged_reason: "Rude behaviour and unsafe driving reported",
    created_at: "2026-05-25T09:45:00Z",
  },
  {
    id: "RTG-004",
    ride_id: "RDE-3099",
    rater: { id: "usr_004", name: "Blessing Eze", phone: "+234 *** *** 3341" },
    ratee: { id: "drv_003", name: "Suleiman Musa", phone: "+234 *** *** 5510" },
    ratee_type: "driver",
    score: 3,
    status: "active",
    created_at: "2026-05-20T16:00:00Z",
  },
  {
    id: "RTG-005",
    ride_id: "RDE-2980",
    rater: { id: "usr_005", name: "Aisha Yusuf", phone: "+234 *** *** 7743" },
    ratee: {
      id: "drv_002",
      name: "Fatima Al-Hassan",
      phone: "+234 *** *** 9900",
    },
    ratee_type: "driver",
    score: 2,
    status: "flagged",
    flagged_reason: "Driver disputed — claims passenger gave incorrect address",
    created_at: "2026-05-15T11:30:00Z",
  },
  {
    id: "RTG-006",
    ride_id: "RDE-2871",
    rater: { id: "usr_006", name: "Grace Okonkwo", phone: "+234 *** *** 6621" },
    ratee: { id: "drv_004", name: "Amina Bello", phone: "+234 *** *** 4430" },
    ratee_type: "driver",
    score: 5,
    status: "active",
    created_at: "2026-05-10T08:00:00Z",
  },
  {
    id: "RTG-007",
    ride_id: "RDE-2750",
    rater: {
      id: "usr_007",
      name: "Emmanuel Nwosu",
      phone: "+234 *** *** 1187",
    },
    ratee: { id: "drv_005", name: "Ngozi Ikenna", phone: "+234 *** *** 3320" },
    ratee_type: "driver",
    score: 1,
    status: "removed",
    flagged_reason: "Harassment",
    admin_response:
      "Removed after investigation confirmed inappropriate behaviour.",
    created_at: "2026-04-30T19:15:00Z",
  },
  {
    id: "RTG-008",
    ride_id: "RDE-2640",
    rater: { id: "usr_008", name: "Kabiru Salami", phone: "+234 *** *** 9912" },
    ratee: { id: "drv_004", name: "Amina Bello", phone: "+234 *** *** 4430" },
    ratee_type: "driver",
    score: 4,
    status: "active",
    created_at: "2026-04-25T12:45:00Z",
  },
  {
    id: "RTG-009",
    ride_id: "RDE-2510",
    rater: { id: "usr_009", name: "Adaeze Obiora", phone: "+234 *** *** 5542" },
    ratee: { id: "drv_003", name: "Suleiman Musa", phone: "+234 *** *** 5510" },
    ratee_type: "driver",
    score: 2,
    status: "active",
    created_at: "2026-04-18T07:20:00Z",
  },
  {
    id: "RTG-010",
    ride_id: "RDE-2388",
    rater: { id: "usr_010", name: "Festus Agbaje", phone: "+234 *** *** 8801" },
    ratee: { id: "drv_001", name: "Emeka Okonkwo", phone: "+234 *** *** 7823" },
    ratee_type: "driver",
    score: 5,
    status: "active",
    created_at: "2026-04-10T15:00:00Z",
  },
];

const MOCK_PASSENGER_RATINGS: Rating[] = [
  {
    id: "RTG-101",
    ride_id: "RDE-3411",
    rater: { id: "drv_001", name: "Emeka Okonkwo", phone: "+234 *** *** 7823" },
    ratee: {
      id: "usr_002",
      name: "Chidinma Okafor",
      phone: "+234 *** *** 6612",
    },
    ratee_type: "passenger",
    score: 5,
    status: "active",
    created_at: "2026-06-01T10:23:00Z",
  },
  {
    id: "RTG-102",
    ride_id: "RDE-3350",
    rater: {
      id: "drv_002",
      name: "Fatima Al-Hassan",
      phone: "+234 *** *** 9900",
    },
    ratee: { id: "usr_003", name: "Hakeem Adisa", phone: "+234 *** *** 2291" },
    ratee_type: "passenger",
    score: 4,
    status: "active",
    created_at: "2026-05-27T09:00:00Z",
  },
  {
    id: "RTG-103",
    ride_id: "RDE-3200",
    rater: { id: "drv_003", name: "Suleiman Musa", phone: "+234 *** *** 5510" },
    ratee: { id: "usr_001", name: "Tunde Bakare", phone: "+234 *** *** 4521" },
    ratee_type: "passenger",
    score: 2,
    status: "flagged",
    flagged_reason: "Passenger was rude and left the vehicle in a bad state",
    created_at: "2026-05-24T14:30:00Z",
  },
  {
    id: "RTG-104",
    ride_id: "RDE-3088",
    rater: { id: "drv_004", name: "Amina Bello", phone: "+234 *** *** 4430" },
    ratee: { id: "usr_004", name: "Blessing Eze", phone: "+234 *** *** 3341" },
    ratee_type: "passenger",
    score: 3,
    status: "active",
    created_at: "2026-05-19T11:00:00Z",
  },
  {
    id: "RTG-105",
    ride_id: "RDE-2975",
    rater: { id: "drv_005", name: "Ngozi Ikenna", phone: "+234 *** *** 3320" },
    ratee: { id: "usr_005", name: "Aisha Yusuf", phone: "+234 *** *** 7743" },
    ratee_type: "passenger",
    score: 1,
    status: "removed",
    flagged_reason: "Violent behaviour",
    admin_response: "Passenger account suspended pending further review.",
    created_at: "2026-05-14T20:00:00Z",
  },
  {
    id: "RTG-106",
    ride_id: "RDE-2860",
    rater: { id: "drv_001", name: "Emeka Okonkwo", phone: "+234 *** *** 7823" },
    ratee: { id: "usr_006", name: "Grace Okonkwo", phone: "+234 *** *** 6621" },
    ratee_type: "passenger",
    score: 5,
    status: "active",
    created_at: "2026-05-09T08:30:00Z",
  },
  {
    id: "RTG-107",
    ride_id: "RDE-2745",
    rater: {
      id: "drv_002",
      name: "Fatima Al-Hassan",
      phone: "+234 *** *** 9900",
    },
    ratee: {
      id: "usr_007",
      name: "Emmanuel Nwosu",
      phone: "+234 *** *** 1187",
    },
    ratee_type: "passenger",
    score: 4,
    status: "active",
    created_at: "2026-04-28T17:00:00Z",
  },
  {
    id: "RTG-108",
    ride_id: "RDE-2630",
    rater: { id: "drv_003", name: "Suleiman Musa", phone: "+234 *** *** 5510" },
    ratee: { id: "usr_008", name: "Kabiru Salami", phone: "+234 *** *** 9912" },
    ratee_type: "passenger",
    score: 3,
    status: "active",
    created_at: "2026-04-22T13:15:00Z",
  },
];

const MOCK_ALERTS: RatingAlert[] = [
  {
    id: "ALT-001",
    ratee_id: "drv_002",
    ratee_name: "Fatima Al-Hassan",
    ratee_type: "driver",
    current_average: 1.7,
    threshold: 2.0,
    rating_count: 12,
    triggered_at: "2026-06-15T08:00:00Z",
    dismissed: false,
  },
  {
    id: "ALT-002",
    ratee_id: "usr_001",
    ratee_name: "Tunde Bakare",
    ratee_type: "passenger",
    current_average: 1.9,
    threshold: 2.0,
    rating_count: 11,
    triggered_at: "2026-06-10T14:30:00Z",
    dismissed: false,
  },
];

const MOCK_THRESHOLDS: ThresholdConfig[] = [
  {
    id: "THR-001",
    ratee_type: "driver",
    threshold: 2.0,
    min_ratings: 10,
    notify_email: true,
    notify_dashboard: true,
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "THR-002",
    ratee_type: "passenger",
    threshold: 2.0,
    min_ratings: 10,
    notify_email: false,
    notify_dashboard: true,
    updated_at: "2026-01-01T00:00:00Z",
  },
];


export default function RatingsAndReviewsView(): React.ReactNode {
  const [tab, setTab] = useState<ActiveTab>("drivers");

  // swap with real queries: useRatings({ ratee_type: "driver" })
  const [driverRatings, setDriverRatings] =
    useState<Rating[]>(MOCK_DRIVER_RATINGS);
  const [passengerRatings, setPassengerRatings] = useState<Rating[]>(
    MOCK_PASSENGER_RATINGS,
  );
  const [alerts, setAlerts] = useState<RatingAlert[]>(MOCK_ALERTS);
  const [thresholds, setThresholds] =
    useState<ThresholdConfig[]>(MOCK_THRESHOLDS);

  const undismissedCount = useMemo(
    () => alerts.filter((a) => !a.dismissed).length,
    [alerts],
  );

  const applyPatch = (
    setFn: React.Dispatch<React.SetStateAction<Rating[]>>,
    id: string,
    patch: Partial<Rating>,
  ): void => {
    setFn((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const makeHandlers = (rateeType: RateeType) => {
    const setFn =
      rateeType === "driver" ? setDriverRatings : setPassengerRatings;
    return {
      onFlag: (id: string, reason: string) =>
        applyPatch(setFn, id, { status: "flagged", flagged_reason: reason }),
      onRemove: (id: string) => applyPatch(setFn, id, { status: "removed" }),
      onRestore: (id: string) => applyPatch(setFn, id, { status: "active" }),
      onRespond: (id: string, response: string) =>
        applyPatch(setFn, id, { admin_response: response }),
    };
  };

  const tabs: Array<{ key: ActiveTab; label: string; badge?: number }> = [
    { key: "drivers", label: "Driver Reviews" },
    { key: "passengers", label: "Passenger Reviews" },
    { key: "alerts", label: "Alerts", badge: undismissedCount },
    { key: "settings", label: "Settings" },
  ];

  return (
    <div className="space-y-5">
      <DashboardHeader
        title="Ratings & Reviews"
        description="Monitor and moderate driver and passenger ratings"
      />

      {/* Tab bar */}
      <div className="flex w-fit gap-1 rounded-lg bg-gray-100 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "relative rounded-md px-5 py-1.5 text-sm font-medium transition-all",
              tab === t.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {t.label}
            {t.badge != null && t.badge > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {tab === "drivers" && (
        <RatingsTablePanel data={driverRatings} {...makeHandlers("driver")} />
      )}
      {tab === "passengers" && (
        <RatingsTablePanel
          data={passengerRatings}
          {...makeHandlers("passenger")}
        />
      )}
      {tab === "alerts" && (
        <AlertsPanel
          alerts={alerts}
          undismissed_count={undismissedCount}
          onDismiss={(id) =>
            setAlerts((prev) => prev.filter((a) => a.id !== id))
          }
        />
      )}
      {tab === "settings" && (
        <ThresholdConfigForm
          thresholds={thresholds}
          onSave={(id, body) =>
            setThresholds((prev) =>
              prev.map((t) =>
                t.id === id
                  ? { ...t, ...body, updated_at: new Date().toISOString() }
                  : t,
              ),
            )
          }
        />
      )}
    </div>
  );
}
