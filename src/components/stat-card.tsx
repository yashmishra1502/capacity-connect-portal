import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/styles/dashboard-glass.css";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  accent?: "indigo" | "emerald" | "amber" | "violet";
}

const accentMap = {
  indigo: "oklch(0.58 0.18 275)",
  emerald: "oklch(0.6 0.14 155)",
  amber: "oklch(0.72 0.16 75)",
  violet: "oklch(0.58 0.18 300)",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  accent = "indigo",
}: StatCardProps) {
  const tint = accentMap[accent];

  return (
    <div className="cc-stat" style={{ "--cc-accent": tint } as React.CSSProperties}>
      <span className="cc-stat-icon">
        <Icon className="size-[18px]" />
      </span>
      <div className="min-w-0">
        <p className="cc-stat-value">{value}</p>
        <p className="cc-stat-label">{label}</p>
      </div>
      {trend && (
        <span
          className={cn(
            "ml-auto shrink-0 text-[11px] font-semibold",
            trendUp ? "text-emerald-500" : "text-rose-500",
          )}
        >
          {trend}
        </span>
      )}
    </div>
  );
}
