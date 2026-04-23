"use client";

import dynamic from "next/dynamic";

const MapViewClient = dynamic(() => import("./MapViewClient"), {
  ssr: false,
  loading: () => (
    <div
      className="-mx-6 -my-6 flex items-center justify-center bg-gray-50"
      style={{ height: "calc(100vh - 56px)" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--primary)]" />
        <p className="text-sm text-gray-400">Loading live map…</p>
      </div>
    </div>
  ),
});

export default function MapView(): React.ReactNode {
  return <MapViewClient />;
}
