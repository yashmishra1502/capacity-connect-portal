import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, BookOpen, CheckCircle2, TrendingUp, Bell, Loader2, Award } from "lucide-react";
import {
  AreaChart,
  Area,
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
    meta: [{ title: "Dashboard — Trainer Portal · Capacity Connect" }],
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
  
  // Real backend states for Trainer
  const [trainerProfile, setTrainerProfile] = useState<{ name: string; title: string; dept: string } | null>(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeTrainees: 0,
    pendingSubmissions: 0,
    avgCompletionRate: "0%",
  });
  const [managedCourses, setManagedCourses] = useState<any[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [performanceTrend, setPerformanceTrend] = useState<any[]>([]);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    async function fetchTrainerDashboardData() {
      try {
        setLoading(true);

        // 1. Fetch Trainer Profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        const meta = session?.user?.user_metadata || {};
        setTrainerProfile({
          name: profileData?.["full_name"] || profileData?.["name"] || meta["full_name"] || meta["name"] || session?.user?.email?.split("@")[0] || "Trainer",
          title: profileData?.["title"] || meta["title"] || "Senior Instructor",
          dept: profileData?.["department"] || meta["department"] || "Training Dept",
        });

        // 2. Fetch Notifications
        const { data: notifData } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (notifData) setNotifications(notifData);

        // 3. Fetch Courses Created/Managed by this Trainer
        const { data: coursesData } = await supabase
          .from("courses")
          .select("id, title, code, created_at")
          .eq("trainer_id", userId); // Adjust column name if your foreign key differs (e.g., trainer_id or instructor_id)

        const courseIds = coursesData?.map((c) => c.id) || [];
        setStats((prev) => ({ ...prev, totalCourses: coursesData?.length || 0 }));
        setManagedCourses(coursesData || []);

        if (courseIds.length > 0) {
          // 4. Fetch Active Trainees & Enrollments for these courses
          const { data: enrollmentsData } = await supabase
            .from("enrollments")
            .select("user_id, progress, status, course_id")
            .in("course_id", courseIds);

          const uniqueTrainees = new Set(enrollmentsData?.map((e) => e.user_id));
          const totalProgress = enrollmentsData?.reduce((acc, curr) => acc + (curr.progress || 0), 0) || 0;
          const avgProgress = enrollmentsData?.length ? Math.round(totalProgress / enrollmentsData.length) : 0;

          setStats((prev) => ({
            ...prev,
            activeTrainees: uniqueTrainees.size,
            avgCompletionRate: `${avgProgress}%`,
          }));
        }

        // 5. Fetch Pending Submissions/Assessments to Review
        const { data: submissionsData } = await supabase
          .from("submissions")
          .select("id, status, created_at, profiles(full_name), courses(title)")
          .eq("status", "pending")
          .limit(5);

        if (submissionsData) {
          setRecentSubmissions(submissionsData);
          setStats((prev) => ({ ...prev, pendingSubmissions: submissionsData.length }));
        }

        // 6. Fetch Trainee Performance Trends (or fallback data)
        const { data: trendData } = await supabase
          .from("trainer_performance_trends")
          .select("*")
          .eq("trainer_id", userId);

        if (trendData && trendData.length > 0) {
          setPerformanceTrend(trendData);
        }

      } catch (err) {
        console.error("Error fetching trainer dashboard data from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrainerDashboardData();

    // Real-Time Notification Listener
    const channel = supabase
      .channel("trainer-dashboard-realtime")
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
        Loading trainer console...
      </div>
    );
  }

  const displayName = trainerProfile?.name ? trainerProfile.name.split(" ")[0] : "Trainer";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Welcome back, {displayName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {trainerProfile?.title} · {trainerProfile?.dept}
          </p>
        </div>

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
        <StatCard icon={BookOpen} label="Managed courses" value={stats.totalCourses.toString()} trend="Active modules" accent="indigo" />
        <StatCard icon={Users} label="Active trainees" value={stats.activeTrainees.toString()} trend="Enrolled learners" trendUp accent="violet" />
        <StatCard icon={CheckCircle2} label="Pending reviews" value={stats.pendingSubmissions.toString()} trend="Action required" accent="amber" />
        <StatCard icon={TrendingUp} label="Avg completion" value={stats.avgCompletionRate} trend="Trainee progress avg" trendUp accent="emerald" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Trainee progression overview</CardTitle>
            <p className="text-xs text-muted-foreground">Overall cohort performance metrics over time</p>
          </CardHeader>
          <CardContent>
            {performanceTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={performanceTrend} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="score" stroke="var(--color-chart-1)" fill="url(#scoreFill)" strokeWidth={2} name="Avg Score" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[240px] items-center justify-center text-xs text-muted-foreground">
                No cohort performance records found.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Pending Assessments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map((sub: any) => (
                <div key={sub.id} className="flex items-center justify-between rounded-md border p-2.5">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{sub.profiles?.full_name || "Trainee"}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{sub.courses?.title || "Course assessment"}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Review</Badge>
                </div>
              ))
            ) : (
              <div className="flex h-[180px] items-center justify-center text-xs text-muted-foreground text-center">
                All caught up! No pending submissions to review.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-display text-sm font-bold">Your Managed Courses</CardTitle>
          <Button variant="link" size="sm" className="h-auto px-0 text-xs" asChild>
            <Link to="/trainer/courses">Manage all</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {managedCourses.length > 0 ? (
            managedCourses.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-md border p-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">{c.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{c.code}</p>
                </div>
                <Badge variant="secondary" className="shrink-0 text-[10px]">Active</Badge>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">
              You haven't been assigned or created any courses yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
