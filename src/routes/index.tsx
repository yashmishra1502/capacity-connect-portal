import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Award,
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
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { adminStats } from "@/lib/mock-data";
import { ThemeToggle } from "@/components/theme-toggle";

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

const impactStats = [
  { icon: Users, bg: "bg-indigo-500/10", fg: "text-indigo-600" },
  { icon: UserCheck, bg: "bg-emerald-500/10", fg: "text-emerald-600" },
  { icon: BookOpen, bg: "bg-violet-500/10", fg: "text-violet-600" },
  { icon: Award, bg: "bg-amber-500/10", fg: "text-amber-600" },
];

const trustStrip = [
  {
    icon: GraduationCap,
    title: "Centralised learning",
    desc: "Courses, resources and assessments in one platform.",
    bg: "bg-indigo-500/20",
    fg: "text-indigo-300",
  },
  {
    icon: ShieldCheck,
    title: "Secure & role-based",
    desc: "Role-based access for trainers, trainees and admins.",
    bg: "bg-emerald-500/20",
    fg: "text-emerald-300",
  },
  {
    icon: BarChart3,
    title: "Track & monitor",
    desc: "Real-time dashboards for performance and progress.",
    bg: "bg-violet-500/20",
    fg: "text-violet-300",
  },
  {
    icon: Bell,
    title: "Stay updated",
    desc: "Instant notifications on deadlines and achievements.",
    bg: "bg-amber-500/20",
    fg: "text-amber-300",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* ---------- HEADER ---------- */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary shadow-sm shadow-primary/30">
              <GraduationCap className="size-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display text-sm font-bold tracking-tight">Capacity Connect</p>
              <p className="text-[11px] text-muted-foreground">Capacity Building Commission</p>
            </div>
          </div>
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#" className="border-b-2 border-primary pb-1 text-foreground">Home</a>
            <Link to="/about" className="pb-1 hover:text-foreground">About</Link>
            <a href="#how-it-works" className="pb-1 hover:text-foreground">How it works</a>
            <Link to="/contact" className="pb-1 hover:text-foreground">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
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
      <section className="relative isolate overflow-hidden border-b bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(#c7d2fe 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to bottom, black, transparent 85%)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent 85%)",
          }}
        />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-20">
          {/* Left copy */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <GraduationCap className="size-3.5" /> Smart Capacity Building for a Skilled Tomorrow
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground md:text-5xl">
              Empowering People.
              <br />
              Building Capacity.
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Connecting Futures.
              </span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              Capacity Connect is a centralised digital platform for training management,
              competency development and knowledge sharing — built to empower departments
              and the people within them.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="shadow-lg shadow-primary/25">
                <Link to="/trainee">
                  Explore platform <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#how-it-works">View problem statement</a>
              </Button>
            </div>
          </div>

          {/* Right: dashboard mockup + floating badges */}
          <div className="relative hidden md:block">
            <div className="absolute -left-6 top-4 z-20 flex size-11 items-center justify-center rounded-xl bg-white shadow-lg shadow-black/10 ring-1 ring-black/5">
              <GraduationCap className="size-5 text-primary" />
            </div>
            <div className="absolute -left-10 top-28 z-20 flex size-11 items-center justify-center rounded-xl bg-white shadow-lg shadow-black/10 ring-1 ring-black/5">
              <BarChart3 className="size-5 text-violet-500" />
            </div>
            <div className="absolute -left-6 top-52 z-20 flex size-11 items-center justify-center rounded-xl bg-white shadow-lg shadow-black/10 ring-1 ring-black/5">
              <BookOpen className="size-5 text-amber-500" />
            </div>
            <div className="absolute -right-4 top-2 z-20 flex size-11 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 ring-1 ring-black/5">
              <Users className="size-5 text-indigo-500" />
            </div>
            <div className="absolute -right-2 bottom-24 z-20 flex size-11 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 ring-1 ring-black/5">
              <ShieldCheck className="size-5 text-emerald-500" />
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/10 via-transparent to-accent/20 blur-2xl"
            />

            <div className="relative rounded-2xl border border-black/5 bg-card p-2 shadow-2xl shadow-black/15">
              <div className="rounded-xl border bg-background p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Welcome back,</p>
                    <p className="text-[11px] text-muted-foreground">Let's continue learning!</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-muted">
                      <Bell className="size-3 text-muted-foreground" />
                    </div>
                    <div className="size-6 rounded-full bg-primary/20" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2">
                  <MiniStat label="Trainers" value="120+" sub="Active" />
                  <MiniStat label="Trainees" value="1.2K+" sub="Enrolled" />
                  <MiniStat label="Courses" value="85+" sub="Published" />
                  <MiniStat label="Certificates" value="950+" sub="Issued" />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border p-3">
                    <p className="text-[10px] font-semibold text-foreground">Recent activities</p>
                    <div className="mt-2 space-y-2">
                      <ActivityRow label="New course published" sub="Digital Leadership Basics" time="2h ago" />
                      <ActivityRow label="Assessment completed" sub="Communication Skills" time="4h ago" />
                      <ActivityRow label="Certificate issued" sub="Data Analysis Fundamentals" time="6h ago" />
                    </div>
                    <p className="mt-2 text-[10px] font-medium text-primary">View all activities →</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-[10px] font-semibold text-foreground">Learning progress</p>
                    <div className="mt-2 flex items-center justify-center py-1">
                      <div
                        className="flex size-16 items-center justify-center rounded-full"
                        style={{ background: "conic-gradient(#4f46e5 0deg 270deg, #e5e7eb 270deg 360deg)" }}
                      >
                        <div className="flex size-12 items-center justify-center rounded-full bg-card">
                          <span className="text-xs font-bold">75%</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-[9px] text-muted-foreground">Overall progress</p>
                    <p className="mt-2 text-center text-[10px] font-medium text-primary">View details →</p>
                  </div>
                </div>
              </div>
              <div className="mx-auto -mb-1 mt-2 h-2 w-3/5 rounded-b-xl bg-muted" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TRUST STRIP (dark) ---------- */}
      <section className="bg-[#0B1B33] py-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 md:grid-cols-4">
          {trustStrip.map((s) => (
            <div key={s.title} className="flex items-start gap-3">
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${s.bg}`}>
                <s.icon className={`size-4 ${s.fg}`} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">{s.title}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-white/50">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- IMPACT + ABOUT ---------- */}
      <section className="border-b bg-white py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-bold">Driving impact through learning</h2>
            <div className="mt-6 grid grid-cols-2 gap-6">
              {statBar.map((s, i) => (
                <div key={s.label}>
                  <div className={`flex size-10 items-center justify-center rounded-full ${impactStats[i].bg}`}>
                    <s.icon className={`size-4.5 ${impactStats[i].fg}`} />
                  </div>
                  <p className="mt-2 font-display text-2xl font-bold">{s.value}+</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-6">
            <h3 className="font-display text-base font-bold">About Capacity Connect</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              An initiative of the Capacity Building Commission, Capacity Connect brings a
              seamless digital experience to training, assessments and knowledge sharing —
              so every department can plan competency growth in one place.
            </p>
            <Button asChild variant="link" className="mt-3 px-0">
              <Link to="/about">
                Learn more about us <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---------- PORTAL PICKER ---------- */}
      <section className="relative mx-auto max-w-6xl px-5 py-16 md:py-20">
        <h2 className="font-display text-xl font-bold">Choose your portal</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each role has a dedicated dashboard experience with its own navigation.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {portals.map((p) => (
            <Card
              key={p.role}
              className="group flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-1 w-full bg-gradient-to-r from-primary to-accent opacity-70 transition-opacity duration-200 group-hover:opacity-100" />
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="flex size-11 items-center justify-center rounded-md bg-accent transition-transform duration-200 group-hover:scale-105">
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
      <section id="how-it-works" className="relative overflow-hidden border-y bg-muted/30 py-16 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-8%] top-1/2 z-0 size-[380px] -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <h2 className="font-display text-xl font-bold">How it works</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A simple four-step journey from registration to verified certification.
            </p>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-5 top-10 hidden h-px w-full bg-gradient-to-r from-border to-transparent md:block" />
                )}
                <div className="relative flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/30">
                    <s.icon className="size-5" />
                  </div>
                  <span className="font-display text-2xl font-bold text-muted-foreground/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-sm font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-xl font-bold">Platform capabilities</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything trainees, trainers and administrators need on a single platform.
          </p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex size-10 items-center justify-center rounded-md bg-accent">
                  <f.icon className="size-5 text-accent-foreground" />
                </div>
                <h3 className="mt-4 font-display text-sm font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="relative overflow-hidden bg-muted/30 py-16 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 z-0 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-5">
          <h2 className="font-display text-xl font-bold">Frequently asked questions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Common questions from trainees, trainers and department administrators.
          </p>
          <Accordion type="single" collapsible className="mt-8 rounded-lg border bg-card px-5 shadow-sm">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className={i === faqs.length - 1 ? "border-b-0" : ""}>
                <AccordionTrigger className="text-sm hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="relative overflow-hidden border-t bg-card">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />
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
                <li><Link to="/about" className="hover:text-foreground">About</Link></li>
                <li><a href="#how-it-works" className="hover:text-foreground">How it works</a></li>
                <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
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

function MiniStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg border p-2 text-center">
      <p className="text-[13px] font-bold text-foreground">{value}</p>
      <p className="text-[9px] font-medium text-foreground/80">{label}</p>
      <p className="text-[8px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function ActivityRow({ label, sub, time }: { label: string; sub: string; time: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <div className="size-1.5 rounded-full bg-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[9px] font-medium leading-tight">{label}</p>
        <p className="truncate text-[8px] text-muted-foreground">{sub}</p>
      </div>
      <span className="shrink-0 text-[8px] text-muted-foreground">{time}</span>
    </div>
  );
}
