import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  value: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  // Status
  ACTIVE: "bg-green-500/15 text-green-400 border-green-500/20",
  STALE: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  ARCHIVED: "bg-gray-500/15 text-gray-400 border-gray-500/20",
  
  // Confidence
  HIGH: "bg-green-500/15 text-green-400 border-green-500/20",
  MEDIUM: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  LOW: "bg-red-500/15 text-red-400 border-red-500/20",
  
  // Severity
  CRITICAL: "bg-red-500/15 text-red-400 border-red-500/20",
  WARNING: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  OPPORTUNITY: "bg-green-500/15 text-green-400 border-green-500/20",
  INFO: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  
  // Phases
  FRAME: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  DISCOVER: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  DECIDE: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  CONFIRM: "bg-green-500/15 text-green-400 border-green-500/20",
  
  // Initiative types
  MARKET_ENTRY: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  OPTIMIZATION: "bg-teal-500/15 text-teal-400 border-teal-500/20",
  REPOSITIONING: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  NPD: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  
  // Coverage depth
  DEEP: "bg-green-500/15 text-green-400 border-green-500/20",
  MODERATE: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  THIN: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  BLIND: "bg-gray-500/15 text-gray-500 border-gray-500/20",
  
  // Other
  CLOSED: "bg-gray-500/15 text-gray-400 border-gray-500/20",
};

const typeLabels: Record<string, string> = {
  MARKET_ENTRY: "Market Entry",
  OPTIMIZATION: "Optimization",
  REPOSITIONING: "Repositioning",
  NPD: "New Product",
};

export function StatusBadge({ value, className }: StatusBadgeProps) {
  const colorClass = statusColors[value] || "bg-gray-500/15 text-gray-400 border-gray-500/20";
  const label = typeLabels[value] || value;
  
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-medium uppercase tracking-wider px-1.5 py-0 h-5 border",
        colorClass,
        className
      )}
      data-testid={`badge-${value.toLowerCase()}`}
    >
      {label}
    </Badge>
  );
}
