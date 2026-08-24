import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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

// Single soft accent, used sparingly, plus neutral grays for everything else
const accent = "var(--color-primary, #6366f1)"; // indigo-ish soft accent — swap token if your theme differs
const pieColors = [accent, "#a5b4fc", "#c7d2fe", "#e0e7ff", "var(--color-muted-foreground)"];

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
      {label}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-none shadow-sm ring-1 ring-border/60">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-primary, #6366f1) 12%, transparent)" }}
        >
          <Icon className="size-5" style={{ color: accent }} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-display text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide overview across courses and approvals.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard icon={BookOpen} label="Active courses" value="—" />
        <StatCard icon={Award} label="Completion rate" value="—" />
      </div>

      <Card className="border-none shadow-sm ring-1 ring-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-sm font-bold">Department completion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {departmentProgress.length === 0 ? (
            <EmptyState label="No department data available yet" />
          ) : (
            departmentProgress.map((d) => (
              <div key={d.name}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium">{d.name}</span>
                  <span className="text-muted-foreground">{d.pct}%</span>
                </div>
                <Progress
                  value={d.pct}
                  className="h-1.5 [&>div]:bg-[var(--color-primary,#6366f1)]"
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-none shadow-sm ring-1 ring-border/60 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Enrollment &amp; completion trend</CardTitle>
            <p className="text-xs text-muted-foreground">Monthly enrollments vs completions</p>
          </CardHeader>
          <CardContent>
            {enrollmentTrend.length === 0 ? (
              <EmptyState label="No enrollment data available yet" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={enrollmentTrend} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="enrollFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={accent} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={accent} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="completeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-muted-foreground)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--color-muted-foreground)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="enrollments" stroke={accent} fill="url(#enrollFill)" strokeWidth={2} name="Enrollments" />
                  <Area type="monotone" dataKey="completions" stroke="var(--color-muted-foreground)" fill="url(#completeFill)" strokeWidth={2} name="Completions" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Courses by category</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryDistribution.length === 0 ? (
              <EmptyState label="No course data available yet" />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                    >
                      {categoryDistribution.map((_, i) => (
                        <Cell key={i} fill={pieColors[i % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-1.5">
                  {categoryDistribution.map((c, i) => (
                    <div key={c.name} className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                        {c.name}
                      </span>
                      <span className="text-muted-foreground">{c.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-sm font-bold">System status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="size-4" style={{ color: accent }} />
            <span>Certificate issuance — Operational</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="size-4" style={{ color: accent }} />
            <span>Assessment engine — Operational</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Clock className="size-4 text-muted-foreground" />
            <span>Trainer matching — Sync in progress</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="size-4" style={{ color: accent }} />
            <span>Access control — Verified</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
