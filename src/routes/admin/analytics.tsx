import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Users, BookOpen, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Glass, GlassBackground, accent } from "@/components/glass-ui";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [{ title: "Analytics — Administration · Capacity Connect" }],
  }),
  component: Analytics,
});

// TODO: replace with real API data
const engagementTrend: { month: string; activeUsers: number; avgHours: number }[] = [];
const coursePerformance: { name: string; completions: number; dropouts: number }[] = [];
const departmentActivity: { name: string; hours: number }[] = [];

const glassTooltip = {
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.4)",
  borderRadius: 12,
  fontSize: 12,
};

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-[220px] items-center justify-center text-xs text-muted-foreground">
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
    <Glass className="flex items-center gap-4 p-5">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
        <Icon className="size-5" style={{ color: accent }} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-display text-xl font-bold">{value}</p>
      </div>
    </Glass>
  );
}

function Analytics() {
  return (
    <GlassBackground>
      <div>
        <h1 className="font-display text-xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide engagement, performance, and usage insights.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Active users" value="—" />
        <StatCard icon={BookOpen} label="Avg. completion rate" value="—" />
        <StatCard icon={Clock} label="Avg. hours / trainee" value="—" />
        <StatCard icon={TrendingUp} label="Engagement growth" value="—" />
      </div>

      <Glass className="p-5">
        <h2 className="font-display text-sm font-bold">Engagement trend</h2>
        <p className="text-xs text-muted-foreground">Active users vs average hours spent per month</p>
        <div className="mt-3">
          {engagementTrend.length === 0 ? (
            <EmptyState label="No engagement data available yet" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={engagementTrend} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <Tooltip contentStyle={glassTooltip} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke={accent}
                  strokeWidth={2}
                  name="Active Users"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="avgHours"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  name="Avg Hours"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Glass>

      <div className="grid gap-4 lg:grid-cols-2">
        <Glass className="p-5">
          <h2 className="font-display text-sm font-bold">Course performance</h2>
          <p className="text-xs text-muted-foreground">Completions vs dropouts by course</p>
          <div className="mt-3">
            {coursePerformance.length === 0 ? (
              <EmptyState label="No course performance data yet" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={coursePerformance} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={glassTooltip} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="completions" fill={accent} fillOpacity={0.85} name="Completions" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="dropouts" fill="#fca5a5" fillOpacity={0.85} name="Dropouts" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Glass>

        <Glass className="p-5">
          <h2 className="font-display text-sm font-bold">Department activity</h2>
          <p className="text-xs text-muted-foreground">Total training hours logged</p>
          <div className="mt-3">
            {departmentActivity.length === 0 ? (
              <EmptyState label="No department activity data yet" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={departmentActivity}
                  layout="vertical"
                  margin={{ left: 10, right: 10, top: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    stroke="var(--color-muted-foreground)"
                    width={90}
                  />
                  <Tooltip contentStyle={glassTooltip} />
                  <Bar dataKey="hours" fill="#a5b4fc" fillOpacity={0.85} name="Hours" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Glass>
      </div>
    </GlassBackground>
  );
}
