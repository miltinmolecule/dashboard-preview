import { cn } from "@/utils/cn";
import CardWrapper from "../cards/CardWrapper";

const SETTINGS = [
  { label: "Email Notifications", description: "Receive notifications about trips and payments", enabled: true },
  { label: "SMS Alerts", description: "Receive SMS alerts for account activity", enabled: false },
  { label: "Two-Factor Authentication", description: "Extra security for your account", enabled: true },
  { label: "Marketing Emails", description: "Receive promotional content and offers", enabled: false },
];

export default function SettingsContent(): React.ReactNode {
  return (
    <CardWrapper>
      <h2 className="text-base font-semibold text-gray-900 mb-5">Settings</h2>
      <div className="space-y-1">
        {SETTINGS.map((s) => (
          <div key={s.label} className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-900">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.description}</p>
            </div>
            <div className={cn("h-5 w-9 rounded-full relative cursor-pointer shrink-0", s.enabled ? "bg-[#1e3a4c]" : "bg-gray-200")}>
              <div className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform", s.enabled ? "translate-x-4" : "translate-x-0.5")} />
            </div>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}
