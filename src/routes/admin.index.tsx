import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
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

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Dashboard — Administration · Capacity Connect" }],
  }),
  component: AdminDashboard,
});

// TODO: replace with real API data
const departmentProgress: { name: string; pct: number }[] = [];
const enrollmentTrend: { month: string; enrollments: number; completions: number }[] = [];
const categoryDistribution: { name: string; value: number }[] = [];

const accent = "#818cf8"; // soft indigo accent for glass highlights
const pieColors = [accent, "#a5b4fc", "#c7d2fe", "#e0e7ff", "#94a3b8"];

// Reusable glass panel — frosted background, soft border, subtle shadow
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

function AdminDashboard() {
  return (
    <div
      className="space-y-6 rounded-3xl p-6"
      style={{
        background:
          "radial-gradient(circle at 15% 10%, rgba(129,140,248,0.25), transparent 45%), radial-gradient(circle at 85% 30%, rgba(56,189,248,0.18), transparent 40%), radial-gradient(circle at 50% 90%, rgba(217,119,255,0.15), transparent 45%)",
      }}
    >
      <div>
        <h1 className="font-display text-xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide overview across courses and approvals.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard icon={BookOpen} label="Active courses" value="—" />
        <StatCard icon={Award} label="Completion rate" value="—" />
      </div>

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
                <Progress value={d.pct} className="h-1.5 bg-white/40 [&>div]:bg-[#818cf8]" />
              </div>
            ))
          )}
        </div>
      </Glass>

      <div className="grid gap-4 lg:grid-cols-3">
        <Glass className="p-5 lg:col-span-2">
          <h2 className="font-display text-sm font-bold">Enrollment &amp; completion trend</h2>
          <p className="text-xs text-muted-foreground">Monthly enrollments vs completions</p>
          <div className="mt-3">
            {enrollmentTrend.length === 0 ? (
              <EmptyState label="No enrollment data available yet" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={enrollmentTrend} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.4)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="enrollments" stroke={accent} fill="url(#enrollFill)" strokeWidth={2} name="Enrollments" />
                  <Area type="monotone" dataKey="completions" stroke="#38bdf8" fill="url(#completeFill)" strokeWidth={2} name="Completions" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Glass>

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
                        <Cell key={i} fill={pieColors[i % pieColors.length]} fillOpacity={0.85} />
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
                    <div key={c.name} className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
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
