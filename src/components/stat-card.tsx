import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  accent?: "indigo" | "emerald" | "amber" | "violet";
}

const accentMap = {
  indigo: "oklch(0.56 0.19 258)",
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
      className="group flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-24px_rgba(11,30,61,0.28)] dark:hover:shadow-[0_20px_44px_-24px_rgba(0,0,0,0.7)]"
    >
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
        style={{
          background: `color-mix(in oklab, ${tint} 14%, transparent)`,
          color: tint,
        }}
      >
        <Icon className="size-[18px]" />
      </span>
      <div className="min-w-0">
        <p className="text-xl font-bold tracking-tight leading-none">{value}</p>
        <p className="mt-1.5 text-[12.5px] font-medium text-muted-foreground">{label}</p>
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
