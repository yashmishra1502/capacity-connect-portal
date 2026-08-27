import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Award,
  BarChart3,
  UserCheck,
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
  Gift,
  Landmark,
  LogOut,
  ChevronDown,
  User as UserIcon,
  LayoutDashboard,
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
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/auth";

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
  { icon: Users, bg: "bg-indigo-500/20", fg: "text-indigo-300" },
  { icon: UserCheck, bg: "bg-emerald-500/20", fg: "text-emerald-300" },
  { icon: BookOpen, bg: "bg-violet-500/20", fg: "text-violet-300" },
  { icon: Award, bg: "bg-amber-500/20", fg: "text-amber-300" },
];

const heroBadges = [
  { icon: Gift, label: "Free for Departments" },
  { icon: ShieldCheck, label: "Verified Certification" },
  { icon: Users, label: "Role-based Access" },
];

const govDepartments = [
  { name: "Home Affairs", icon: ShieldCheck },
  { name: "Digital India", icon: Sparkles },
  { name: "Finance", icon: Landmark },
  { name: "Personnel & Training", icon: Users },
  { name: "Defence", icon: BadgeCheck },
  { name: "NITI Aayog", icon: Building2 },
  { name: "Government of India", icon: Award },
];

const trustStrip = [
  {
    icon: GraduationCap,
    title: "Centralised learning",
    desc: "Courses, resources and assessments in one platform.",
    bg: "bg-indigo-500/25",
    fg: "text-indigo-300",
  },
  {
    icon: ShieldCheck,
    title: "Secure & role-based",
    desc: "Role-based access for trainers, trainees and admins.",
    bg: "bg-emerald-500/25",
    fg: "text-emerald-300",
  },
  {
    icon: BarChart3,
    title: "Track & monitor",
    desc: "Real-time dashboards for performance and progress.",
    bg: "bg-violet-500/25",
    fg: "text-violet-300",
  },
  {
    icon: Bell,
    title: "Stay updated",
    desc: "Instant notifications on deadlines and achievements.",
    bg: "bg-amber-500/25",
    fg: "text-amber-300",
  },
];

const TYPED_PHRASES = ["Connecting futures.", "Empowering officers.", "Building excellence."];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-foreground/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground">
      <Sparkles className="size-3 text-primary" />
      {children}
    </span>
  );
}

function useTypewriter(phrases: string[], typingSpeed = 70, deletingSpeed = 40, holdTime = 1800) {
  const [text, setText] = React.useState("");
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const current = phrases[phraseIndex % phrases.length] ?? "";
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), holdTime);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setPhraseIndex((p) => p + 1);
    } else {
      const next = isDeleting
        ? current.slice(0, text.length - 1)
        : current.slice(0, text.length + 1);
      timeout = setTimeout(() => setText(next), isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, holdTime]);

  return text;
}

/* ---------- PROFILE DROPDOWN MENU ---------- */
function ProfileMenu({ profile }: { profile: any }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate({ to: "/" });
  }

  const initials =
    (profile?.name as string | undefined)
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const userRole = profile?.role || "trainee";
  const dashboardPath = `/${userRole}`;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/5 px-2.5 py-1.5 text-sm text-foreground hover:bg-foreground/10"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
          {initials}
        </span>
        <ChevronDown className="size-3.5 text-foreground/60" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-foreground/15 bg-background p-2 shadow-lg z-50">
          <div className="px-2.5 py-2">
            <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <UserIcon className="size-3.5 text-primary" />
              {profile?.name || "User"}
            </p>
            <p className="mt-0.5 text-xs capitalize text-foreground/55">Role: {userRole}</p>
          </div>
          <div className="my-1 h-px bg-foreground/10" />
          <Link
            to={dashboardPath}
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-foreground hover:bg-foreground/5"
          >
            <LayoutDashboard className="size-3.5" />
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOut className="size-3.5" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

function Landing() {
  useScrollReveal();
  useParallax();
  const tiltRef = useTilt<HTMLDivElement>(7);
  const typedText = useTypewriter(TYPED_PHRASES);
  const navigate = useNavigate();
  const { session, profile, loading } = useAuth();

  const userRole = profile?.role || "trainee";
  const dashboardPath = `/${userRole}`;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <style>{`
        @keyframes cc-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.15); }
        }
        @keyframes cc-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 60px) scale(1.1); }
        }
        @keyframes cc-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -50px) scale(1.2); }
        }
        @keyframes cc-pulse-glow {
          0%, 100% { opacity: 0.65; }
          50% { opacity: 1; }
        }
        @keyframes cc-caret-blink {
          0%, 45% { opacity: 1; }
          50%, 95% { opacity: 0; }
          100% { opacity: 1; }
        }
        .cc-caret {
          height: 0.85em;
          animation: cc-caret-blink 1s steps(1) infinite;
        }
      `}</style>

      {/* ---------- GLOBAL ANIMATED BACKGROUND ---------- */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute -left-40 -top-40 size-[700px] rounded-full opacity-100 blur-[120px] dark:opacity-20"
          style={{
            background: "radial-gradient(circle, color-mix(in oklab, var(--primary) 28%, transparent), transparent 70%)",
            animation: "cc-drift-1 18s ease-in-out infinite, cc-pulse-glow 9s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -right-32 top-1/4 size-[600px] rounded-full opacity-100 blur-[120px] dark:opacity-[0.18]"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)",
            animation: "cc-drift-2 22s ease-in-out infinite, cc-pulse-glow 11s ease-in-out infinite",
          }}
        />
        <div
          className="absolute left-1/3 top-2/3 size-[650px] rounded-full opacity-100 blur-[130px] dark:opacity-[0.15]"
          style={{
            background: "radial-gradient(circle, rgba(56,189,248,0.18), transparent 70%)",
            animation: "cc-drift-3 25s ease-in-out infinite, cc-pulse-glow 13s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -right-20 bottom-0 size-[550px] rounded-full opacity-100 blur-[120px] dark:opacity-[0.18]"
          style={{
            background: "radial-gradient(circle, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%)",
            animation: "cc-drift-2 20s ease-in-out infinite reverse, cc-pulse-glow 10s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklab, var(--foreground) 45%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 45%, transparent) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      {/* ---------- HEADER ---------- */}
      <header className="sticky top-0 z-40 border-b border-foreground/15 bg-background/60 backdrop-blur-xl dark:bg-background/85 dark:border-foreground/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandLogo className="h-[4.5rem] w-auto max-w-[240px]" />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/75 md:flex">
            <a href="#" className="cc-link text-foreground">Home</a>
            <Link to="/about" className="cc-link hover:text-foreground">About</Link>
            <a href="#how-it-works" className="cc-link hover:text-foreground">How it works</a>
            <Link to="/contact" className="cc-link hover:text-foreground">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {loading ? null : session && profile ? (
              <>
                <Button
                  size="sm"
                  className="rounded-full bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => navigate({ to: dashboardPath })}
                >
                  Dashboard
                </Button>
                <ProfileMenu profile={profile} />
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="border-foreground/20 bg-foreground/5 text-foreground hover:bg-foreground/10 hidden sm:inline-flex">
                  <Link to="/admin-login">Admin Login</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                  <Link to="/login">
                    Sign in <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="relative z-10 isolate flex min-h-[72vh] items-center justify-center overflow-hidden">
        <div
          aria-hidden="true"
          data-parallax="0.06"
          className="absolute inset-0 z-0 bg-cover bg-center opacity-75"
          style={{
            backgroundImage:
              "url('https://commons.wikimedia.org/wiki/Special:FilePath/Rashtrapati%20Bhavan%20Wide%20New%20Delhi%20India.jpg')",
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-white/50 dark:hidden" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 mix-blend-color opacity-60 dark:opacity-20"
          style={{ background: "rgba(29,78,216,0.35)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-70 dark:opacity-25"
          style={{
            background:
              "radial-gradient(ellipse 40% 55% at 82% 45%, color-mix(in oklab, var(--primary) 40%, transparent), transparent 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.06] dark:opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklab, var(--foreground) 45%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 45%, transparent) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 pb-24 pt-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/[0.08] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground backdrop-blur-sm dark:border-foreground/15 dark:bg-foreground/[0.06]">
            <span className="relative flex size-1.5">
              <span className="cc-ping absolute inline-flex size-1.5 rounded-full bg-primary" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            Capacity Building Commission
          </span>

          <h1 className="mt-7 font-display text-[2.75rem] font-bold leading-[1.02] tracking-[-0.035em] text-foreground sm:text-6xl md:text-[4.5rem]">
            Empowering people.
            <br />
            Building capacity.
            <br />
            <span className="cc-gradient-text relative inline-block min-h-[1.1em]">
              {typedText}
              <span className="cc-caret ml-1 inline-block w-[3px] translate-y-[0.05em] bg-sky-300 align-middle" />
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-foreground/75">
            A centralised digital platform for training management, competency
            development and knowledge sharing — built to empower departments and
            the people within them.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-foreground px-7 text-[15px] font-medium text-background shadow-xl hover:bg-foreground/90"
            >
              <Link to={session ? dashboardPath : "/login"}>
                {session ? "Go to Dashboard" : "Explore platform"} <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-foreground/20 bg-foreground/[0.08] px-7 text-[15px] text-foreground backdrop-blur-sm hover:bg-foreground/15 dark:border-foreground/15 dark:bg-foreground/[0.06]"
            >
              <a href="#how-it-works">How it works</a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-foreground/15 bg-foreground/[0.07] px-5 py-3 backdrop-blur-sm dark:border-foreground/10 dark:bg-foreground/[0.05]">
            {heroBadges.map((b, i) => (
              <div key={b.label} className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-[13px] font-medium text-foreground/90">
                  <b.icon className="size-4 text-sky-300" />
                  {b.label}
                </span>
                {i < heroBadges.length - 1 && (
                  <span className="hidden h-4 w-px bg-foreground/20 sm:block" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 w-full border-t border-foreground/15 pt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/55">
              Trusted by government departments across India
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
              {govDepartments.map((d) => (
                <div key={d.name} className="flex flex-col items-center gap-1.5 opacity-90 grayscale transition hover:opacity-100 hover:grayscale-0">
                  <div className="flex size-12 items-center justify-center rounded-full border border-foreground/25 bg-foreground/[0.07] dark:border-foreground/15 dark:bg-foreground/[0.05]">
                    <d.icon className="size-5 text-foreground/80" />
                  </div>
                  <span className="max-w-[72px] text-center text-[10px] leading-tight text-foreground/60">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TRUST STRIP ---------- */}
      <section className="relative z-10 border-b border-foreground/15 bg-foreground/[0.02] py-10 backdrop-blur-sm dark:border-foreground/10 dark:bg-foreground/[0.015]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 md:grid-cols-4">
          {trustStrip.map((s, i) => (
            <div key={s.title} data-reveal data-reveal-delay={i * 80} className="group flex items-start gap-3">
              <div className={`cc-lift flex size-9 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`size-4 ${s.fg}`} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">{s.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-foreground/60">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- IMPACT + ABOUT ---------- */}
      <section className="relative z-10 overflow-hidden py-24 md:py-32">
        <div
          aria-hidden="true"
          data-parallax="0.18"
          className="pointer-events-none absolute left-[-12%] top-1/3 z-0 size-[420px] rounded-full bg-primary/[0.18] blur-3xl dark:bg-primary/[0.08]"
        />
        <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-16 px-5 md:grid-cols-[1.15fr_1fr]">
          <div>
            <Eyebrow>Impact</Eyebrow>
            <h2 data-reveal className="mt-4 max-w-md font-display text-3xl font-bold tracking-[-0.03em] text-foreground md:text-[2.6rem] md:leading-[1.08]">
              Driving impact through learning
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10">
              {statBar.map((s, i) => (
                <div key={s.label} data-reveal data-reveal-delay={i * 90} className="group">
                  <div className={`cc-lift flex size-10 items-center justify-center rounded-xl ${impactStats[i]?.bg}`}>
                    <s.icon className={`size-4 ${impactStats[i]?.fg}`} />
                  </div>
                  <p className="mt-4 font-display text-4xl font-bold tracking-[-0.03em] text-foreground">{s.value}+</p>
                  <p className="mt-1 text-[13px] text-foreground/60">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal="right" className="cc-glow-card rounded-2xl border border-foreground/15 bg-foreground/[0.06] p-8 backdrop-blur-xl dark:border-foreground/10 dark:bg-foreground/[0.05]">
            <h3 className="font-display text-lg font-bold tracking-tight text-foreground">About Capacity Connect</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/75">
              An initiative of the Capacity Building Commission, Capacity Connect brings a
              seamless digital experience to training, assessments and knowledge sharing —
              so every department can plan competency growth in one place.
            </p>
            <Button asChild variant="link" className="mt-4 px-0 text-primary">
              <Link to="/about">
                Learn more about us <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-20 max-w-6xl border-t border-foreground/15" />
      </section>

      {/* ---------- PORTAL PICKER ---------- */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-24 md:py-32">
        <Eyebrow>Portals</Eyebrow>
        <h2 data-reveal className="mt-4 font-display text-3xl font-bold tracking-[-0.03em] text-foreground md:text-[2.6rem]">
          Choose your portal
        </h2>
        <p className="mt-3 max-w-lg text-[15px] text-foreground/60">
          Each role has a dedicated dashboard experience with its own navigation.
        </p>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {portals.map((p, i) => (
            <Card
              key={p.role}
              data-reveal
              data-reveal-delay={i * 110}
              className="cc-glow-card group flex flex-col overflow-hidden rounded-2xl border-foreground/15 bg-foreground/[0.06] backdrop-blur-xl dark:border-foreground/10 dark:bg-foreground/[0.05]"
            >
              <div className="h-[3px] w-full bg-gradient-to-r from-primary via-violet-500 to-sky-400 opacity-75 transition-opacity duration-300 group-hover:opacity-100" />
              <CardContent className="flex flex-1 flex-col p-7">
                <div className="cc-lift flex size-11 items-center justify-center rounded-xl bg-foreground/10 dark:bg-foreground/[0.1]">
                  <p.icon className="size-5 text-foreground" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-foreground">{p.role}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{p.desc}</p>
                <ul className="mt-5 flex-1 space-y-2 text-[13px] text-foreground/70">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2.5">
                      <span className="size-1 rounded-full bg-primary" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-7 h-11 w-full rounded-xl bg-foreground text-background hover:bg-foreground/90">
                  <Link to={session ? dashboardPath : p.to}>
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
        className="relative z-10 overflow-hidden border-y border-foreground/15 bg-foreground/[0.02] py-24 md:py-32 backdrop-blur-sm dark:border-foreground/10 dark:bg-foreground/[0.015]"
      >
        <div
          aria-hidden="true"
          data-parallax="0.22"
          className="pointer-events-none absolute right-[-8%] top-1/2 z-0 size-[420px] -translate-y-1/2 rounded-full bg-primary/[0.2] blur-3xl dark:bg-primary/[0.08]"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <Eyebrow>Journey</Eyebrow>
            <h2 data-reveal className="mt-4 font-display text-3xl font-bold tracking-[-0.03em] text-foreground md:text-[2.6rem]">
              How it works
            </h2>
            <p className="mt-3 text-[15px] text-foreground/60">
              A simple four-step journey from registration to verified certification.
            </p>
          </div>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} data-reveal data-reveal-delay={i * 100} className="group relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-6 top-6 hidden h-px w-full bg-gradient-to-r from-foreground/25 to-transparent md:block" />
                )}
                <div className="relative flex items-center gap-4">
                  <div className="cc-lift flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                    <s.icon className="size-5" />
                  </div>
                  <span className="font-display text-3xl font-bold text-foreground/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-base font-semibold tracking-tight text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-24 md:py-32">
        <div className="max-w-2xl">
          <Eyebrow>Capabilities</Eyebrow>
          <h2 data-reveal className="mt-4 font-display text-3xl font-bold tracking-[-0.03em] text-foreground md:text-[2.6rem]">
            Platform capabilities
          </h2>
          <p className="mt-3 text-[15px] text-foreground/60">
            Everything trainees, trainers and administrators need on a single platform.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {features.map((f, i) => (
            <Card
              key={f.title}
              data-reveal
              data-reveal-delay={(i % 3) * 90}
              className="cc-glow-card group rounded-2xl border-foreground/15 bg-foreground/[0.06] backdrop-blur-xl dark:border-foreground/10 dark:bg-foreground/[0.05]"
            >
              <CardContent className="p-7">
                <div className="cc-lift flex size-10 items-center justify-center rounded-xl bg-foreground/10 dark:bg-foreground/[0.1]">
                  <f.icon className="size-5 text-foreground" />
                </div>
                <h3 className="mt-5 font-display text-base font-semibold tracking-tight text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="relative z-10 overflow-hidden bg-foreground/[0.02] py-16 md:py-20 backdrop-blur-sm dark:bg-foreground/[0.015]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 z-0 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.15] blur-3xl dark:bg-primary/[0.06]"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-5">
          <div className="text-center">
            <Eyebrow>Support</Eyebrow>
            <h2 data-reveal className="mt-4 font-display text-3xl font-bold tracking-[-0.03em] text-foreground md:text-[2.6rem]">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="mt-12 space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-foreground/15 bg-background/50 px-6 backdrop-blur-md"
              >
                <AccordionTrigger className="text-left font-display font-semibold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-foreground/70">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="relative z-10 border-t border-foreground/15 bg-background py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 sm:flex-row">
          <BrandLogo className="h-12 w-auto" />
          <p className="text-xs text-foreground/60">
            © {new Date().getFullYear()} Capacity Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
