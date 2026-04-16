import type { DriverProfile } from "./types";

export default function VehicleContent({ profile }: { profile: DriverProfile }): React.ReactNode {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Vehicle Information</h2>
        <div className="flex gap-8">
          <div className="flex-1 space-y-3">
            {[
              { label: "Make:", value: profile.vehicleMake },
              { label: "Model:", value: profile.vehicleModel },
              { label: "Year:", value: profile.vehicleYear },
              { label: "Color:", value: profile.vehicleColor },
              { label: "Number of seats:", value: String(profile.vehicleSeats) },
              { label: "VIN/Chassis number:", value: profile.vehicleVin },
              { label: "VPN Chassis number:", value: profile.vehicleChassis },
              { label: "Engine number:", value: profile.vehicleEngine },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="w-40 shrink-0 text-sm text-gray-400">{label}</span>
                <span className="text-sm font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>

          <div className="w-56 shrink-0">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Vehicle Images</p>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-video rounded-lg bg-gray-100 border border-dashed border-gray-200 flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Vehicle Documents</h2>
        <div className="grid grid-cols-4 gap-4">
          {profile.vehicleDocuments.map((doc) => (
            <div key={doc.label} className="text-center">
              <div className="aspect-[3/4] rounded-xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center mb-2 p-3">
                <svg className="h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="w-full space-y-1">
                  {[1, 2, 3].map((l) => <div key={l} className="h-1 bg-gray-200 rounded" />)}
                </div>
              </div>
              <p className="text-[11px] text-gray-500 leading-tight">{doc.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
