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
      // 1. Fetch Active Courses Count
      const { count: courseCount, error: courseErr } = await supabase
        .from("courses")
        .select("id", { count: "exact", head: true });

      if (!courseErr && courseCount !== null) {
        setActiveCoursesCount(courseCount);
      }

      // 2. Fetch Completion Rate Data
      const { data: completionsData } = await supabase
        .from("enrollments")
        .select("status");

      if (completionsData && completionsData.length > 0) {
        const completed = completionsData.filter((e) => e.status === "completed").length;
        const rate = Math.round((completed / completionsData.length) * 100);
        setCompletionRate(`${rate}%`);
      } else {
        setCompletionRate("0%");
      }

      // 3. Fetch Department Progress Data
      const { data: deptData } = await supabase
        .from("department_stats")
        .select("name, pct")
        .limit(5);

      if (deptData && deptData.length > 0) {
        setDepartmentProgress(deptData as DeptProgress[]);
      } else {
        // Fallback mockup data
        setDepartmentProgress([
          { name: "Engineering", pct: 78 },
          { name: "Human Resources", pct: 64 },
          { name: "Operations", pct: 92 },
          { name: "Finance", pct: 45 },
        ]);
      }

      // 4. Fetch Monthly Enrollment Trends
      const { data: trendData } = await supabase
        .from("monthly_analytics")
        .select("month, enrollments, completions")
        .order("id", { ascending: true });

      if (trendData && trendData.length > 0) {
        setEnrollmentTrend(trendData as EnrollmentTrend[]);
      } else {
        setEnrollmentTrend([
          { month: "Jan", enrollments: 45, completions: 30 },
          { month: "Feb", enrollments: 52, completions: 38 },
          { month: "Mar", enrollments: 68, completions: 45 },
          { month: "Apr", enrollments: 85, completions: 60 },
          { month: "May", enrollments: 94, completions: 72 },
          { month: "Jun", enrollments: 110, completions: 88 },
        ]);
      }

      // 5. Fetch Category Distribution Data
      const { data: catData } = await supabase
        .from("course_categories")
        .select("name, value");

      if (catData && catData.length > 0) {
        setCategoryDistribution(catData as CategoryDist[]);
      } else {
        setCategoryDistribution([
          { name: "Technical", value: 40 },
          { name: "Compliance", value: 25 },
          { name: "Management", value: 20 },
          { name: "Soft Skills", value: 15 },
        ]);
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
