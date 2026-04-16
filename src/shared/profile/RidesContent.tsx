"use client";

import { useState } from "react";
import StatusBadge from "@/shared/common/StatusBadge";
import SimplePagination from "./SimplePagination";
import type { RideRecord } from "./types";

export default function RidesContent({ rides }: { rides: RideRecord[] }): React.ReactNode {
  const [search, setSearch] = useState("");

  const filtered = search
    ? rides.filter((r) => r.id.toLowerCase().includes(search.toLowerCase()) || r.location.toLowerCase().includes(search.toLowerCase()))
    : rides;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-900">Rides History</h2>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filter
          </button>
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-36"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Ride Id", "Location", "Amount", "Passengers", "Date | Time", "Status", "Action"].map((h) => (
                <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-500 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((ride) => (
              <tr key={ride.id} className="hover:bg-gray-50/50">
                <td className="py-3 pr-4 text-xs font-mono text-gray-700">{ride.id}</td>
                <td className="py-3 pr-4 text-sm text-gray-700">{ride.location}</td>
                <td className="py-3 pr-4 text-sm font-medium text-gray-900">₦{ride.amount.toLocaleString()}</td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(ride.passengers, 3) }).map((_, i) => (
                      <div key={i} className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white -ml-1 first:ml-0 flex items-center justify-center">
                        <svg className="h-3 w-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ))}
                    {ride.passengers > 3 && <span className="text-xs text-gray-400 ml-1">+{ride.passengers - 3}</span>}
                  </div>
                </td>
                <td className="py-3 pr-4 text-xs text-gray-500">{ride.dateTime}</td>
                <td className="py-3 pr-4"><StatusBadge status={ride.status} /></td>
                <td className="py-3">
                  <button className="h-7 w-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SimplePagination totalPages={Math.ceil(rides.length / 10) || 1} />
    </div>
  );
}
