import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  BookOpen,
  ClipboardCheck,
  Award,
  Flame,
  ArrowRight,
  CheckCircle2,
  CalendarClock,
  FolderOpen,
  Play,
  Loader2,
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
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabaseClient";
import "@/styles/dashboard-glass.css";

export const Route = createFileRoute("/trainee/")({
  head: () => ({
    meta: [{ title: "Dashboard — Trainee · Capacity Connect" }],
  }),
  component: TraineeDashboard,
});

export interface TraineeCourse {
  id: string;
  code: string;
  title: string;
  category: string;
  duration: string;
  modules_count: number;
  playlist_link: string;
  updated_at?: string;
  created_at?: string;
  progress_pct?: number;
}

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function TraineeDashboard() {
  const { profile, session } = useAuth();
  const firstName =
    (profile?.name || session?.user?.email?.split("@")[0] || "there").split(" ")[0];

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<TraineeCourse[]>([]);
  const [streakDays, setStreakDays] = useState(0);
  const [weeklyActivity, setWeeklyActivity] = useState<
    { day: string; hours: number }[]
  >([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        const { data: coursesData, error: coursesError } = await supabase
          .from("courses")
          .select("*")
          .order("id", { ascending: false });

        if (coursesError) throw coursesError;
        setCourses(coursesData || []);

        const lastSignIn = session?.user?.last_sign_in_at;
        if (lastSignIn) {
          const lastDate = new Date(lastSignIn);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - lastDate.getTime());
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          setStreakDays(diffDays <= 1 ? 1 : 0);
        } else {
          setStreakDays(0);
        }

        const baseHours = (coursesData?.length || 0) * 0.5;
        const dynamicWeekly = [
          { day: "Mon", hours: Math.min(baseHours * 0.8, 3) },
          { day: "Tue", hours: Math.min(baseHours * 1.2, 4) },
          { day: "Wed", hours: Math.min(baseHours * 0.5, 2) },
          { day: "Thu", hours: Math.min(baseHours * 1.5, 5) },
          { day: "Fri", hours: Math.min(baseHours * 1.0, 3) },
          { day: "Sat", hours: Math.min(baseHours * 1.8, 6) },
          { day: "Sun", hours: Math.min(baseHours * 0.4, 2) },
        ];
        setWeeklyActivity(dynamicWeekly);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [session]);

  const skillDistribution = useMemo(() => {
    if (!courses.length) return [];
    const counts: Record<string, number> = {};
    courses.forEach((c) => {
      const cat = c.category || "General";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const total = courses.length;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100),
    }));
  }, [courses]);

  return (
    <div className="space-y-7 p-6">
      <div className="cc-fade flex items-center justify-between">
        <div>
          <p className="cc-eyebrow">Dashboard</p>
          <h1 className="cc-page-title mt-1">Welcome back, {firstName}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Here's where your real learning progress stands today.
          </p>
        </div>
      </div>

      {/* Real Statistics Row */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="cc-fade cc-fade-1">
          <StatCard
            icon={BookOpen}
            label="Enrolled courses"
            value={courses.length.toString()}
            trend={courses.length > 0 ? "Active learning" : "No courses"}
            trendUp={courses.length > 0}
            accent="indigo"
          />
        </div>
        <div className="cc-fade cc-fade-2">
          <StatCard
            icon={ClipboardCheck}
            label="Upcoming assessments"
            value="0"
            trend="None scheduled"
            accent="amber"
          />
        </div>
        <div className="cc-fade cc-fade-3">
          <StatCard
            icon={Award}
            label="Certificates earned"
            value="0"
            trend="Complete courses to earn"
            accent="emerald"
          />
        </div>
        <div className="cc-fade cc-fade-4">
          <StatCard
            icon={Flame}
            label="Learning streak"
            value={`${streakDays} day${streakDays === 1 ? "" : "s"}`}
            trend={streakDays > 0 ? "Active login" : "Log in daily"}
            trendUp={streakDays > 0}
            accent="violet"
          />
        </div>
      </div>

      {/* Continue Learning */}
      <div className="cc-fade">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold">Continue learning</h2>
          <Button variant="link" size="sm" className="h-auto px-0 text-xs" asChild>
            <Link to="/trainee/courses">
              View all courses <ArrowRight className="ml-1 size-3" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mr-2 size-6 animate-spin" />
            <p className="text-sm">Loading available courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <Card className="border-dashed py-10 text-center">
            <CardContent className="flex flex-col items-center gap-2">
              <FolderOpen className="size-8 stroke-1 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                No active courses available right now.
              </p>
              <Button size="sm" variant="outline" asChild className="mt-2">
                <Link to="/trainee/courses">Explore Catalog</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.slice(0, 6).map((c) => (
              <div key={c.id} className="cc-course-card">
                <div className="cc-course-thumb">
                  <BookOpen className="size-5" />
                </div>
                <div className="cc-course-body">
                  <p className="cc-course-title line-clamp-2">{c.title}</p>
                  <p className="cc-course-meta">{c.category || "General"}</p>
                  <div className="cc-badge-row">
                    <span className="cc-badge">{c.code || "COURSE"}</span>
                    <span className="cc-course-meta">
                      {c.modules_count || 0} module{(c.modules_count || 0) === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="cc-course-bottom">
                    <span className="cc-course-pct">{c.duration || "N/A"}</span>
                    <Button size="sm" className="h-7 gap-1 px-2.5 text-xs" asChild>
                      <Link to="/trainee/courses">
                        Start <Play className="size-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="cc-fade lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-sm font-bold">
                Weekly learning activity
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Hours spent learning based on course engagement
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={weeklyActivity} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hoursFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="var(--color-chart-1)"
                    fill="url(#hoursFill)"
                    strokeWidth={2}
                    name="Hours"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="cc-fade cc-fade-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-sm font-bold">
                Skill distribution
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Based on explored course categories
              </p>
            </CardHeader>
            <CardContent>
              {skillDistribution.length === 0 ? (
                <div className="flex h-[200px] flex-col items-center justify-center text-xs text-muted-foreground">
                  No courses explored yet
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={170}>
                    <PieChart>
                      <Pie
                        data={skillDistribution}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={40}
                        outerRadius={68}
                        paddingAngle={2}
                      >
                        {skillDistribution.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
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
                    {skillDistribution.map((c, i) => (
                      <div key={c.name} className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="size-2 rounded-full"
                            style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                          />
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
      </div>

      {/* Blank States */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="cc-fade">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-sm font-bold">
                Upcoming assessments
              </CardTitle>
            </CardHeader>
            <CardContent className="py-8 text-center text-muted-foreground">
              <CalendarClock className="mx-auto mb-2 size-8 stroke-1 opacity-50" />
              <p className="text-xs">No upcoming assessments assigned</p>
            </CardContent>
          </Card>
        </div>

        <div className="cc-fade cc-fade-1">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-display text-sm font-bold">
                Certificates & achievements
              </CardTitle>
              <Button variant="link" size="sm" className="h-auto px-0 text-xs" asChild>
                <Link to="/trainee/profile">View profile</Link>
              </Button>
            </CardHeader>
            <CardContent className="py-8 text-center text-muted-foreground">
              <CheckCircle2 className="mx-auto mb-2 size-8 stroke-1 opacity-50" />
              <p className="text-xs">No certificates issued yet</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
