import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  indigo: { bg: "bg-indigo-500/10", fg: "text-indigo-600" },
  emerald: { bg: "bg-emerald-500/10", fg: "text-emerald-600" },
  amber: { bg: "bg-amber-500/10", fg: "text-amber-600" },
  violet: { bg: "bg-violet-500/10", fg: "text-violet-600" },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  accent = "indigo",
}: StatCardProps) {
  const c = accentMap[accent];
  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className={cn("flex size-9 items-center justify-center rounded-md", c.bg)}>
            <Icon className={cn("size-4", c.fg)} />
          </div>
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
        <p className="mt-3 font-display text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
