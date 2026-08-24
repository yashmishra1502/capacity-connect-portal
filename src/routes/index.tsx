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
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useParallax, useTilt } from "@/hooks/use-landing-motion";
import { BrandIcon, BrandLogo } from "@/components/brand-logo";

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
    to: "/login" as const,
    icon: GraduationCap,
    desc: "Courses, resources, assessments, certificates and progress tracking.",
    points: ["6 enrolled courses", "3 certificates earned", "72% average progress"],
  },
  {
    role: "Trainer",
    to: "/login" as const,
    icon: Users,
    desc: "Course authoring, resource library, question bank and cohort insights.",
    points: ["6 active courses", "412 enrolled trainees", "4.7 average rating"],
  },
  {
    role: "Admin",
    to: "/admin-login" as const,
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
  useScrollReveal();
  useParallax();
  const tiltRef = useTilt<HTMLDivElement>(7);

  return (
    <div className="min-h-screen bg-background">
      {/* ---------- HEADER ---------- */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/30">
              <GraduationCap className="size-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display text-sm font-bold tracking-tight">Capacity Connect</p>
              <p className="text-[11px] text-muted-foreground">Capacity Building Commission</p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#" className="cc-link text-foreground">Home</a>
            <Link to="/about" className="cc-link hover:text-foreground">About</Link>
            <a href="#how-it-works" className="cc-link hover:text-foreground">How it works</a>
            <Link to="/contact" className="cc-link hover:text-foreground">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="outline" size="sm" className="cc-btn-ghost-glass hidden sm:inline-flex">
              <Link to="/admin-login">Admin Login</Link>
            </Button>
            <Button asChild size="sm" className="cc-btn-glass">
              <Link to="/login">
                Sign in <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="relative isolate overflow-hidden">
        {/* aurora field */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div className="cc-aurora left-[-10%] top-[-18%] size-[520px] bg-primary/25 dark:bg-primary/20" />
          <div className="cc-aurora cc-aurora-2 right-[-14%] top-[-8%] size-[460px] bg-violet-500/20" />
          <div className="cc-aurora cc-aurora-3 bottom-[-30%] left-[35%] size-[420px] bg-sky-400/15" />
        </div>
        {/* fine grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.5] dark:opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklab, var(--border) 90%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border) 90%, transparent) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 80%)",
          }}
        />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-5 pt-20 pb-24 md:grid-cols-[1.05fr_1fr] md:pt-28 md:pb-32">
          {/* Left copy */}
          <div className="cc-hero-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary backdrop-blur-sm">
              <span className="relative flex size-1.5">
                <span className="cc-ping absolute inline-flex size-1.5 rounded-full bg-primary" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              Capacity Building Commission
            </span>

            <h1 className="mt-7 font-display text-[2.75rem] font-bold leading-[1.02] tracking-[-0.035em] text-foreground sm:text-6xl md:text-[4.1rem]">
              Empowering people.
              <br />
              Building capacity.
              <br />
              <span className="cc-gradient-text">Connecting futures.</span>
            </h1>

            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              A centralised digital platform for training management, competency
              development and knowledge sharing — built to empower departments and
              the people within them.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="cc-btn-glass h-12 rounded-xl px-6 text-[15px]">
                <Link to="/login">
                  Explore platform <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="cc-btn-ghost-glass h-12 rounded-xl px-6 text-[15px]">
                <a href="#how-it-works">How it works</a>
              </Button>
            </div>

            <div className="mt-14 flex flex-wrap items-center gap-x-12 gap-y-4 border-t border-border/60 pt-7">
              {[
                { v: "4,826+", l: "Active users" },
                { v: "86+", l: "Courses live" },
                { v: "950+", l: "Certificates issued" },
              ].map((s) => (
                <div key={s.l} className="group">
                  <p className="cc-lift font-display text-2xl font-bold tracking-tight text-foreground">{s.v}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: interactive focal element */}
          <div className="cc-hero-in cc-delay-2 relative hidden md:block" data-parallax="0.12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-gradient-to-tr from-primary/15 via-transparent to-violet-500/20 blur-3xl"
            />

            <div className="cc-float-soft absolute -left-8 top-6 z-30 flex size-11 items-center justify-center rounded-2xl border border-border/60 bg-card/80 shadow-xl shadow-black/10 backdrop-blur-md">
              <GraduationCap className="size-5 text-primary" />
            </div>
            <div className="cc-float-slow absolute -left-12 top-1/2 z-30 flex size-11 items-center justify-center rounded-2xl border border-border/60 bg-card/80 shadow-xl shadow-black/10 backdrop-blur-md">
              <BarChart3 className="size-5 text-violet-500" />
            </div>
            <div className="cc-float-soft absolute -right-6 top-16 z-30 flex size-11 items-center justify-center rounded-2xl border border-border/60 bg-card/80 shadow-xl shadow-black/10 backdrop-blur-md">
              <ShieldCheck className="size-5 text-emerald-500" />
            </div>
            <div className="cc-float-slow absolute -right-8 bottom-10 z-30 flex size-11 items-center justify-center rounded-2xl border border-border/60 bg-card/80 shadow-xl shadow-black/10 backdrop-blur-md">
              <Award className="size-5 text-amber-500" />
            </div>

            <div
              ref={tiltRef}
              className="cc-tilt cc-tilt-sheen relative rounded-3xl border border-border/70 bg-card/70 p-2.5 shadow-2xl shadow-black/20 backdrop-blur-xl"
            >
              <div className="rounded-2xl border border-border/60 bg-background/80 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">Welcome back, Ananya</p>
                    <p className="text-[11px] text-muted-foreground">Let's continue learning</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-full bg-muted">
                      <Bell className="size-3.5 text-muted-foreground" />
                    </div>
                    <div className="size-7 rounded-full bg-gradient-to-br from-primary to-violet-500" />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2">
                  <MiniStat label="Trainers" value="120+" sub="Active" />
                  <MiniStat label="Trainees" value="1.2K+" sub="Enrolled" />
                  <MiniStat label="Courses" value="85+" sub="Published" />
                  <MiniStat label="Certificates" value="950+" sub="Issued" />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl border border-border/60 p-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Recent activity
                    </p>
                    <div className="mt-2.5 space-y-2.5">
                      <ActivityRow label="New course published" sub="Digital Leadership Basics" time="2h" />
                      <ActivityRow label="Assessment completed" sub="Communication Skills" time="4h" />
                      <ActivityRow label="Certificate issued" sub="Data Analysis Fundamentals" time="6h" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/60 p-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Progress
                    </p>
                    <div className="mt-2 flex items-center justify-center py-1">
                      <div
                        className="flex size-[74px] items-center justify-center rounded-full"
                        style={{
                          background:
                            "conic-gradient(var(--primary) 0deg 270deg, color-mix(in oklab, var(--muted) 90%, transparent) 270deg 360deg)",
                        }}
                      >
                        <div className="flex size-14 items-center justify-center rounded-full bg-card">
                          <span className="font-display text-sm font-bold">75%</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-[10px] text-muted-foreground">Overall completion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="cc-hairline" />
      </section>


      {/* ---------- TRUST STRIP ---------- */}
      <section className="border-b border-border/60 bg-muted/30 py-10 dark:bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 md:grid-cols-4">
          {trustStrip.map((s, i) => (
            <div
              key={s.title}
              data-reveal
              data-reveal-delay={i * 80}
              className="group flex items-start gap-3"
            >
              <div className={`cc-lift flex size-9 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`size-4 ${s.fg}`} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">{s.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- IMPACT + ABOUT ---------- */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div
          aria-hidden="true"
          data-parallax="0.18"
          className="pointer-events-none absolute left-[-12%] top-1/3 z-0 size-[420px] rounded-full bg-primary/[0.07] blur-3xl"
        />
        <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-16 px-5 md:grid-cols-[1.15fr_1fr]">
          <div>
            <Eyebrow>Impact</Eyebrow>
            <h2 data-reveal className="mt-4 max-w-md font-display text-3xl font-bold tracking-[-0.03em] md:text-[2.6rem] md:leading-[1.08]">
              Driving impact through learning
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10">
              {statBar.map((s, i) => (
                <div
                  key={s.label}
                  data-reveal
                  data-reveal-delay={i * 90}
                  className="group"
                >
                  <div className={`cc-lift flex size-10 items-center justify-center rounded-xl ${impactStats[i]?.bg}`}>
                    <s.icon className={`size-4 ${impactStats[i]?.fg}`} />
                  </div>
                  <p className="mt-4 font-display text-4xl font-bold tracking-[-0.03em]">{s.value}+</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            data-reveal="right"
            className="cc-glow-card rounded-2xl border border-border/70 bg-card/60 p-8 backdrop-blur-xl"
          >
            <h3 className="font-display text-lg font-bold tracking-tight">About Capacity Connect</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              An initiative of the Capacity Building Commission, Capacity Connect brings a
              seamless digital experience to training, assessments and knowledge sharing —
              so every department can plan competency growth in one place.
            </p>
            <Button asChild variant="link" className="mt-4 px-0">
              <Link to="/about">
                Learn more about us <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="cc-hairline mx-auto max-w-6xl" />
      </section>

      {/* ---------- PORTAL PICKER ---------- */}
      <section className="relative mx-auto max-w-6xl px-5 py-24 md:py-32">
        <Eyebrow>Portals</Eyebrow>
        <h2 data-reveal className="mt-4 font-display text-3xl font-bold tracking-[-0.03em] md:text-[2.6rem]">
          Choose your portal
        </h2>
        <p className="mt-3 max-w-lg text-[15px] text-muted-foreground">
          Each role has a dedicated dashboard experience with its own navigation.
        </p>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {portals.map((p, i) => (
            <Card
              key={p.role}
              data-reveal
              data-reveal-delay={i * 110}
              className="cc-glow-card group flex flex-col overflow-hidden rounded-2xl border-border/70 bg-card/60 backdrop-blur-xl"
            >
              <div className="h-[3px] w-full bg-gradient-to-r from-primary via-violet-500 to-sky-400 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
              <CardContent className="flex flex-1 flex-col p-7">
                <div className="cc-lift flex size-11 items-center justify-center rounded-xl bg-accent">
                  <p.icon className="size-5 text-accent-foreground" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{p.role}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                <ul className="mt-5 flex-1 space-y-2 text-[13px] text-muted-foreground">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2.5">
                      <span className="size-1 rounded-full bg-primary" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <Button asChild className="cc-btn-glass mt-7 h-11 w-full rounded-xl">
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
      <section
        id="how-it-works"
        className="relative overflow-hidden border-y border-border/60 bg-muted/25 py-24 dark:bg-white/[0.02] md:py-32"
      >
        <div
          aria-hidden="true"
          data-parallax="0.22"
          className="pointer-events-none absolute right-[-8%] top-1/2 z-0 size-[420px] -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <Eyebrow>Journey</Eyebrow>
            <h2 data-reveal className="mt-4 font-display text-3xl font-bold tracking-[-0.03em] md:text-[2.6rem]">
              How it works
            </h2>
            <p className="mt-3 text-[15px] text-muted-foreground">
              A simple four-step journey from registration to verified certification.
            </p>
          </div>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} data-reveal data-reveal-delay={i * 100} className="group relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-6 top-6 hidden h-px w-full bg-gradient-to-r from-border to-transparent md:block" />
                )}
                <div className="relative flex items-center gap-4">
                  <div className="cc-lift flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                    <s.icon className="size-5" />
                  </div>
                  <span className="font-display text-3xl font-bold text-foreground/10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-base font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <div className="max-w-2xl">
          <Eyebrow>Capabilities</Eyebrow>
          <h2 data-reveal className="mt-4 font-display text-3xl font-bold tracking-[-0.03em] md:text-[2.6rem]">
            Platform capabilities
          </h2>
          <p className="mt-3 text-[15px] text-muted-foreground">
            Everything trainees, trainers and administrators need on a single platform.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {features.map((f, i) => (
            <Card
              key={f.title}
              data-reveal
              data-reveal-delay={(i % 3) * 90}
              className="cc-glow-card group rounded-2xl border-border/70 bg-card/60 backdrop-blur-xl"
            >
              <CardContent className="p-7">
                <div className="cc-lift flex size-10 items-center justify-center rounded-xl bg-accent">
                  <f.icon className="size-5 text-accent-foreground" />
                </div>
                <h3 className="mt-5 font-display text-base font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
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
          <h2 data-reveal className="font-display text-xl font-bold">Frequently asked questions</h2>
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
                <li><Link to="/login" className="hover:text-foreground">Trainee</Link></li>
                <li><Link to="/login" className="hover:text-foreground">Trainer</Link></li>
                <li><Link to="/admin-login" className="hover:text-foreground">Admin</Link></li>
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p data-reveal className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
      {children}
    </p>
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
