import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Section, StatCard, StatusBadge } from "@/components/kit";
import { courses, notifications, results, weeklyProgress, currentUsers } from "@/lib/mock-data";

export const Route = createFileRoute("/trainee/")({
  component: TraineeDashboard,
});

function TraineeDashboard() {
  const user = currentUsers.trainee;
  const active = courses.filter((c) => c.status === "In Progress");

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        subtitle={`${user.title} · ${user.dept}`}
        actions={
          <Button asChild>
            <Link to="/trainee/courses">Continue learning</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Enrolled courses" value={6} hint="2 in progress" />
        <StatCard label="Learning hours" value="64 hrs" hint="+9 hrs this week" tone="info" />
        <StatCard label="Average score" value="86%" hint="Across 4 assessments" tone="success" />
        <StatCard label="Certificates" value={3} hint="1 pending completion" tone="warning" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Section
          title="Learning trend"
          description="Weekly study hours and rolling assessment average"
          className="lg:col-span-2"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyProgress}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-chart-1)"
                  fill="url(#g1)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="var(--color-chart-2)"
                  fill="transparent"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Upcoming" description="Next 7 days">
          <ul className="space-y-4">
            {[
              ["PPGOV-101 Final Assessment", "23 Aug · 09:00 IST", "Assessment"],
              ["Live session: Policy Drafting", "24 Aug · 15:00 IST", "Session"],
              ["FIN-311 Module 5 deadline", "26 Aug · 23:59 IST", "Deadline"],
              ["Feedback form — LEAD-150", "28 Aug", "Feedback"],
            ].map(([t, d, tag]) => (
              <li key={t} className="flex items-start justify-between gap-2 border-b pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium">{t}</p>
                  <p className="text-xs text-muted-foreground">{d}</p>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {tag}
                </Badge>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Section
          title="Continue where you left off"
          className="lg:col-span-2"
          actions={
            <Button asChild variant="outline" size="sm">
              <Link to="/trainee/courses">All courses</Link>
            </Button>
          }
        >
          <div className="space-y-4">
            {active.map((c) => (
              <div key={c.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.code} · {c.trainer} · {c.modules} modules
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={c.progress} className="h-2" />
                  <span className="w-10 text-right text-xs tabular-nums">{c.progress}%</span>
                  <Button asChild size="sm" variant="secondary">
                    <Link to="/trainee/courses/$courseId" params={{ courseId: c.id }}>
                      Resume
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div className="space-y-6">
          <Section title="Recent results">
            <ul className="space-y-3">
              {results.slice(0, 3).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.assessment}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{r.score}%</span>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Notifications">
            <ul className="space-y-3">
              {notifications.slice(0, 3).map((n) => (
                <li key={n.id}>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.time}</p>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </>
  );
}
