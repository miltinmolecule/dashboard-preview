import { cn } from "@/utils/cn";

type Trend = "up" | "down" | "neutral";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: Trend;
  trendValue?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  description?: string;
  onClick?: () => void;
  className?: string;
}

export default function StatCard({
  title,
  value,
  trend,
  trendValue,
  icon,
  iconBg = "bg-blue-50",
  description,
  onClick,
  className,
}: StatCardProps): React.ReactNode {
  const trendColors: Record<Trend, string> = {
    up: "text-emerald-600 bg-emerald-50",
    down: "text-red-600 bg-red-50",
    neutral: "text-gray-600 bg-gray-100",
  };

  const trendIcons: Record<Trend, React.ReactNode> = {
    up: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ),
    down: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    neutral: null,
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-100 p-5 shadow-sm",
        onClick && "cursor-pointer hover:shadow-md hover:border-blue-100 transition-all",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon && (
          <div className={cn("p-2 rounded-lg", iconBg)}>
            {icon}
          </div>
        )}
      </div>

      <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>

      <div className="flex items-center gap-2">
        {trend && trendValue && (
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", trendColors[trend])}>
            {trendIcons[trend]}
            {trendValue}
          </span>
        )}
        {description && (
          <p className="text-xs text-gray-400">{description}</p>
        )}
      </div>
    </div>
  );
}
