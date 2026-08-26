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
      <header className="fixed top-0 z-40 w-full border-b border-white/10 bg-transparent backdrop-blur-md transition-colors">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandLogo className="h-14 w-auto max-w-[220px]" />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-white/70 md:flex">
            <a href="#" className="cc-link text-white">Home</a>
            <Link to="/about" className="cc-link hover:text-white">About</Link>
            <a href="#how-it-works" className="cc-link hover:text-white">How it works</a>
            <Link to="/contact" className="cc-link hover:text-white">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="outline" size="sm" className="border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hidden sm:inline-flex">
              <Link to="/admin-login">Admin Login</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full bg-white text-black hover:bg-white/90">
              <Link to="/login">
                Sign in <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="relative isolate flex min-h-[92vh] items-center justify-center overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
        {/* Dark cinematic overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
        {/* Glow accent (brand-colored) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(circle at 50% 65%, color-mix(in oklab, var(--primary) 35%, transparent), transparent 60%)",
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            <span className="relative flex size-1.5">
              <span className="cc-ping absolute inline-flex size-1.5 rounded-full bg-primary" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            Capacity Building Commission
          </span>

          <h1 className="mt-7 font-display text-[2.75rem] font-bold leading-[1.02] tracking-[-0.035em] text-white sm:text-6xl md:text-[4.5rem]">
            Empowering people.
            <br />
            Building capacity.
            <br />
            <span className="cc-gradient-text">Connecting futures.</span>
          </h1>

          <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-white/70">
            A centralised digital platform for training management, competency
            development and knowledge sharing — built to empower departments and
            the people within them.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-white px-7 text-[15px] font-medium text-black shadow-xl hover:bg-white/90"
            >
              <Link to="/login">
                Explore platform <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-white/25 bg-white/5 px-7 text-[15px] text-white backdrop-blur-sm hover:bg-white/10"
            >
              <a href="#how-it-works">How it works</a>
            </Button>
          </div>

          <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-white/40">
            Free for departments · Verified certification · Role-based access
          </p>

          {/* Stats row */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 border-t border-white/10 pt-8">
            {[
              { v: "4,826+", l: "Active users" },
              { v: "86+", l: "Courses live" },
              { v: "950+", l: "Certificates issued" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-2xl font-bold tracking-tight text-white">{s.v}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-white/50">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge/logo strip */}
        <div className="absolute inset-x-0 bottom-8 z-10 mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 px-5 opacity-50 grayscale transition-opacity hover:opacity-80">
          {trustStrip.map((s) => (
            <div key={s.title} className="flex items-center gap-2 text-white">
              <s.icon className="size-4" />
              <span className="text-[11px] font-medium">{s.title}</span>
            </div>
          ))}
        </div>
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
              <Link to="/">
                <BrandLogo className="h-14 w-auto max-w-[220px]" />
              </Link>
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
