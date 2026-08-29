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
  UserPlus,
  ClipboardCheck,
  BadgeCheck,
  Layers,
  Sparkles,
  LineChart,
  Building2,
  Bell,
  Gift,
  Landmark,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Moon,
  Sun,
} from "lucide-react";
import "../landing.css";
import { adminStats } from "@/lib/mock-data";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useParallax } from "@/hooks/use-landing-motion";
import { BrandLogo } from "@/components/brand-logo";
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

/* ---------------- data ---------------- */

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
  { label: "Users", value: adminStats.users.toLocaleString() },
  { label: "Courses", value: `${adminStats.courses}` },
  { label: "Enrollments", value: adminStats.enrollments.toLocaleString() },
  { label: "Certificates", value: adminStats.certificates.toLocaleString() },
];

const steps = [
  {
    title: "Register",
    desc: "Sign up with your department credentials and get verified as trainee, trainer or admin.",
  },
  {
    title: "Get matched",
    desc: "Trainees are enrolled into relevant courses; trainers are matched by skill and availability.",
  },
  {
    title: "Train & assess",
    desc: "Complete structured courses, assessments and hands-on modules on a single dashboard.",
  },
  {
    title: "Get certified",
    desc: "Earn a verified certificate linked to your service record, recognised across departments.",
  },
];

const features = [
  {
    icon: Layers,
    tag: "Courses",
    title: "Course management",
    desc: "Structured courses with modules, resources and assessments in one place.",
  },
  {
    icon: Users,
    tag: "Matching",
    title: "Trainer matching",
    desc: "Skill-based matching connects trainers to the right cohorts automatically.",
  },
  {
    icon: BadgeCheck,
    tag: "Certification",
    title: "Verified certification",
    desc: "Tamper-evident certificates tied to a trainee's verified service record.",
  },
  {
    icon: LineChart,
    tag: "Analytics",
    title: "Real-time analytics",
    desc: "Live dashboards for enrolment, completion and competency gaps.",
  },
  {
    icon: Building2,
    tag: "Access",
    title: "Multi-department access",
    desc: "One platform, role-based access across departments and cadres.",
  },
  {
    icon: Sparkles,
    tag: "Tracking",
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
  },
  {
    icon: ShieldCheck,
    title: "Secure & role-based",
    desc: "Role-based access for trainers, trainees and admins.",
  },
  {
    icon: BarChart3,
    title: "Track & monitor",
    desc: "Real-time dashboards for performance and progress.",
  },
  {
    icon: Bell,
    title: "Stay updated",
    desc: "Instant notifications on deadlines and achievements.",
  },
];

/* ---------------- small components ---------------- */

function useIsDarkToggle() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
  }, []);

  const toggle = React.useCallback(() => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
    setIsDark(next);
  }, []);

  return { isDark, toggle };
}

function CclThemeToggle() {
  const { isDark, toggle } = useIsDarkToggle();
  return (
    <button className="theme-btn" onClick={toggle} aria-label="Toggle theme">
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

function NavUserMenu({ profile }: { profile: any }) {
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
    <div className="nav-user" ref={menuRef}>
      <button className="nav-user-trigger" onClick={() => setOpen((o) => !o)}>
        <span className="nav-user-avatar">{initials}</span>
      </button>
      {open && (
        <div className="nav-user-panel">
          <div style={{ padding: "8px 10px" }}>
            <p style={{ fontSize: 13.5, fontWeight: 600 }}>{profile?.name || "User"}</p>
            <p style={{ fontSize: 11.5, color: "var(--muted-label)", marginTop: 2, textTransform: "capitalize" }}>
              Role: {userRole}
            </p>
          </div>
          <Link to={dashboardPath} onClick={() => setOpen(false)} className="item">
            <LayoutDashboard size={14} /> Dashboard
          </Link>
          <button className="item danger" onClick={handleLogout}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

function useTypewriter(phrases: string[], typingSpeed = 65, deletingSpeed = 38, holdTime = 1700) {
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
      const next = isDeleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1);
      timeout = setTimeout(() => setText(next), isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, holdTime]);

  return text;
}

const TYPED_PHRASES = ["Connecting futures.", "Empowering officers.", "Building excellence."];

/* ---------------- page ---------------- */

function Landing() {
  useScrollReveal();
  useParallax();
  const typedText = useTypewriter(TYPED_PHRASES);
  const navigate = useNavigate();
  const { session, profile, loading } = useAuth();

  const userRole = profile?.role || "trainee";
  const dashboardPath = `/${userRole}`;

  return (
    <div className="ccl cc-homepage">
      {/* ---------- HEADER ---------- */}
      <header>
        <nav>
          <Link to="/" className="brand">
            <BrandLogo className="!h-9 !w-auto !max-w-[220px]" />
          </Link>

          <div className="nav-links">
            <a href="#top">Home</a>
            <Link to="/about">About</Link>
            <a href="#how-it-works">How it works</a>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="nav-cta">
            <CclThemeToggle />
            {loading ? null : session && profile ? (
              <>
                <button className="btn btn-primary" onClick={() => navigate({ to: dashboardPath })}>
                  Dashboard
                </button>
                <NavUserMenu profile={profile} />
              </>
            ) : (
              <>
                <Link to="/admin-login" className="btn-ghost" style={{ display: "none" }} />
                <a href="/admin-login" className="btn-ghost">
                  Admin Login
                </a>
                <Link to="/login" className="btn btn-primary">
                  Sign in <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="hero" id="top">
        <div className="wrap">
          <div className="eyebrow">Capacity Building Commission</div>

          <h1>
            Empowering people.
            <br />
            Building <span className="accent">capacity</span>,
            <br />
            not just <span className="badge">
              <span className="ico">
                <ShieldCheck />
              </span>
              records
            </span>
            .
          </h1>

          <p className="hero-sub">
            A centralised digital platform for training management, competency development
            and knowledge sharing — built to empower departments and the people within them.
            <br />
            <strong style={{ color: "var(--ink)" }}>{typedText}</strong>
          </p>

          <div className="hero-ctas">
            <Link to={session ? dashboardPath : "/login"} className="btn btn-primary btn-lg">
              {session ? "Go to Dashboard" : "Explore platform"} <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" className="link-arrow">
              How it works <ArrowRight size={14} />
            </a>
          </div>

          <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {heroBadges.map((b) => (
              <span
                key={b.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--ink-soft)",
                  border: "1px solid var(--line)",
                  borderRadius: 999,
                  padding: "7px 14px",
                }}
              >
                <b.icon size={14} style={{ color: "var(--blue)" }} />
                {b.label}
              </span>
            ))}
          </div>

          {/* hero visual — live product summary */}
          <div className="hero-visual reveal" data-reveal>
            <div className="hero-visual-inner">
              <div className="browser-dots">
                <span />
                <span />
                <span />
              </div>
              <div className="mock-grid">
                <div className="mock-sidebar">
                  {["Overview", "Courses", "Certificates", "Analytics", "Settings"].map((item, i) => (
                    <div key={item} className={`item${i === 0 ? " active" : ""}`}>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mock-main">
                  <h4>Platform overview</h4>
                  <p>Live snapshot across all departments</p>
                  <div className="mock-cards">
                    {statBar.map((s) => (
                      <div key={s.label} className="mock-card">
                        <div className="num">{s.value}</div>
                        <div className="lbl">{s.label.toUpperCase()}</div>
                        <div className="mock-bar-track">
                          <div className="mock-bar-fill" style={{ width: "68%" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- DEPARTMENT PROOF STRIP ---------- */}
      <div className="proof">
        <div className="wrap">
          <p className="proof-label">Trusted by government departments across India</p>
          <div className="dept-marquee">
            <div className="dept-track">
              {[...govDepartments, ...govDepartments].map((d, i) => (
                <div className="dept-pill" key={`${d.name}-${i}`}>
                  <span className="dept-ico">
                    <d.icon size={18} />
                  </span>
                  <span>{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- TRUST STRIP ---------- */}
      <section style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="wrap">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 32,
            }}
            className="reveal"
            data-reveal
          >
            {trustStrip.map((s) => (
              <div key={s.title} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "var(--step-hover)",
                    border: "1px solid var(--line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 4,
                  }}
                >
                  <s.icon size={17} style={{ color: "var(--blue)" }} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{s.title}</p>
                <p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- STAT STRIP ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="stat-strip reveal" data-reveal>
            {statBar.map((s) => (
              <div className="stat" key={s.label}>
                <h5>{s.value}+</h5>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ABOUT STATEMENT ---------- */}
      <section className="statement">
        <div className="wrap">
          <p className="reveal" data-reveal>
            An initiative of the <span className="hi">Capacity Building Commission</span>,
            Capacity Connect brings a <span className="dim">seamless</span> digital experience
            to training, assessments and knowledge sharing — so every department can plan{" "}
            <span className="hi">competency growth</span> in one place.
          </p>
          <div style={{ marginTop: 28 }}>
            <Link to="/about" className="link-arrow">
              Learn more about us <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- PORTAL PICKER ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-label">
                <Sparkles size={13} /> Portals
              </div>
              <h2 className="sec-title reveal" data-reveal>
                Choose your portal
              </h2>
              <p className="sec-sub">Each role has a dedicated dashboard experience with its own navigation.</p>
            </div>
          </div>

          <div className="portal-grid">
            {portals.map((p) => (
              <div className="portal-card reveal" data-reveal key={p.role}>
                <div className="portal-icon">
                  <p.icon />
                </div>
                <h3>{p.role}</h3>
                <p>{p.desc}</p>
                <ul className="portal-points">
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <Link to={session ? dashboardPath : p.to} className="btn btn-primary">
                  Open {p.role} dashboard <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section id="how-it-works" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-label">
                <Layers size={13} /> Journey
              </div>
              <h2 className="sec-title reveal" data-reveal>
                How it works
              </h2>
              <p className="sec-sub">A simple four-step journey from registration to verified certification.</p>
            </div>
          </div>

          <div className="process reveal" data-reveal>
            {steps.map((s, i) => (
              <div className="p-step" key={s.title}>
                <div className="p-num">{String(i + 1).padStart(2, "0")}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-label">
                <BadgeCheck size={13} /> Capabilities
              </div>
              <h2 className="sec-title reveal" data-reveal>
                Platform capabilities
              </h2>
              <p className="sec-sub">Everything trainees, trainers and administrators need on a single platform.</p>
            </div>
          </div>

          <div className="feature-grid">
            {features.map((f) => (
              <div className="fcard reveal" data-reveal key={f.title}>
                <div className="fmedia">
                  <span className="ftag">{f.tag}</span>
                  <f.icon size={30} style={{ color: "rgba(255,255,255,0.85)" }} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section style={{ background: "var(--bg-card)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div style={{ textAlign: "center" }}>
            <div className="sec-label" style={{ justifyContent: "center" }}>
              <ClipboardCheck size={13} /> FAQ
            </div>
            <h2 className="sec-title reveal" data-reveal style={{ margin: "0 auto", textAlign: "center" }}>
              Frequently asked questions
            </h2>
            <p className="sec-sub" style={{ margin: "18px auto 0" }}>
              Got questions about onboarding, certification or security?
            </p>
          </div>

          <div style={{ marginTop: 48 }}>
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA BANNER ---------- */}
      <section>
        <div className="wrap">
          <div className="cta-banner reveal" data-reveal>
            <h2>Start building capability.</h2>
            <p>
              Join thousands of government employees advancing their skills through the
              Capacity Building Commission's official learning portal.
            </p>
            <div className="hero-ctas">
              <Link to={session ? dashboardPath : "/login"} className="btn btn-white btn-lg">
                {session ? "Go to Dashboard" : "Get started"} <ArrowRight size={16} />
              </Link>
              <a href="#top" className="link-arrow" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}>
                Back to top
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <div className="brand">
                <BrandLogo className="!h-9 !w-auto !max-w-[200px]" />
              </div>
              <p>
                Digital capacity building portal of the Capacity Building Commission, Government of India.
              </p>
            </div>
            <div className="foot-col">
              <h6>Platform</h6>
              <a href="#top">Home</a>
              <Link to="/about">About</Link>
              <a href="#how-it-works">How it works</a>
            </div>
            <div className="foot-col">
              <h6>Portals</h6>
              <Link to="/login">Trainee</Link>
              <Link to="/login">Trainer</Link>
              <Link to="/admin-login">Admin</Link>
            </div>
            <div className="foot-col">
              <h6>Company</h6>
              <Link to="/contact">Contact</Link>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© {new Date().getFullYear()} Capacity Building Commission, Government of India. All rights reserved.</span>
            <span>Made for government departments across India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="faq-item">
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          textAlign: "left",
          background: "transparent",
          border: "none",
          padding: "18px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          cursor: "pointer",
        }}
      >
        <span className="faq-q">{q}</span>
        <ArrowRight
          size={15}
          style={{
            flexShrink: 0,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
            color: "var(--blue)",
          }}
        />
      </button>
      {open && <p className="faq-a" style={{ paddingBottom: 18 }}>{a}</p>}
    </div>
  );
}

export default Landing;
