import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  GraduationCap,
  Users,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Award,
  LayoutDashboard,
  Library,
  UserCheck,
  BarChart3,
  Settings,
  UserPlus,
  ClipboardCheck,
  BadgeCheck,
  ClipboardList,
  FileCheck2,
  Compass,
  KeyRound,
  Lock,
  History,
  Building2,
  Mail,
  Phone,
  MapPin,
  Search,
  Filter,
  MapPinned,
  CalendarClock,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";
import {
  adminStats,
  competencyMap,
  trainerMatching,
  enrollmentTrend,
  departmentPerformance,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Capacity Connect — Digital Capacity Building Portal" },
      {
        name: "description",
        content:
          "Capacity Connect is a digital capacity building and learning management portal for trainees, trainers and administrators.",
      },
      { property: "og:title", content: "Capacity Connect — Digital Capacity Building Portal" },
      {
        property: "og:description",
        content: "Role-based learning management for government capacity building programmes.",
      },
    ],
  }),
  component: Landing,
});

const statBar = [
  { icon: Users, label: "Active learners", value: adminStats.trainees.toLocaleString(), sub: "Onboarded across departments" },
  { icon: BookOpen, label: "Learning programmes", value: `${adminStats.courses}`, sub: "Live across domains" },
  { icon: TrendingUp, label: "Enrolments", value: adminStats.enrollments.toLocaleString(), sub: "Year to date" },
  { icon: Award, label: "Certificates issued", value: adminStats.certificates.toLocaleString(), sub: "Verified & recognised" },
  { icon: BarChart3, label: "Completion rate", value: `${adminStats.completionRate}%`, sub: "Trailing 90 days" },
];

type RoleKey = "trainee" | "trainer" | "admin";

const roleContent: Record<
  RoleKey,
  {
    label: string;
    to: "/trainee" | "/trainer" | "/admin";
    summary: string;
    points: { icon: typeof BookOpen; label: string; value: string }[];
    preview: { label: string; value: string; status: string }[];
  }
> = {
  trainee: {
    label: "Trainee",
    to: "/trainee",
    summary:
      "Track learning progress, attempt assessments, view competency growth and manage certificates from one dashboard.",
    points: [
      { icon: BookOpen, label: "Active programmes", value: "6" },
      { icon: ClipboardList, label: "Pending assessments", value: "2" },
      { icon: Award, label: "Certificates earned", value: "3" },
    ],
    preview: [
      { label: "Public Policy Analysis — PPGOV-101", value: "82%", status: "In progress" },
      { label: "Digital Governance — DGOV-204", value: "100%", status: "Completed" },
      { label: "Leadership & Team Effectiveness", value: "34%", status: "In progress" },
    ],
  },
  trainer: {
    label: "Trainer",
    to: "/trainer",
    summary:
      "Author courses, manage cohorts, grade assessments and view how you're matched to upcoming training requests.",
    points: [
      { icon: Library, label: "Courses managed", value: "6" },
      { icon: Users, label: "Enrolled trainees", value: "412" },
      { icon: BadgeCheck, label: "Average rating", value: "4.7" },
    ],
    preview: [
      { label: "FIN-311 — Batch E, September", value: "98%", status: "Match" },
      { label: "LEAD-150 — Batch D, September", value: "91%", status: "Match" },
      { label: "DATA-220 — Batch B, September", value: "89%", status: "Match" },
    ],
  },
  admin: {
    label: "Administrator",
    to: "/admin",
    summary:
      "Monitor platform-wide metrics, approve content and trainer registrations, and track competency coverage by department.",
    points: [
      { icon: Users, label: "Registered users", value: adminStats.users.toLocaleString() },
      { icon: ClipboardCheck, label: "Pending approvals", value: `${adminStats.pendingApprovals}` },
      { icon: TrendingUp, label: "Platform completion", value: `${adminStats.completionRate}%` },
    ],
    preview: [
      { label: "Trainer Registration — Meera Iyer", value: "High", status: "Pending" },
      { label: "Course Publication — Data Analytics", value: "Medium", status: "Pending" },
      { label: "Enrollment Request — Batch D, FIN-311", value: "High", status: "Pending" },
    ],
  },
};

const journey = [
  { icon: Compass, title: "Discover programme", desc: "Browse programmes relevant to your role and department." },
  { icon: UserPlus, title: "Enroll", desc: "Join a batch and get access to structured modules." },
  { icon: BookOpen, title: "Learn", desc: "Work through modules, resources and case studies." },
  { icon: ClipboardCheck, title: "Assess", desc: "Attempt structured assessments tied to each module." },
  { icon: FileCheck2, title: "Demonstrate competency", desc: "Assessment evidence maps to a competency level." },
  { icon: Award, title: "Receive certificate", desc: "A verified certificate is linked to your service record." },
  { icon: TrendingUp, title: "Continue development", desc: "A development plan closes remaining competency gaps." },
];

const competencyStages = [
  "Training",
  "Course completion",
  "Assessment",
  "Skill evidence",
  "Competency level",
  "Development plan",
];

const securityPoints = [
  {
    icon: KeyRound,
    title: "Role-based access",
    desc: "Trainees, trainers and administrators each see only the screens and actions relevant to their role.",
  },
  {
    icon: Building2,
    title: "Department-level visibility",
    desc: "Administrators see data scoped to their department by default; cross-department views require explicit access.",
  },
  {
    icon: Lock,
    title: "Controlled administration",
    desc: "Sensitive actions — approvals, certificate issuance, user status changes — are restricted to administrator accounts.",
  },
  {
    icon: History,
    title: "Audit-friendly workflows",
    desc: "Approvals, enrolments and certificate issuance are recorded with actor, timestamp and status for later review.",
  },
];

const faqs = [
  {
    q: "Who is eligible to use Capacity Connect?",
    a: "Any government employee onboarded by their department administrator can access the platform as a trainee, trainer or administrator, depending on their assigned role.",
  },
  {
    q: "How are trainees matched with trainers?",
    a: "Training requests are matched against trainer expertise, availability and prior ratings. The match percentage shown reflects how closely a trainer's profile fits a specific request, not a general ranking.",
  },
  {
    q: "How does competency tracking work?",
    a: "Completing a course and passing its linked assessment produces evidence against a specific competency. That evidence is aggregated into a current level, which is compared against a target level to highlight development gaps.",
  },
  {
    q: "Are certificates issued on this platform recognised across departments?",
    a: "Certificates are linked to a trainee's verified service record and are intended to be recognised across participating departments under the Capacity Building Commission.",
  },
  {
    q: "Can an administrator see data outside their own department?",
    a: "By default, administrator views are scoped to their department. Broader visibility is a separate, explicitly granted permission.",
  },
  {
    q: "What happens if a trainer becomes unavailable for a matched batch?",
    a: "The request returns to the matching pool and is re-evaluated against remaining trainer availability and expertise.",
  },
];

function Landing() {
  const [role, setRole] = useState<RoleKey>("trainee");
  const active = roleContent[role];

  return (
    <div className="min-h-screen bg-background">
      {/* ---------- HEADER ---------- */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary">
              <GraduationCap className="size-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display text-sm font-bold tracking-tight">Capacity Connect</p>
              <p className="text-[11px] text-muted-foreground">Capacity Building Commission</p>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#platform" className="border-b-2 border-primary pb-1 text-foreground">Platform</a>
            <a href="#programmes" className="pb-1 hover:text-foreground">Programmes</a>
            <a href="#competencies" className="pb-1 hover:text-foreground">Competencies</a>
            <a href="#trainers" className="pb-1 hover:text-foreground">Trainers</a>
            <Link to="/about" className="pb-1 hover:text-foreground">Resources</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/contact">Help</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/trainee">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/trainee">
                Enter portal <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section id="platform" className="border-b brand-gradient">
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 text-navy-foreground md:grid-cols-2 md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-foreground/65">
              Digital capacity building, connected
            </p>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight md:text-[2.75rem]">
              One platform for training, assessment and competency planning across departments
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-navy-foreground/75 md:text-[15px]">
              Capacity Connect helps departments discover relevant training, track learner progress,
              assess competencies against real evidence, connect trainees with matched trainers, and
              monitor outcomes across programmes — on a single, role-based platform.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/trainee">
                  Explore the platform <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-navy-foreground/25 bg-transparent text-navy-foreground hover:bg-navy-foreground/10"
              >
                <Link to="/about">How it works</Link>
              </Button>
            </div>
          </div>

          {/* Product preview */}
          <div className="hidden md:block">
            <div className="overflow-hidden rounded-lg border border-navy-foreground/10 bg-card shadow-xl">
              <div className="flex items-center gap-4 border-b bg-muted/40 px-4 py-2.5">
                {[LayoutDashboard, Library, UserCheck, BarChart3, Settings].map((Icon, i) => (
                  <div
                    key={i}
                    className={`flex size-7 items-center justify-center rounded-md ${
                      i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-3.5" />
                  </div>
                ))}
                <div className="ml-auto text-[10px] text-muted-foreground">Trainee overview</div>
              </div>

              <div className="p-5">
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <StatMini label="Active programmes" value="6" sub="2 due this month" />
                  <StatMini label="Competency progress" value="72%" sub="Toward target levels" />
                  <StatMini label="Upcoming assessment" value="LEAD-150" sub="Tue, 09:30 IST" />
                  <StatMini label="Certificates" value="3" sub="Verified & issued" />
                </div>

                <div className="rounded-md border p-3.5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">Recent activity</p>
                    <span className="text-[10px] font-medium text-primary">View all</span>
                  </div>
                  <ActivityRow label="Digital Governance — Module Quiz 3" sub="Completed · 2 hrs ago" />
                  <ActivityRow label="Public Policy Analysis" sub="75% complete · updated today" />
                  <ActivityRow label="Leadership & Team Effectiveness" sub="34% complete · in progress" />
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-navy-foreground/50">
              Illustrative interface preview — sample data
            </p>
          </div>
        </div>
      </section>

      {/* ---------- STATS STRIP ---------- */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Platform activity</p>
            <p className="text-xs text-muted-foreground">Demonstration data · illustrative only</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {statBar.map((s) => (
              <div key={s.label} className="surface-panel px-4 py-4">
                <div className="mb-2 flex size-8 items-center justify-center rounded-md bg-accent">
                  <s.icon className="size-4 text-accent-foreground" />
                </div>
                <p className="font-display text-xl font-bold">{s.value}</p>
                <p className="text-xs font-medium text-foreground">{s.label}</p>
                <p className="text-[11px] text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ONE PLATFORM, THREE EXPERIENCES ---------- */}
      <section id="programmes" className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold">One platform, three experiences</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Trainees, trainers and administrators each get a dashboard built for what they need to do.
          </p>
        </div>

        <Tabs value={role} onValueChange={(v) => setRole(v as RoleKey)} className="mt-8">
          <TabsList className="h-10 w-full max-w-md sm:w-auto">
            {(Object.keys(roleContent) as RoleKey[]).map((k) => (
              <TabsTrigger key={k} value={k} className="flex-1 sm:flex-none">
                {roleContent[k].label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={role} className="mt-6" forceMount>
            <div className="grid gap-6 md:grid-cols-[1fr_1.1fr]">
              <div>
                <p className="text-sm leading-relaxed text-muted-foreground">{active.summary}</p>
                <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-sm">
                  {active.points.map((p) => (
                    <div key={p.label} className="surface-panel p-3">
                      <p.icon className="size-4 text-primary" />
                      <p className="mt-2 font-display text-lg font-bold">{p.value}</p>
                      <p className="text-[11px] leading-tight text-muted-foreground">{p.label}</p>
                    </div>
                  ))}
                </div>
                <Button asChild className="mt-6">
                  <Link to={active.to}>
                    Open {active.label} dashboard <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
              </div>

              <Card>
                <CardContent className="p-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {active.label} overview
                  </p>
                  <div className="space-y-3">
                    {active.preview.map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2.5">
                        <span className="text-sm text-foreground">{row.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">{row.value}</span>
                          <Badge variant="secondary" className="text-[10px]">{row.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* ---------- COMPETENCY MAPPING ---------- */}
      <section id="competencies" className="border-y bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold">Competency mapping</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Capacity Connect is more than a course portal — every assessment produces evidence
              that rolls up into a tracked competency level.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
            {competencyStages.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span className="whitespace-nowrap rounded-md border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
                  {s}
                </span>
                {i !== competencyStages.length - 1 && (
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          <Card className="mt-8">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Competency</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Demand</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Current coverage</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Top match</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competencyMap.map((c) => (
                      <tr key={c.skill} className="border-b last:border-0">
                        <td className="px-4 py-3 font-medium text-foreground">{c.skill}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              c.demand === "High"
                                ? "border-destructive/25 bg-destructive/10 text-destructive"
                                : c.demand === "Medium"
                                  ? "border-warning/40 bg-warning/15 text-warning-foreground"
                                  : "border-border bg-muted text-muted-foreground"
                            }
                          >
                            {c.demand}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex min-w-32 items-center gap-2">
                            <Progress value={c.coverage} className="h-1.5" />
                            <span className="w-9 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                              {c.coverage}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {c.trainers[0]?.name} · {c.trainers[0]?.match}% match
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ---------- TRAINER MATCHING ---------- */}
      <section id="trainers" className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold">Trainer matching</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Open training requests are matched against trainer expertise, availability and location —
            not a black-box recommendation.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { icon: Filter, label: "Expertise" },
            { icon: Building2, label: "Department" },
            { icon: CalendarClock, label: "Availability" },
            { icon: MapPinned, label: "Location" },
          ].map((f) => (
            <button
              key={f.label}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground"
            >
              <f.icon className="size-3.5" /> {f.label}
            </button>
          ))}
          <div className="relative ml-auto hidden max-w-[220px] flex-1 sm:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <div className="w-full rounded-md border bg-card py-1.5 pl-8 pr-3 text-xs text-muted-foreground">
              Search trainers…
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trainerMatching.map((t) => (
            <Card key={t.request}>
              <CardContent className="p-4">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex size-9 items-center justify-center rounded-full bg-accent">
                    <UserCheck className="size-4 text-accent-foreground" />
                  </div>
                  <span className="font-display text-lg font-bold text-primary">{t.match}%</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{t.trainer}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.skill}</p>
                <div className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                  <p className="truncate">{t.request}</p>
                  <p className="flex items-center gap-1"><MapPinned className="size-3" /> {t.location}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    t.availability === "Available"
                      ? "mt-3 border-success/25 bg-success/12 text-success"
                      : t.availability === "Partially Booked"
                        ? "mt-3 border-warning/40 bg-warning/15 text-warning-foreground"
                        : "mt-3 border-destructive/25 bg-destructive/10 text-destructive"
                  }
                >
                  {t.availability}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- LEARNING JOURNEY ---------- */}
      <section className="border-y bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold">Learning journey</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              From discovering a programme to closing a competency gap — one continuous path.
            </p>
          </div>

          <div className="mt-10 grid gap-x-4 gap-y-8 sm:grid-cols-2 md:flex md:items-start md:gap-3">
            {journey.map((s, i) => (
              <div key={s.title} className="relative flex items-start gap-3 md:flex-1 md:flex-col md:items-start">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <s.icon className="size-4" />
                </div>
                <div className="md:mt-3">
                  <p className="text-[11px] font-semibold text-muted-foreground/70">
                    Step {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-0.5 font-display text-sm font-semibold">{s.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ANALYTICS ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold">Analytics & monitoring</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Operational visibility into enrolment, completion and department participation.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-5">
              <p className="mb-1 text-sm font-semibold">Enrolments vs completions</p>
              <p className="mb-4 text-xs text-muted-foreground">Last 6 months · sample data</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enrollmentTrend} margin={{ left: -20, right: 8, top: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Line type="monotone" dataKey="enrollments" stroke="var(--color-primary)" strokeWidth={2} dot={false} name="Enrolments" />
                    <Line type="monotone" dataKey="completions" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} name="Completions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="mb-1 text-sm font-semibold">Pending assessments</p>
              <p className="mb-4 text-xs text-muted-foreground">Awaiting attempt or grading</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Assessments live</span>
                  <span className="font-semibold">{adminStats.assessments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pending approvals</span>
                  <span className="font-semibold">{adminStats.pendingApprovals}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active today</span>
                  <span className="font-semibold">{adminStats.activeToday.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardContent className="p-5">
              <p className="mb-1 text-sm font-semibold">Department participation</p>
              <p className="mb-4 text-xs text-muted-foreground">Average completion rate by department · sample data</p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentPerformance} margin={{ left: -20, right: 8, top: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="dept" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="completion" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Completion %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ---------- SECURITY & ACCESS ---------- */}
      <section className="border-y bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold">Security & access</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Access is scoped by role and department, and sensitive actions are logged for review.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {securityPoints.map((s) => (
              <div key={s.title} className="flex gap-4 rounded-lg border bg-card p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent">
                  <s.icon className="size-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold">{s.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-5 text-primary" />
          <h2 className="font-display text-2xl font-bold">Frequently asked questions</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Common questions from trainees, trainers and department administrators.
        </p>

        <Accordion type="single" collapsible className="mt-6 rounded-lg border bg-card px-5">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`} className={i === faqs.length - 1 ? "border-b-0" : ""}>
              <AccordionTrigger className="text-sm hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-5 py-14 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-xl font-bold sm:text-2xl">
              Build stronger capabilities across your organisation
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Sign in to explore the trainee, trainer and administrator experiences with sample data.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/trainee">
              Enter portal <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t bg-card">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-md bg-primary">
                  <GraduationCap className="size-4 text-primary-foreground" />
                </div>
                <p className="font-display text-sm font-bold tracking-tight">Capacity Connect</p>
              </div>
              <p className="mt-3 max-w-xs text-xs text-muted-foreground">
                A digital capacity building and learning management initiative under the
                Capacity Building Commission.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Platform</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="#programmes" className="hover:text-foreground">Programmes</a></li>
                <li><a href="#competencies" className="hover:text-foreground">Competencies</a></li>
                <li><a href="#trainers" className="hover:text-foreground">Trainers</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Resources</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground">About</Link></li>
                <li><Link to="/contact" className="hover:text-foreground">Contact / Help</Link></li>
                <li><Link to="/trainee" className="hover:text-foreground">Trainee portal</Link></li>
                <li><Link to="/trainer" className="hover:text-foreground">Trainer portal</Link></li>
                <li><Link to="/admin" className="hover:text-foreground">Admin portal</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Contact</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="size-3.5" /> support@capacityconnect.gov.in
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="size-3.5" /> 1800-XXX-XXXX
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="size-3.5" /> New Delhi, India
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              Capacity Connect · Demonstration interface · Version 1.0.0
            </p>
            <div className="flex items-center gap-5 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy policy</a>
              <a href="#" className="hover:text-foreground">Terms of use</a>
              <a href="#" className="hover:text-foreground">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatMini({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-md border p-3">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-base font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function ActivityRow({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent">
        <div className="size-1.5 rounded-full bg-accent-foreground" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium leading-tight text-foreground">{label}</p>
        <p className="text-[9px] text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}
