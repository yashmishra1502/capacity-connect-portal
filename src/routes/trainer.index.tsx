import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Clock, Award, TrendingUp, Bell } from "lucide-react";
import {
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabaseClient";
import { currentUsers, courses, weeklyProgress, skillRadar } from "@/lib/mock-data";

export const Route = createFileRoute("/trainer/")({
  head: () => ({
    meta: [{ title: "Dashboard — Trainee Portal · Capacity Connect" }],
  }),
  component: TrainerDashboard,
});

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
};

function TrainerDashboard() {
  const { session } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const user = currentUsers.trainee;
  const myCourses = courses.slice(0, 3);

  // Real-Time Notifications Subscription
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    async function fetchNotifications() {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotifications(data);
      }
    }


    fetchNotifications();

    const channel = supabase
      .channel("dashboard-realtime-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.title} · {user.dept}</p>
        </div>

        {/* Live Real-Time Notification Indicator */}
        <div className="relative">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="size-4" />
            {notifications.some((n) => !n.is_read) && (
              <span className="absolute -right-1 -top-1 flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex size-3 rounded-full bg-red-500" />
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="Enrolled courses" value="6" trend="2 in progress" accent="indigo" />
        <StatCard icon={Clock} label="Learning hours" value="64 hrs" trend="+9 hrs this week" trendUp accent="violet" />
        <StatCard icon={TrendingUp} label="Average score" value="86%" trend="Across 4 assessments" trendUp accent="emerald" />
        <StatCard icon={Award} label="Certificates" value="3" trend="1 pending completion" accent="amber" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Learning trend</CardTitle>
            <p className="text-xs text-muted-foreground">Weekly study hours and rolling assessment average</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={weeklyProgress} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="hoursFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="score" stroke="var(--color-chart-1)" fill="url(#scoreFill)" strokeWidth={2} name="Assessment score" />
                <Area type="monotone" dataKey="hours" stroke="var(--color-chart-2)" fill="url(#hoursFill)" strokeWidth={2} name="Study hours" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Skill strength</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={skillRadar}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                <PolarRadiusAxis tick={{ fontSize: 9 }} stroke="var(--color-muted-foreground)" />
                <Radar dataKey="value" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.35} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-display text-sm font-bold">Continue where you left off</CardTitle>
          <Button variant="link" size="sm" className="h-auto px-0 text-xs" asChild>
            <Link to="/trainee/courses">All courses</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {myCourses.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-md border p-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">{c.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{c.code} · {c.trainer}</p>
                <div className="mt-2 w-48">
                  <Progress value={c.progress} className="h-1.5" />
                </div>
              </div>
              <Badge variant="secondary" className="shrink-0 text-[10px]">{c.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
