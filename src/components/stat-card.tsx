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
    <div
      className="cc-glow-card surface-panel p-5"
      style={{ "--primary": tint } as React.CSSProperties}
    >
      <div className="flex items-center justify-between">
        <span className="cc-icon-chip !h-9 !w-9 !rounded-lg">
          <Icon className="size-4" />
        </span>
        {trend && (
          <span
            className={cn(
              "text-[11px] font-semibold",
              trendUp ? "text-emerald-600" : "text-rose-500",
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="mt-3 font-display cc-heading text-2xl">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
