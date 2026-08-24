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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";

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

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-[220px] items-center justify-center text-xs text-muted-foreground">
      {label}
    </div>
  );
}

function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide engagement, performance, and usage insights.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Active users" value="—" accent="violet" />
        <StatCard icon={BookOpen} label="Avg. completion rate" value="—" accent="emerald" />
        <StatCard icon={Clock} label="Avg. hours / trainee" value="—" accent="amber" />
        <StatCard icon={TrendingUp} label="Engagement growth" value="—" accent="violet" />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-sm font-bold">Engagement trend</CardTitle>
          <p className="text-xs text-muted-foreground">Active users vs average hours spent per month</p>
        </CardHeader>
        <CardContent>
          {engagementTrend.length === 0 ? (
            <EmptyState label="No engagement data available yet" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={engagementTrend} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
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
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  name="Active Users"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="avgHours"
                  stroke="var(--color-chart-3)"
                  strokeWidth={2}
                  name="Avg Hours"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Course performance</CardTitle>
            <p className="text-xs text-muted-foreground">Completions vs dropouts by course</p>
          </CardHeader>
          <CardContent>
            {coursePerformance.length === 0 ? (
              <EmptyState label="No course performance data yet" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={coursePerformance} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="completions" fill="var(--color-chart-1)" name="Completions" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="dropouts" fill="var(--color-chart-4)" name="Dropouts" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Department activity</CardTitle>
            <p className="text-xs text-muted-foreground">Total training hours logged</p>
          </CardHeader>
          <CardContent>
            {departmentActivity.length === 0 ? (
              <EmptyState label="No department activity data yet" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={departmentActivity}
                  layout="vertical"
                  margin={{ left: 10, right: 10, top: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    stroke="var(--color-muted-foreground)"
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="hours" fill="var(--color-chart-2)" name="Hours" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
