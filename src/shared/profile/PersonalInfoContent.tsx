import type { BaseProfile } from "./types";

interface PersonalInfoContentProps {
  profile: BaseProfile;
  userType: string;
}

export default function PersonalInfoContent({
  profile,
  userType,
}: PersonalInfoContentProps): React.ReactNode {
  return (
    <div className="space-y-4">
      {/* Personal info + Bank details */}
      <div className="flex gap-4">
        <div className="flex-1 bg-white rounded-xl border border-gray-100  p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Personal Information
          </h2>
          <div className="space-y-4">
            {[
              { label: "User type:", value: userType },
              { label: "Firstname:", value: profile.firstName },
              { label: "Lastname:", value: profile.lastName },
              { label: "Date of birth:", value: profile.dateOfBirth },
              { label: "Phone no.:", value: profile.phone },
              { label: "Email:", value: profile.email },
              { label: "NIN No.:", value: profile.nin },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-8">
                <span className="w-32 shrink-0 text-sm text-gray-400">
                  {label}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-56 shrink-0">
          <div className="bg-[url('/images/hero.png')]">
            <p className="text-sm font-semibold mb-5 relative">Bank Details</p>
            <div className="relative space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-white/80">
                  {profile.bankName}
                </span>
                <span className="text-xs font-mono font-medium">
                  {profile.bankAccount}
                </span>
              </div>
              <p className="text-sm text-white/70">{profile.bankAccountName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Location + Emergency contacts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100  p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Location Details
          </h2>
          <div className="space-y-3">
            {[
              { label: "House address:", value: profile.address },
              { label: "City", value: profile.city },
              { label: "State", value: profile.state },
              { label: "Country", value: profile.country },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <span className="w-28 shrink-0 text-sm text-gray-400">
                  {label}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100  p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Emergency Contact Details
          </h2>
          <div className="space-y-4 mb-5">
            {profile.emergencyContacts.map((contact, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {contact.relation}
                  </p>
                  <p className="text-xs text-gray-400">{contact.name}</p>
                </div>
                <span className="text-sm text-gray-600">{contact.phone}</span>
              </div>
            ))}
          </div>
          <button
            className="w-full rounded-xl py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #1e3a4c 0%, #2d5876 100%)",
            }}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Emergency Contact
          </button>
        </div>
      </div>
    </div>
  );
}
