import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "success" | "warning" | "info";
}) {
  const toneMap = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    info: "text-info",
  } as const;
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={cn("mt-2 font-display text-2xl font-bold", toneMap[tone])}>{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function Section({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const statusTone: Record<string, string> = {
  Active: "bg-success/12 text-success border-success/25",
  Completed: "bg-success/12 text-success border-success/25",
  Passed: "bg-success/12 text-success border-success/25",
  Approved: "bg-success/12 text-success border-success/25",
  Verified: "bg-success/12 text-success border-success/25",
  Published: "bg-success/12 text-success border-success/25",
  Available: "bg-success/12 text-success border-success/25",
  Live: "bg-success/12 text-success border-success/25",
  "In Progress": "bg-info/12 text-info border-info/25",
  Pending: "bg-warning/15 text-warning-foreground border-warning/40",
  Draft: "bg-muted text-muted-foreground border-border",
  "Not Started": "bg-muted text-muted-foreground border-border",
  Closed: "bg-muted text-muted-foreground border-border",
  "At Risk": "bg-destructive/10 text-destructive border-destructive/25",
  Reattempt: "bg-destructive/10 text-destructive border-destructive/25",
  Suspended: "bg-destructive/10 text-destructive border-destructive/25",
  Dropped: "bg-destructive/10 text-destructive border-destructive/25",
  Rejected: "bg-destructive/10 text-destructive border-destructive/25",
  Booked: "bg-destructive/10 text-destructive border-destructive/25",
  High: "bg-destructive/10 text-destructive border-destructive/25",
  Medium: "bg-warning/15 text-warning-foreground border-warning/40",
  Low: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", statusTone[status] ?? "bg-secondary text-secondary-foreground")}
    >
      {status}
    </Badge>
  );
}

export function ProgressCell({ value }: { value: number }) {
  return (
    <div className="flex min-w-28 items-center gap-2">
      <Progress value={value} className="h-1.5" />
      <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">{value}%</span>
    </div>
  );
}

export function EmptyHint({ text }: { text: string }) {
  return <p className="py-8 text-center text-sm text-muted-foreground">{text}</p>;
}
