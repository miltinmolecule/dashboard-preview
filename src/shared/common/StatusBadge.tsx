import { cn } from "@/utils/cn";

type BadgeVariant =
  | "active"
  | "inactive"
  | "suspended"
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled"
  | "in_progress"
  | "failed"
  | "flagged"
  | "deleted";

interface StatusBadgeProps {
  status: BadgeVariant | string;
  label?: string;
  className?: string;
}

const VARIANT_CLASSES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
  deleted: "bg-gray-100 text-gray-600 border-gray-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  suspended: "bg-red-50 text-red-700 border-red-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  flagged: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function StatusBadge({ status, label, className }: StatusBadgeProps): React.ReactNode {
  const classes = VARIANT_CLASSES[status.toLowerCase()] ?? "bg-gray-100 text-gray-600 border-gray-200";
  const displayLabel = label ?? status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        classes,
        className
      )}
    >
      {displayLabel}
    </span>
  );
}
