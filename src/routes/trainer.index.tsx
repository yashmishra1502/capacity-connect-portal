import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, BookOpen, CheckCircle2, TrendingUp, Bell, Loader2 } from "lucide-react";
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

// Matches public.notifications
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  time: string;
  unread: boolean;
  sender_role: string | null;
  recipient_role: string | null;
  created_at: string;
}

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
};

// Placeholder trend shown until enough graded results exist to populate
// the real public.trainer_performance_trends view.
const MOCK_PERFORMANCE_TREND = [
  { period: "Apr 2026", score: 61 },
  { period: "May 2026", score: 66 },
  { period: "Jun 2026", score: 70 },
  { period: "Jul 2026", score: 74 },
  { period: "Aug 2026", score: 79 },
  { period: "Sep 2026", score: 83 },
];

function TrainerDashboard() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [trainerProfile, setTrainerProfile] = useState<{
    name: string;
    title: string;
    dept: string;
  } | null>(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeTrainees: 0,
    totalAssessments: 0,
    liveAssessments: 0,
    avgCompletionRate: "0%",
  });
  const [managedCourses, setManagedCourses] = useState<any[]>([]);
  const [myAssessments, setMyAssessments] = useState<any[]>([]);
  const [performanceTrend, setPerformanceTrend] = useState<any[]>([]);
  const [usingMockTrend, setUsingMockTrend] = useState(false);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    async function refreshActiveTraineeCount() {
      const { count } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "trainee")
        .eq("status", "active");

      setStats((prev) => ({ ...prev, activeTrainees: count ?? 0 }));
    }

    async function fetchTrainerDashboardData() {
      try {
        setLoading(true);

        // 1. Trainer profile — public.profiles has full_name/name, dept,
        //    specialization and role. There is no "title"/"department" column,
        //    so derive a display title from specialization/role instead.
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, name, dept, specialization, role")
          .eq("id", userId)
          .maybeSingle();

        const meta = session?.user?.user_metadata || {};
        setTrainerProfile({
          name:
            profileData?.full_name ||
            profileData?.name ||
            meta["full_name"] ||
            meta["name"] ||
            session?.user?.email?.split("@")[0] ||
            "Trainer",
          title: profileData?.specialization || "Senior Instructor",
          dept: profileData?.dept || meta["department"] || "Training Dept",
        });

        // 2. Notifications
        const { data: notifData } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (notifData) setNotifications(notifData as Notification[]);

        // 3. Courses this trainer owns (public.courses.trainer_id)
        const { data: coursesData } = await supabase
          .from("courses")
          .select("id, title, code, created_at")
          .eq("trainer_id", userId)
          .order("created_at", { ascending: false });

        const courseIds = coursesData?.map((c) => c.id) || [];
        setStats((prev) => ({ ...prev, totalCourses: coursesData?.length || 0 }));
        setManagedCourses(coursesData || []);

        // 4. Active trainees — count directly from public.profiles (role = 'trainee'),
        //    since enrollments doesn't reliably reflect registered trainees yet.
        //    Kept live via the realtime subscription below.
        await refreshActiveTraineeCount();

        if (courseIds.length > 0) {
          // 5. Progress for this trainer's courses (trainee_id, not user_id)
          const { data: enrollmentsData } = await supabase
            .from("enrollments")
            .select("trainee_id, progress, status, course_id")
            .in("course_id", courseIds);

          const totalProgress =
            enrollmentsData?.reduce((acc, curr) => acc + (curr.progress || 0), 0) || 0;
          const avgProgress = enrollmentsData?.length
            ? Math.round(totalProgress / enrollmentsData.length)
            : 0;

          setStats((prev) => ({
            ...prev,
            avgCompletionRate: `${avgProgress}%`,
          }));
        }

        // 6. Assessments/quizzes this trainer created (public.assessments.created_by)
        const { data: assessmentsData } = await supabase
          .from("assessments")
          .select("id, title, course, status, questions, attempts, avg, passing_score, created_at")
          .eq("created_by", userId)
          .order("created_at", { ascending: false })
          .limit(5);

        if (assessmentsData) {
          setMyAssessments(assessmentsData);
          const liveCount = assessmentsData.filter((a) =>
            (a.status || "").toLowerCase() === "live",
          ).length;
          setStats((prev) => ({
            ...prev,
            totalAssessments: assessmentsData.length,
            liveAssessments: liveCount,
          }));
        }

        // 6. Trainee performance trend — computed view (public.trainer_performance_trends)
        //    aggregating avg score per month from results on this trainer's assessments.
        const { data: trendData } = await supabase
          .from("trainer_performance_trends")
          .select("period, score")
          .eq("trainer_id", userId)
          .order("period_start", { ascending: true });

        if (trendData && trendData.length > 0) {
          setPerformanceTrend(trendData);
          setUsingMockTrend(false);
        } else {
          // No graded results yet for this trainer's assessments — show
          // sample data so the chart isn't just an empty state.
          setPerformanceTrend(MOCK_PERFORMANCE_TREND);
          setUsingMockTrend(true);
        }
      } catch (err) {
        console.error("Error fetching trainer dashboard data from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrainerDashboardData();

    // Real-time notification listener
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
        },
      )
      // Any registration, role change, or activation/deactivation of a trainee
      // updates the "Active trainees" tile without a page refresh.
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        () => {
          refreshActiveTraineeCount();
        },
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
  const hasUnread = notifications.some((n) => n.unread);

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
            {hasUnread && (
              <span className="absolute -right-1 -top-1 flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex size-3 rounded-full bg-red-500" />
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Managed courses"
          value={stats.totalCourses.toString()}
          trend="Active modules"
          accent="indigo"
        />
        <StatCard
          icon={Users}
          label="Active trainees"
          value={stats.activeTrainees.toString()}
          trend="Enrolled learners"
          trendUp
          accent="violet"
        />
        <StatCard
          icon={CheckCircle2}
          label="Assessments"
          value={stats.totalAssessments.toString()}
          trend={`${stats.liveAssessments} live`}
          accent="amber"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg completion"
          value={stats.avgCompletionRate}
          trend="Trainee progress avg"
          trendUp
          accent="emerald"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
                       <div className="flex items-center gap-2">
              <CardTitle className="font-display text-sm font-bold">
                Trainee progression overview
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              {usingMockTrend
                ? "No graded results yet — showing sample trend until real data comes in"
                : "Avg assessment score per month across your courses"}
            </p>
          </CardHeader>
          <CardContent>
            {performanceTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart
                  data={performanceTrend}
                  margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--color-chart-1)"
                    fill="url(#scoreFill)"
                    strokeWidth={2}
                    name="Avg Score"
                  />
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
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-display text-sm font-bold">My Assessments</CardTitle>
            <Button variant="link" size="sm" className="h-auto px-0 text-xs" asChild>
              <Link to="/trainer/questions">Manage all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {myAssessments.length > 0 ? (
              myAssessments.map((a: any) => {
                const status = (a.status || "").toLowerCase();
                const variant =
                  status === "live" || status === "active"
                    ? "default"
                    : status === "upcoming"
                      ? "outline"
                      : "secondary";
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-md border p-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{a.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {a.course || "No course linked"}
                      </p>
                    </div>
                    <Badge variant={variant} className="shrink-0 text-[10px] capitalize">
                      {status || "draft"}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <div className="flex h-[180px] items-center justify-center text-xs text-muted-foreground text-center">
                No assessments created yet.
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
                <Badge variant="secondary" className="shrink-0 text-[10px]">
                  Active
                </Badge>
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
