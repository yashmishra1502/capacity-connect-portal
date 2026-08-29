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
  Landmark,
  Sprout,
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
import { StatCard } from "@/components/stat-card";
import { useAuth } from "@/hooks/use-auth";
import "@/styles/dashboard-glass.css";

export const Route = createFileRoute("/trainee/")({
  head: () => ({
    meta: [{ title: "Dashboard — Trainee · Capacity Connect" }],
  }),
  component: TraineeDashboard,
});

const accentMap = {
  indigo: "oklch(0.58 0.18 275)",
  emerald: "oklch(0.6 0.14 155)",
  amber: "oklch(0.72 0.16 75)",
} as const;

const myCourses = [
  {
    title: "Digital Governance Fundamentals",
    dept: "Digital Governance",
    pct: 78,
    lessonsLeft: 3,
    badge: "Bestseller",
    icon: BookOpen,
    accent: "indigo" as const,
  },
  {
    title: "Public Finance Management",
    dept: "Finance",
    pct: 45,
    lessonsLeft: 7,
    badge: "Popular",
    icon: Landmark,
    accent: "amber" as const,
  },
  {
    title: "Rural Development Strategy",
    dept: "Rural Development",
    pct: 92,
    lessonsLeft: 1,
    badge: "Almost done",
    icon: Sprout,
    accent: "emerald" as const,
  },
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
    <div className="space-y-7">
      <div className="cc-fade">
        <p className="cc-eyebrow">Dashboard</p>
        <h1 className="cc-page-title mt-1">Welcome back, {firstName}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Here's where your learning stands today.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="cc-fade cc-fade-1">
          <StatCard icon={BookOpen} label="Enrolled courses" value="3" trend="1 near completion" trendUp accent="indigo" />
        </div>
        <div className="cc-fade cc-fade-2">
          <StatCard icon={ClipboardCheck} label="Upcoming assessments" value="3" trend="Next due tomorrow" accent="amber" />
        </div>
        <div className="cc-fade cc-fade-3">
          <StatCard icon={Award} label="Certificates earned" value="2" trend="+1 this quarter" trendUp accent="emerald" />
        </div>
        <div className="cc-fade cc-fade-4">
          <StatCard icon={Flame} label="Learning streak" value="6 days" trend="Personal best" trendUp accent="violet" />
        </div>
      </div>

      <div className="cc-fade">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold">Continue learning</h2>
          <Button variant="link" size="sm" className="h-auto px-0 text-xs" asChild>
            <Link to="/trainee/courses">
              View all courses <ArrowRight className="ml-1 size-3" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {myCourses.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="cc-course-card"
                style={{ "--cc-accent": accentMap[c.accent] } as React.CSSProperties}
              >
                <div className="cc-course-thumb">
                  <Icon />
                </div>
                <div className="cc-course-body">
                  <p className="cc-course-title line-clamp-2">{c.title}</p>
                  <p className="cc-course-meta">{c.dept}</p>
                  <div className="cc-badge-row">
                    <span className="cc-badge">{c.badge}</span>
                    <span className="cc-course-meta">{c.lessonsLeft} lesson{c.lessonsLeft === 1 ? "" : "s"} left</span>
                  </div>
                  <div className="cc-course-bottom">
                    <span className="cc-course-pct">{c.pct}%</span>
                    <Button size="sm" className="h-7 gap-1 px-2.5 text-xs">
                      Continue <ArrowRight className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="cc-fade lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-sm font-bold">Weekly learning activity</CardTitle>
              <p className="text-xs text-muted-foreground">Hours spent learning this week</p>
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
                  <Area type="monotone" dataKey="hours" stroke="var(--color-chart-1)" fill="url(#hoursFill)" strokeWidth={2} name="Hours" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="cc-fade cc-fade-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-sm font-bold">Skill distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={42}
                    outerRadius={72}
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

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="cc-fade">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-sm font-bold">Upcoming assessments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {upcomingAssessments.map((a) => (
                <div key={a.title} className="cc-list-row">
                  <span className="cc-list-icon">
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

        <div className="cc-fade cc-fade-1">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-display text-sm font-bold">Certificates & achievements</CardTitle>
              <Button variant="link" size="sm" className="h-auto px-0 text-xs" asChild>
                <Link to="/trainee/profile">View profile</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-1">
              {certificates.map((cert) => (
                <div key={cert.title} className="cc-list-row">
                  <span className="cc-list-icon">
                    <CheckCircle2 className="size-3.5" />
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
    </div>
  );
}
