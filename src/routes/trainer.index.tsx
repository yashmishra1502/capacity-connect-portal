import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Clock, Award, TrendingUp, Bell, Loader2 } from "lucide-react";
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

export const Route = createFileRoute("/trainer/")({
  head: () => ({
    meta: [{ title: "Assessments — Trainee Portal · Capacity Connect" }],
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
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Real database states
  const [userProfile, setUserProfile] = useState<{ name: string; title: string; dept: string } | null>(null);
  const [stats, setStats] = useState({
    enrolledCoursesCount: 0,
    learningHours: "0 hrs",
    avgScore: "0%",
    certificatesCount: 0,
  });
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<any[]>([]);
  const [skillRadar, setSkillRadar] = useState<any[]>([]);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    async function fetchDashboardData() {
      try {
        setLoading(true);

        // 1. Fetch User Profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        const meta = session?.user?.user_metadata || {};
        setUserProfile({
          name: profileData?.full_name || profileData?.name || meta.full_name || meta.name || session?.user?.email?.split("@")[0] || "User",
          title: profileData?.title || meta.title || "Trainee",
          dept: profileData?.department || meta.department || "Engineering",
        });

        // 2. Fetch Notifications
        const { data: notifData } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (notifData) setNotifications(notifData);

        // 3. Fetch Enrolled Courses & Progress
        const { data: enrollments } = await supabase
          .from("enrollments")
          .select("status, progress, courses(id, title, code, trainer)")
          .eq("user_id", userId);

        if (enrollments) {
          const formattedCourses = enrollments.map((e: any) => ({
            id: e.courses?.id,
            title: e.courses?.title || "Untitled Course",
            code: e.courses?.code || "CRS",
            trainer: e.courses?.trainer || "Instructor",
            progress: e.progress || 0,
            status: e.status || "In Progress",
          }));
          setMyCourses(formattedCourses.slice(0, 3));
          setStats((prev) => ({
            ...prev,
            enrolledCoursesCount: enrollments.length,
          }));
        }

        // 4. Fetch Results / Assessment scores for average & stats
        const { data: resultsData } = await supabase
          .from("results")
          .select("score, created_at")
          .eq("user_id", userId);

        if (resultsData && resultsData.length > 0) {
          const totalScore = resultsData.reduce((acc, curr) => acc + (curr.score || 0), 0);
          const avg = Math.round(totalScore / resultsData.length);
          setStats((prev) => ({ ...prev, avgScore: `${avg}%` }));
        }

        // 5. Fetch Dynamic Weekly Progress & Skill Radar if table exists, else fallback gracefully
        const { data: progressData } = await supabase
          .from("weekly_progress")
          .select("*")
          .eq("user_id", userId);
        if (progressData && progressData.length > 0) {
          setWeeklyProgress(progressData);
        }

        const { data: skillsData } = await supabase
          .from("skill_radar")
          .select("*")
          .eq("user_id", userId);
        if (skillsData && skillsData.length > 0) {
          setSkillRadar(skillsData);
        }

      } catch (err) {
        console.error("Error fetching dashboard data from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();

    // Real-Time Notifications Subscription
    const channel = supabase
      .channel("dashboard-realtime-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
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

  if (loading) {
    return (
      <div className="flex h-[350px] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Loading your live assessments...
      </div>
    );
  }

  const displayName = userProfile?.name ? userProfile.name.split(" ")[0] : "User";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Assessments, {displayName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {userProfile?.title} · {userProfile?.dept}
          </p>
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
        <StatCard icon={BookOpen} label="Enrolled courses" value={stats.enrolledCoursesCount.toString()} trend="Active records" accent="indigo" />
        <StatCard icon={Clock} label="Learning hours" value={stats.learningHours} trend="Synced with profile" trendUp accent="violet" />
        <StatCard icon={TrendingUp} label="Average score" value={stats.avgScore} trend="Real-time assessment avg" trendUp accent="emerald" />
        <StatCard icon={Award} label="Certificates" value={stats.certificatesCount.toString()} trend="Verified completions" accent="amber" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Learning trend</CardTitle>
            <p className="text-xs text-muted-foreground">Weekly study hours and rolling assessment average</p>
          </CardHeader>
          <CardContent>
            {weeklyProgress.length > 0 ? (
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
            ) : (
              <div className="flex h-[240px] items-center justify-center text-xs text-muted-foreground">
                No weekly trend data recorded yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Skill strength</CardTitle>
          </CardHeader>
          <CardContent>
            {skillRadar.length > 0 ? (
              <ResponsiveContainer width="100%" height={230}>
                <RadarChart data={skillRadar}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                  <PolarRadiusAxis tick={{ fontSize: 9 }} stroke="var(--color-muted-foreground)" />
                  <Radar dataKey="value" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.35} />
                  <Tooltip contentStyle={tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[230px] items-center justify-center text-xs text-muted-foreground">
                No skill metrics available.
              </div>
            )}
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
          {myCourses.length > 0 ? (
            myCourses.map((c) => (
              <div key={c.id || c.code} className="flex items-center justify-between rounded-md border p-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">{c.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{c.code} · {c.trainer}</p>
                  <div className="mt-2 w-48">
                    <Progress value={c.progress} className="h-1.5" />
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0 text-[10px]">{c.status}</Badge>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">
              You are not currently enrolled in any active courses.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
