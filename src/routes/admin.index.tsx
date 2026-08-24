import { createFileRoute } from "@tanstack/react-router";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Dashboard — Administration · Capacity Connect" }],
  }),
  component: AdminDashboard,
});

// TODO: replace with real API data
const departmentProgress: { name: string; pct: number }[] = [];
const enrollmentTrend: { month: string; enrollments: number; completions: number }[] = [];
const categoryDistribution: { name: string; value: number }[] = [];

const systemStatus = [
  { label: "Certificate issuance", state: "ok" as const },
  { label: "Assessment engine", state: "ok" as const },
  { label: "Trainer matching", state: "pending" as const },
  { label: "Access control", state: "ok" as const },
];

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-[160px] items-center justify-center text-xs text-muted-foreground">
      {label}
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6 last:border-none last:pr-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div>
        <h1 className="font-display text-xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide overview across courses and approvals.
        </p>
      </div>

      {/* Key numbers — plain, no cards, no color accents */}
      <div className="grid grid-cols-2 gap-4 sm:flex sm:gap-6">
        <StatBlock label="Active courses" value="—" />
        <StatBlock label="Completion rate" value="—" />
      </div>

      {/* Department completion — simple rows, thin bars, no card chrome */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Department completion
        </h2>
        <div className="mt-4 space-y-4">
          {departmentProgress.length === 0 ? (
            <EmptyState label="No department data available yet" />
          ) : (
            departmentProgress.map((d) => (
              <div key={d.name}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span>{d.name}</span>
                  <span className="tabular-nums text-muted-foreground">{d.pct}%</span>
                </div>
                <div className="h-px w-full bg-border">
                  <div
                    className="h-px bg-foreground"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Enrollment trend — single line, no fill gradient, no grid noise */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Enrollment &amp; completion
        </h2>
        <div className="mt-4">
          {enrollmentTrend.length === 0 ? (
            <EmptyState label="No enrollment data available yet" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={enrollmentTrend} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="enrollFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-foreground)" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="var(--color-foreground)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  stroke="var(--color-muted-foreground)"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="enrollments"
                  stroke="var(--color-foreground)"
                  fill="url(#enrollFill)"
                  strokeWidth={1.5}
                  name="Enrollments"
                />
                <Area
                  type="monotone"
                  dataKey="completions"
                  stroke="var(--color-muted-foreground)"
                  fill="transparent"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  name="Completions"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category distribution — plain list, no donut chart */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Courses by category
        </h2>
        <div className="mt-4">
          {categoryDistribution.length === 0 ? (
            <EmptyState label="No course data available yet" />
          ) : (
            <div className="space-y-2">
              {categoryDistribution.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <span>{c.name}</span>
                  <span className="tabular-nums text-muted-foreground">{c.value}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System status — text + dot, no icon library, no color-coded icons */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          System status
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {systemStatus.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-xs">
              <span
                className={
                  "size-1.5 rounded-full " +
                  (s.state === "ok" ? "bg-foreground" : "bg-muted-foreground")
                }
              />
              <span>{s.label}</span>
              <span className="ml-auto text-muted-foreground">
                {s.state === "ok" ? "Operational" : "Syncing"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
