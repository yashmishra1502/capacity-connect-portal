import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardCheck,
  Award,
  Flame,
  Clock,
  ArrowRight,
  CheckCircle2,
  CalendarClock,
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/stat-card";
import { useAuth } from "@/hooks/use-auth";
import "@/styles/dashboard-glass.css";

export const Route = createFileRoute("/trainee/")({
  head: () => ({
    meta: [{ title: "Dashboard — Trainee · Capacity Connect" }],
  }),
  component: TraineeDashboard,
});

const myCourses = [
  { title: "Digital Governance Fundamentals", dept: "Digital Governance", pct: 78, lessonsLeft: 3 },
  { title: "Public Finance Management", dept: "Finance", pct: 45, lessonsLeft: 7 },
  { title: "Rural Development Strategy", dept: "Rural Development", pct: 92, lessonsLeft: 1 },
];

const upcomingAssessments = [
  { title: "Digital Governance — Module 4 Quiz", due: "Tomorrow, 10:00 AM", status: "Not started" },
  { title: "Public Finance — Mid-course Test", due: "3 Aug, 2:00 PM", status: "Not started" },
  { title: "Rural Development — Final Assessment", due: "8 Aug, 11:00 AM", status: "Draft saved" },
];

const certificates = [
  { title: "Foundations of Public Administration", issued: "12 May 2026" },
  { title: "Data Literacy for Departments", issued: "2 Mar 2026" },
];

const weeklyActivity = [
  { day: "Mon", hours: 1.2 },
  { day: "Tue", hours: 2.1 },
  { day: "Wed", hours: 0.8 },
  { day: "Thu", hours: 2.6 },
  { day: "Fri", hours: 1.9 },
  { day: "Sat", hours: 3.2 },
  { day: "Sun", hours: 1.4 },
];

const skillDistribution = [
  { name: "Digital Governance", value: 40 },
  { name: "Finance", value: 30 },
  { name: "Rural Development", value: 30 },
];

const pieColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
];

function TraineeDashboard() {
  const { profile, session } = useAuth();
  const firstName =
    (profile?.name || session?.user?.email?.split("@")[0] || "there").split(" ")[0];

  return (
    <div className="space-y-6">
      <div className="cc-hero-in">
        <h1 className="cc-page-title">
          Welcome back, <span className="cc-gradient-text">{firstName}</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Here's where your learning stands today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="cc-hero-in cc-stagger-1">
          <StatCard icon={BookOpen} label="Enrolled courses" value="3" trend="1 near completion" trendUp accent="indigo" fill={65} />
        </div>
        <div className="cc-hero-in cc-stagger-2">
          <StatCard icon={ClipboardCheck} label="Upcoming assessments" value="3" trend="Next due tomorrow" accent="amber" fill={40} />
        </div>
        <div className="cc-hero-in cc-stagger-3">
          <StatCard icon={Award} label="Certificates earned" value="2" trend="+1 this quarter" trendUp accent="emerald" fill={80} />
        </div>
        <div className="cc-hero-in cc-stagger-4">
          <StatCard icon={Flame} label="Learning streak" value="6 days" trend="Personal best" trendUp accent="violet" fill={90} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="cc-glow-card cc-hero-in lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-display cc-heading text-sm">Continue learning</CardTitle>
              <Button variant="link" size="sm" className="h-auto px-0 text-xs" asChild>
                <Link to="/trainee/courses">View all courses</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {myCourses.map((c) => (
                <div key={c.title} className="cc-row px-2 py-2.5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="cc-icon-chip">
                        <BookOpen className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium leading-tight">{c.title}</p>
                        <p className="text-[11px] text-muted-foreground">{c.dept}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-[11px] text-muted-foreground">
                        {c.lessonsLeft} lesson{c.lessonsLeft === 1 ? "" : "s"} left
                      </span>
                      <Button size="sm" className="h-7 gap-1 px-2.5 text-xs cc-btn-glass">
                        Continue <ArrowRight className="size-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-[3.25rem]">
                    <Progress value={c.pct} className="h-1.5" />
                    <span className="w-9 shrink-0 text-right text-[11px] text-muted-foreground">
                      {c.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="cc-glow-card cc-hero-in cc-stagger-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display cc-heading text-sm">Upcoming assessments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAssessments.map((a) => (
                <div key={a.title} className="cc-row flex items-start gap-2.5 px-2 py-2">
                  <span className="cc-icon-chip !h-7 !w-7 !rounded-lg">
                    <CalendarClock className="size-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium leading-snug">{a.title}</p>
                    <p className="text-[10.5px] text-muted-foreground">{a.due}</p>
                    <Badge variant="secondary" className="mt-1 text-[9px] font-medium">
                      {a.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="cc-glow-card cc-hero-in lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display cc-heading text-sm">Weekly learning activity</CardTitle>
              <p className="text-xs text-muted-foreground">Hours spent learning this week</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={weeklyActivity} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hoursFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
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
                  <Area type="monotone" dataKey="hours" stroke="var(--color-chart-1)" fill="url(#hoursFill)" strokeWidth={2} name="Hours" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="cc-glow-card cc-hero-in cc-stagger-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display cc-heading text-sm">Skill distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    {skillDistribution.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
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
                      <span className="size-2 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                      {c.name}
                    </span>
                    <span className="text-muted-foreground">{c.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="cc-glow-card cc-hero-in">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-display cc-heading text-sm">Certificates & achievements</CardTitle>
            <Button variant="link" size="sm" className="h-auto px-0 text-xs" asChild>
              <Link to="/trainee/profile">View profile</Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {certificates.map((cert) => (
              <div key={cert.title} className="cc-row flex items-center gap-3 border border-border/60 px-3 py-2.5">
                <span className="cc-icon-chip !bg-none !bg-emerald-500/15 !shadow-none">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                </span>
                <div>
                  <p className="text-xs font-medium leading-tight">{cert.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-muted-foreground">
                    <Clock className="size-3" /> Issued {cert.issued}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
