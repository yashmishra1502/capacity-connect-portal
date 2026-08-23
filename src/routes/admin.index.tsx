import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  BookOpen,
  ClipboardCheck,
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
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/stat-card";
import { enrollmentTrend, categoryDistribution } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Dashboard — Administration · Capacity Connect" }],
  }),
  component: AdminDashboard,
});

const pendingApprovals = [
  { name: "Rohan Verma", role: "Trainer", dept: "Rural Development", time: "2h ago" },
  { name: "Ananya Sharma", role: "Trainee", dept: "Finance", time: "4h ago" },
  { name: "Vikram Singh", role: "Trainer", dept: "Digital Governance", time: "6h ago" },
  { name: "Priya Nair", role: "Trainee", dept: "Health", time: "1d ago" },
];

const departmentProgress = [
  { name: "Rural Development", pct: 82 },
  { name: "Digital Governance", pct: 68 },
  { name: "Finance", pct: 74 },
  { name: "Health", pct: 59 },
];

const pieColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide overview across users, courses and approvals.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total users" value="4,826" trend="+312 this month" trendUp accent="indigo" />
        <StatCard icon={ClipboardCheck} label="Pending approvals" value="17" trend="Needs review" accent="amber" />
        <StatCard icon={BookOpen} label="Active courses" value="86" trend="+6 this month" trendUp accent="violet" />
        <StatCard icon={Award} label="Completion rate" value="78%" trend="+4.2%" trendUp accent="emerald" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-display text-sm font-bold">Pending approvals</CardTitle>
            <Button variant="link" size="sm" className="h-auto px-0 text-xs" asChild>
              <a href="/admin/approvals">View all</a>
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {pendingApprovals.map((a) => (
              <div key={a.name} className="flex items-center justify-between rounded-md px-2 py-2.5 hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                    {a.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground">{a.dept}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-[10px] font-medium">{a.role}</Badge>
                  <span className="hidden text-[10px] text-muted-foreground sm:inline">{a.time}</span>
                  <Button size="sm" className="h-7 px-2.5 text-xs">Review</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Department completion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentProgress.map((d) => (
              <div key={d.name}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium">{d.name}</span>
                  <span className="text-muted-foreground">{d.pct}%</span>
                </div>
                <Progress value={d.pct} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Enrollment &amp; completion trend</CardTitle>
            <p className="text-xs text-muted-foreground">Monthly enrollments vs completions</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={enrollmentTrend} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="enrollFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="completeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0} />
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
                <Area type="monotone" dataKey="enrollments" stroke="var(--color-chart-1)" fill="url(#enrollFill)" strokeWidth={2} name="Enrollments" />
                <Area type="monotone" dataKey="completions" stroke="var(--color-chart-3)" fill="url(#completeFill)" strokeWidth={2} name="Completions" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Courses by category</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-sm font-bold">System status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span>Certificate issuance — Operational</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span>Assessment engine — Operational</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Clock className="size-4 text-amber-500" />
            <span>Trainer matching — Sync in progress</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>Access control — Verified</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
