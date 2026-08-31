import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
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
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Dashboard — Administration · Capacity Connect" }],
  }),
  component: AdminDashboard,
});

type DeptProgress = {
  name: string;
  pct: number;
};

type EnrollmentTrend = {
  month: string;
  enrollments: number;
  completions: number;
};

type CategoryDist = {
  name: string;
  value: number;
};

const accent = "#818cf8";
const pieColors = [accent, "#a5b4fc", "#c7d2fe", "#e0e7ff", "#94a3b8"];

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function Glass({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "rounded-2xl border border-white/30 bg-white/40 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 " +
        className
      }
    >
      {children}
    </div>
  );
}

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
  value: string | number;
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

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeCoursesCount, setActiveCoursesCount] = useState<number | string>("—");
  const [completionRate, setCompletionRate] = useState<string>("—");
  const [departmentProgress, setDepartmentProgress] = useState<DeptProgress[]>([]);
  const [enrollmentTrend, setEnrollmentTrend] = useState<EnrollmentTrend[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDist[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      // 1. Active courses — published courses only
      const { count: courseCount, error: courseErr } = await supabase
        .from("courses")
        .select("id", { count: "exact", head: true })
        .eq("published", true);

      if (!courseErr && courseCount !== null) {
        setActiveCoursesCount(courseCount);
      } else {
        setActiveCoursesCount(0);
      }

      // 2. Enrollments — used for completion rate, department progress & trend
      const { data: enrollments, error: enrollErr } = await supabase
        .from("enrollments")
        .select("trainee_id, status, date");

      if (enrollErr) throw enrollErr;

      const enrollmentsList = enrollments ?? [];

      // Completion rate
      if (enrollmentsList.length > 0) {
        const completed = enrollmentsList.filter((e) => e.status === "completed").length;
        const rate = Math.round((completed / enrollmentsList.length) * 100);
        setCompletionRate(`${rate}%`);
      } else {
        setCompletionRate("0%");
      }

      // 3. Department progress — join enrollments -> profiles.dept
      if (enrollmentsList.length > 0) {
        const traineeIds = Array.from(
          new Set(enrollmentsList.map((e) => e.trainee_id).filter(Boolean))
        );

        const { data: profilesData, error: profilesErr } = await supabase
          .from("profiles")
          .select("id, dept")
          .in("id", traineeIds);

        if (profilesErr) throw profilesErr;

        const deptById = new Map(
          (profilesData ?? []).map((p) => [p.id, p.dept ?? "Unassigned"])
        );

        const deptTotals = new Map<string, { total: number; completed: number }>();

        for (const e of enrollmentsList) {
          const dept = deptById.get(e.trainee_id) ?? "Unassigned";
          const entry = deptTotals.get(dept) ?? { total: 0, completed: 0 };
          entry.total += 1;
          if (e.status === "completed") entry.completed += 1;
          deptTotals.set(dept, entry);
        }

        const deptProgress: DeptProgress[] = Array.from(deptTotals.entries())
          .map(([name, { total, completed }]) => ({
            name,
            pct: Math.round((completed / total) * 100),
          }))
          .sort((a, b) => b.pct - a.pct)
          .slice(0, 5);

        setDepartmentProgress(deptProgress);
      } else {
        // Fallback mockup data — shown until real enrollment data exists
        setDepartmentProgress([
          { name: "abcd", pct: 78 },
          { name: "Digital Marketing", pct: 64 },
          { name: "IT Supports", pct: 92 },
        ]);
      }

      // 4. Monthly enrollment & completion trend — derived from enrollments.date
      if (enrollmentsList.length > 0) {
        const trendMap = new Map<string, { enrollments: number; completions: number; sortKey: string }>();

        for (const e of enrollmentsList) {
          if (!e.date) continue;
          const d = new Date(e.date);
          const monthLabel = MONTH_LABELS[d.getMonth()];
          const sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

          const entry = trendMap.get(sortKey) ?? {
            enrollments: 0,
            completions: 0,
            sortKey,
          };
          entry.enrollments += 1;
          if (e.status === "completed") entry.completions += 1;
          trendMap.set(sortKey, { ...entry, sortKey });

          // store label alongside for later mapping
          (trendMap.get(sortKey) as any).month = monthLabel;
        }

        const trend: EnrollmentTrend[] = Array.from(trendMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([, v]: [string, any]) => ({
            month: v.month,
            enrollments: v.enrollments,
            completions: v.completions,
          }));

        setEnrollmentTrend(trend);
      } else {
        // Fallback mockup data — shown until real enrollment data exists
        setEnrollmentTrend([
          { month: "Jan", enrollments: 45, completions: 30 },
          { month: "Feb", enrollments: 52, completions: 38 },
          { month: "Mar", enrollments: 68, completions: 45 },
          { month: "Apr", enrollments: 85, completions: 60 },
          { month: "May", enrollments: 94, completions: 72 },
          { month: "Jun", enrollments: 110, completions: 88 },
        ]);
      }

      // 5. Category distribution — derived from courses.category
      const { data: coursesData, error: coursesErr } = await supabase
        .from("courses")
        .select("category");

      if (coursesErr) throw coursesErr;

      const coursesList = coursesData ?? [];

      if (coursesList.length > 0) {
        const catCounts = new Map<string, number>();
        for (const c of coursesList) {
          const cat = c.category ?? "Uncategorized";
          catCounts.set(cat, (catCounts.get(cat) ?? 0) + 1);
        }

        const total = coursesList.length;
        const catDist: CategoryDist[] = Array.from(catCounts.entries())
          .map(([name, count]) => ({
            name,
            value: Math.round((count / total) * 100),
          }))
          .sort((a, b) => b.value - a.value);

        setCategoryDistribution(catDist);
      } else {
        setCategoryDistribution([]);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div
      className="space-y-6 rounded-3xl p-6"
      style={{
        background:
          "radial-gradient(circle at 15% 10%, rgba(129,140,248,0.25), transparent 45%), radial-gradient(circle at 85% 30%, rgba(56,189,248,0.18), transparent 40%), radial-gradient(circle at 50% 90%, rgba(217,119,255,0.15), transparent 45%)",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform-wide overview across courses and approvals.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchDashboardData}
          disabled={loading}
          className="gap-2 border-white/20 bg-white/20 backdrop-blur-md hover:bg-white/30"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Sync Data
        </Button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={BookOpen}
          label="Active courses"
          value={loading ? "Loading..." : activeCoursesCount}
        />
        <StatCard
          icon={Award}
          label="Completion rate"
          value={loading ? "Loading..." : completionRate}
        />
      </div>

      {/* Department Progress Bar */}
      <Glass className="p-5">
        <h2 className="font-display text-sm font-bold">Department completion</h2>
        <div className="mt-4 space-y-4">
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
                  className="h-1.5 bg-white/40 [&>div]:bg-[#818cf8]"
                />
              </div>
            ))
          )}
        </div>
      </Glass>

      {/* Analytics Visualizations */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Trend Area Chart */}
        <Glass className="p-5 lg:col-span-2">
          <h2 className="font-display text-sm font-bold">
            Enrollment &amp; completion trend
          </h2>
          <p className="text-xs text-muted-foreground">
            Monthly enrollments vs completions
          </p>
          <div className="mt-3">
            {enrollmentTrend.length === 0 ? (
              <EmptyState label="No enrollment data available yet" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart
                  data={enrollmentTrend}
                  margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="enrollFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={accent} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={accent} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="completeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148,163,184,0.25)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                    stroke="var(--color-muted-foreground)"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="var(--color-muted-foreground)"
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.4)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="enrollments"
                    stroke={accent}
                    fill="url(#enrollFill)"
                    strokeWidth={2}
                    name="Enrollments"
                  />
                  <Area
                    type="monotone"
                    dataKey="completions"
                    stroke="#38bdf8"
                    fill="url(#completeFill)"
                    strokeWidth={2}
                    name="Completions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Glass>

        {/* Category Distribution Pie Chart */}
        <Glass className="p-5">
          <h2 className="font-display text-sm font-bold">Courses by category</h2>
          <div className="mt-3">
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
                      paddingAngle={3}
                    >
                      {categoryDistribution.map((_, i) => (
                        <Cell
                          key={i}
                          fill={pieColors[i % pieColors.length]}
                          fillOpacity={0.85}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.4)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-1.5">
                  {categoryDistribution.map((c, i) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between text-[11px]"
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className="size-2 rounded-full"
                          style={{
                            background: pieColors[i % pieColors.length],
                          }}
                        />
                        {c.name}
                      </span>
                      <span className="text-muted-foreground">{c.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Glass>
      </div>

      {/* System Operational Status */}
      <Glass className="p-5">
        <h2 className="font-display text-sm font-bold">System status</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/30 px-3 py-2 text-xs backdrop-blur-md dark:border-white/10 dark:bg-white/5">
            <CheckCircle2 className="size-4" style={{ color: accent }} />
            <span>Certificate issuance — Operational</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/30 px-3 py-2 text-xs backdrop-blur-md dark:border-white/10 dark:bg-white/5">
            <CheckCircle2 className="size-4" style={{ color: accent }} />
            <span>Assessment engine — Operational</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/30 px-3 py-2 text-xs backdrop-blur-md dark:border-white/10 dark:bg-white/5">
            <Clock className="size-4 text-muted-foreground" />
            <span>Trainer matching — Sync in progress</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/30 px-3 py-2 text-xs backdrop-blur-md dark:border-white/10 dark:bg-white/5">
            <ShieldCheck className="size-4" style={{ color: accent }} />
            <span>Access control — Verified</span>
          </div>
        </div>
      </Glass>
    </div>
  );
}
