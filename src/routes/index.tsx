import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Award,
  Play,
  LayoutDashboard,
  Library,
  UserCheck,
  BarChart3,
  Settings,
  CheckCircle2,
  UserPlus,
  ClipboardCheck,
  BadgeCheck,
  Layers,
  Sparkles,
  LineChart,
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { adminStats } from "@/lib/mock-data";

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

const portals = [
  {
    role: "Trainee",
    to: "/trainee" as const,
    icon: GraduationCap,
    desc: "Courses, resources, assessments, certificates and progress tracking.",
    points: ["6 enrolled courses", "3 certificates earned", "72% average progress"],
  },
  {
    role: "Trainer",
    to: "/trainer" as const,
    icon: Users,
    desc: "Course authoring, resource library, question bank and cohort insights.",
    points: ["6 active courses", "412 enrolled trainees", "4.7 average rating"],
  },
  {
    role: "Admin",
    to: "/admin" as const,
    icon: ShieldCheck,
    desc: "Users, approvals, analytics, competency mapping and trainer matching.",
    points: ["4,826 users", "17 pending approvals", "78% completion rate"],
  },
];

const statBar = [
  { icon: Users, label: "Users", value: adminStats.users.toLocaleString(), sub: "Active learners & professionals" },
  { icon: BookOpen, label: "Courses", value: `${adminStats.courses}`, sub: "Across multiple domains" },
  { icon: TrendingUp, label: "Enrollments", value: adminStats.enrollments.toLocaleString(), sub: "This year so far" },
  { icon: Award, label: "Certificates", value: adminStats.certificates.toLocaleString(), sub: "Successfully issued" },
];

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    desc: "Sign up with your department credentials and get verified as trainee, trainer or admin.",
  },
  {
    icon: Layers,
    title: "Get matched",
    desc: "Trainees are enrolled into relevant courses; trainers are matched by skill and availability.",
  },
  {
    icon: ClipboardCheck,
    title: "Train & assess",
    desc: "Complete structured courses, assessments and hands-on modules on a single dashboard.",
  },
  {
    icon: BadgeCheck,
    title: "Get certified",
    desc: "Earn a verified certificate linked to your service record, recognised across departments.",
  },
];

const features = [
  {
    icon: Layers,
    title: "Course management",
    desc: "Structured courses with modules, resources and assessments in one place.",
  },
  {
    icon: Users,
    title: "Trainer matching",
    desc: "Skill-based matching connects trainers to the right cohorts automatically.",
  },
  {
    icon: BadgeCheck,
    title: "Verified certification",
    desc: "Tamper-evident certificates tied to a trainee's verified service record.",
  },
  {
    icon: LineChart,
    title: "Real-time analytics",
    desc: "Live dashboards for enrolment, completion and competency gaps.",
  },
  {
    icon: Building2,
    title: "Multi-department access",
    desc: "One platform, role-based access across departments and cadres.",
  },
  {
    icon: Sparkles,
    title: "Progress tracking",
    desc: "Trainees track their own learning path and upcoming milestones.",
  },
];

const faqs = [
  {
    q: "Who is eligible to use Capacity Connect?",
    a: "Any government employee onboarded by their department administrator can access the platform as a trainee, trainer or admin, depending on their assigned role.",
  },
  {
    q: "Are certificates issued on this platform officially recognised?",
    a: "Yes. Certificates are linked to a trainee's verified service record and are recognised across participating departments under the Capacity Building Commission.",
  },
  {
    q: "Can a trainer teach across multiple departments?",
    a: "Yes, trainers are matched to cohorts based on domain expertise and availability, regardless of their home department.",
  },
  {
    q: "How is trainee data kept secure?",
    a: "All data is handled in line with Government of India IT security guidelines, with role-based access control restricting visibility to authorised users only.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* ---------- HEADER ---------- */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary">
              <GraduationCap className="size-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display text-sm font-bold tracking-tight">CAPACITY CONNECT</p>
              <p className="text-[11px] text-muted-foreground">Capacity Building Commission</p>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#" className="border-b-2 border-primary pb-1 text-foreground">Home</a>
            <Link to="/about" className="hover:text-foreground">About</Link>
            <a href="#" className="hover:text-foreground">Features</a>
            <a href="#" className="hover:text-foreground">Programs</a>
            <a href="#" className="hover:text-foreground">Resources</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link to="/trainee">Login</Link>
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
      <section className="brand-gradient relative overflow-hidden">
        {/* glow accents */}
        <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-cyan-400/20 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 top-1/3 size-[28rem] rounded-full bg-cyan-400/25 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 size-72 rounded-full bg-primary/20 blur-[100px]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 text-navy-foreground md:grid-cols-2">
          {/* Left copy */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-foreground/70">
              Digital Capacity Building &amp; Learning Management
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
              One portal for training, assessment and competency planning{" "}
              <span className="text-cyan-300">across departments.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm text-navy-foreground/80 md:text-base">
              Capacity Connect brings trainees, trainers and administrators onto a single
              platform — structured courses, verified certification, live analytics and
              skill-based trainer matching.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-cyan-400 text-[#0a1a3d] shadow-[0_0_24px_-4px] shadow-cyan-400/60 hover:bg-cyan-300"
              >
                <Link to="/trainee">
                  Explore platform <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-navy-foreground/25 bg-navy-foreground/5 text-navy-foreground hover:bg-navy-foreground/10"
              >
                Watch overview
                <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-navy-foreground/15">
                  <Play className="size-3 fill-current" />
                </span>
              </Button>
            </div>
          </div>

          {/* Right dashboard preview */}
          <div className="relative hidden md:block">
            <div className="flex overflow-hidden rounded-2xl border border-cyan-300/20 bg-navy-foreground/[0.04] shadow-2xl shadow-cyan-500/10 backdrop-blur">
              <div className="flex flex-col items-center gap-4 border-r border-navy-foreground/10 bg-black/10 px-3 py-6">
                {[LayoutDashboard, Library, UserCheck, BarChart3, Settings].map((Icon, i) => (
                  <div
                    key={i}
                    className={`flex size-8 items-center justify-center rounded-md ${
                      i === 0 ? "bg-cyan-400 text-[#0a1a3d]" : "text-navy-foreground/50"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                ))}
              </div>

              <div className="flex-1 p-6">
                <p className="mb-4 text-sm font-medium text-navy-foreground">Dashboard overview</p>

                <div className="mb-5 grid grid-cols-2 gap-3">
                  <StatMini label="Total users" value={adminStats.users.toLocaleString()} change="+12% from last month" icon={Users} />
                  <StatMini label="Courses" value={String(adminStats.courses)} change="+8% from last month" icon={BookOpen} />
                  <StatMini label="Enrollments" value={adminStats.enrollments.toLocaleString()} change="+15% from last month" icon={TrendingUp} />
                  <StatMini label="Certificates issued" value={adminStats.certificates.toLocaleString()} change="+10% from last month" icon={Award} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-card p-4">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Learning progress</p>
                    <div className="flex items-center justify-center py-2">
                      <div
                        className="flex size-20 items-center justify-center rounded-full"
                        style={{
                          background: `conic-gradient(hsl(var(--accent)) 0deg 280.8deg, hsl(var(--muted)) 280.8deg 360deg)`,
                        }}
                      >
                        <div className="flex size-[62px] items-center justify-center rounded-full bg-card">
                          <span className="text-base font-bold text-foreground">78%</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] font-medium text-foreground">Overall completion</p>
                    <p className="mb-2 text-[10px] text-muted-foreground">You're doing great!</p>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-3/4 rounded-full bg-accent" />
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">12 of 16 courses completed</p>
                  </div>

                  <div className="rounded-xl bg-card p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground">Recent activity</p>
                      <span className="text-[10px] font-medium text-accent">View all</span>
                    </div>
                    <ActivityRow label="Data Analytics Basics" sub="In progress · 75%" />
                    <ActivityRow label="Leadership & Management" sub="Completed · 100%" />
                    <ActivityRow label="Communication Skills" sub="In progress · 60%" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 top-10 flex size-12 items-center justify-center rounded-xl bg-primary shadow-lg">
              <GraduationCap className="size-6 text-primary-foreground" />
            </div>
            <div className="absolute -right-4 bottom-16 flex size-12 items-center justify-center rounded-xl bg-accent shadow-lg">
              <TrendingUp className="size-6 text-accent-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- STATS STRIP ---------- */}
      <section className="relative mx-auto -mt-10 max-w-6xl px-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {statBar.map((s) => (
            <Card
              key={s.label}
              className="flex items-center gap-4 rounded-2xl border-border/60 px-5 py-6 shadow-lg shadow-black/5 transition-shadow hover:shadow-xl hover:shadow-accent/10"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent/15">
                <s.icon className="size-6 text-accent" />
              </div>
              <div>
                <p className="font-display text-xl font-bold">{s.value}+</p>
                <p className="text-sm font-semibold">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- PORTAL PICKER ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-xl font-bold">Choose your portal</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each role has a dedicated dashboard experience with its own navigation.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {portals.map((p) => (
            <Card key={p.role} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="flex size-10 items-center justify-center rounded-md bg-accent">
                  <p.icon className="size-5 text-accent-foreground" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{p.role}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
                <ul className="mt-4 flex-1 space-y-1.5 text-xs text-muted-foreground">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-primary" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full">
                  <Link to={p.to}>
                    Open {p.role} dashboard <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <h2 className="font-display text-xl font-bold">How it works</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A simple four-step journey from registration to verified certification.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <s.icon className="size-5" />
                  </div>
                  <span className="font-display text-2xl font-bold text-muted-foreground/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-sm font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                {i !== steps.length - 1 && (
                  <div className="absolute right-[-1.5rem] top-5 hidden h-px w-6 bg-border md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-xl font-bold">Platform capabilities</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything trainees, trainers and administrators need on a single platform.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title}>
              <CardContent className="p-6">
                <div className="flex size-10 items-center justify-center rounded-md bg-accent/15">
                  <f.icon className="size-5 text-accent" />
                </div>
                <h3 className="mt-4 font-display text-sm font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-display text-xl font-bold">Frequently asked questions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Common questions from trainees, trainers and department administrators.
          </p>

          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-lg border bg-card px-5 py-4 open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-foreground">
                  {f.q}
                  <span className="ml-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
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
                <p className="font-display text-sm font-bold tracking-tight">CAPACITY CONNECT</p>
              </div>
              <p className="mt-3 max-w-xs text-xs text-muted-foreground">
                A digital capacity building and learning management initiative under the
                Capacity Building Commission.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Platform</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground">About</Link></li>
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Programs</a></li>
                <li><a href="#" className="hover:text-foreground">Resources</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Portals</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/trainee" className="hover:text-foreground">Trainee</Link></li>
                <li><Link to="/trainer" className="hover:text-foreground">Trainer</Link></li>
                <li><Link to="/admin" className="hover:text-foreground">Admin</Link></li>
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
              Capacity Connect · Demonstration interface with sample data
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

function StatMini({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-lg bg-card p-3">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <Icon className="size-3.5 text-accent" />
      </div>
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="flex items-center gap-0.5 text-[9px] text-primary">
        <CheckCircle2 className="size-2.5" /> {change}
      </p>
    </div>
  );
}

function ActivityRow({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10">
        <div className="size-2 rounded-full bg-accent" />
      </div>
      <div>
        <p className="text-[11px] font-medium leading-tight text-foreground">{label}</p>
        <p className="text-[9px] text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}
