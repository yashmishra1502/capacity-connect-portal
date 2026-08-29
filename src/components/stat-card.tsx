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
  /** 0-100, how full the accent bar renders. Purely decorative if omitted. */
  fill?: number;
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
  fill = 70,
}: StatCardProps) {
  const tint = accentMap[accent];

  return (
    <div
      className="cc-stat-card"
      style={{ "--cc-accent": tint } as React.CSSProperties}
    >
      <div className="cc-stat-top">
        <span className="cc-stat-icon">
          <Icon className="size-4" />
        </span>
        {trend && (
          <span
            className={cn(
              "text-[11px] font-semibold",
              trendUp ? "text-emerald-500" : "text-rose-500",
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="cc-stat-value">{value}</p>
      <p className="cc-label-caps mt-1">{label}</p>
      <div className="cc-stat-bar">
        <span style={{ width: `${Math.min(100, Math.max(0, fill))}%` }} />
      </div>
    </div>
  );
}
