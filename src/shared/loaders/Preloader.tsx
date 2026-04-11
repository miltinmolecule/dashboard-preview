import { cn } from "@/utils/cn";

interface PreloaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Preloader({ size = "md", className }: PreloaderProps): React.ReactNode {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-gray-200 border-t-blue-600",
        sizeClasses[size],
        className
      )}
    />
  );
}
