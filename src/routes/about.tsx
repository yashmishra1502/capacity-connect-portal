import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Target,
  ShieldCheck,
  Users2,
  BarChart4,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import "../landing.css";
import { BrandIcon, BrandLogo } from "@/components/brand-logo";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Capacity Connect" },
      {
        name: "description",
        content:
          "About Capacity Connect — a digital capacity building and learning management initiative under the Capacity Building Commission.",
      },
    ],
  }),
  component: About,
});

const objectives = [
  {
    icon: Target,
    title: "Standardised training delivery",
    desc: "A single framework for course design, delivery and assessment across departments and cadres.",
  },
  {
    icon: ShieldCheck,
    title: "Verified competency records",
    desc: "Tamper-evident certification tied to a trainee's service record, recognised across departments.",
  },
  {
    icon: Users2,
    title: "Skill-based trainer matching",
    desc: "Trainers are matched to programmes based on domain expertise, availability and past outcomes.",
  },
  {
    icon: BarChart4,
    title: "Real-time monitoring",
    desc: "Dashboards for administrators to track enrolment, completion and competency gaps at scale.",
  },
];

const pillars = [
  {
    title: "Mission",
    body: "To build a unified, transparent and measurable capacity building ecosystem for government personnel — replacing fragmented, paper-based training records with a single verified digital platform.",
  },
  {
    title: "Vision",
    body: "A future where every government employee has a continuously updated, verifiable skill and competency profile that informs postings, promotions and further training needs.",
  },
  {
    title: "Mandate",
    body: "Developed in line with the objectives of the Capacity Building Commission, to institutionalise Mission Karmayogi's competency-based framework at scale.",
  },
];

const timeline = [
  { year: "Phase 1", label: "Needs assessment", desc: "Mapping departmental training gaps and existing course inventories." },
  { year: "Phase 2", label: "Platform rollout", desc: "Trainee, trainer and admin portals deployed with role-based access." },
  { year: "Phase 3", label: "Certification integration", desc: "Verified certificates linked to service records and competency maps." },
  { year: "Phase 4", label: "Nationwide scale-up", desc: "Onboarding of additional departments, cohorts and training partners." },
];

function About() {
  useScrollReveal();

  return (
    <div className="ccl">
      {/* ---------- HEADER ---------- */}
      <header>
        <nav>
          <Link to="/" className="brand">
            <BrandIcon size={30} className="rounded-md" />
            <span className="brand-name">
              CAPACITY <span>CONNECT</span>
            </span>
          </Link>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <a className="active" href="#top">About</a>
            <Link to="/" hash="how-it-works">How it works</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="nav-cta">
            <Link to="/login" className="btn-ghost">Login</Link>
            <Link to="/login" className="btn btn-primary">
              Enter portal <ArrowRight size={15} />
            </Link>
          </div>
        </nav>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="page-hero" id="top">
        <div className="wrap">
          <div className="eyebrow">
            <Building2 size={13} /> An initiative under the Capacity Building Commission
          </div>
          <h1 className="cc-hero-in">Building a unified capacity building framework for government</h1>
          <p className="cc-hero-in cc-delay-1">
            Capacity Connect standardises how government departments train, assess and certify
            personnel — replacing fragmented processes with one transparent, verifiable and
            data-driven platform.
          </p>
        </div>
      </section>

      {/* ---------- MISSION / VISION / MANDATE ---------- */}
      <section>
        <div className="wrap">
          <div className="pillar-grid">
            {pillars.map((p) => (
              <div className="pillar-card reveal" data-reveal key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- OBJECTIVES ---------- */}
      <section style={{ background: "var(--bg-card)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-label">
                <Sparkles size={13} /> Outcomes
              </div>
              <h2 className="sec-title reveal" data-reveal>What the platform delivers</h2>
              <p className="sec-sub">
                Four core outcomes guide the design of Capacity Connect, in line with the
                competency-based training mandate of the Commission.
              </p>
            </div>
          </div>

          <div className="obj-grid">
            {objectives.map((o) => (
              <div className="obj-card reveal" data-reveal key={o.title}>
                <div className="obj-icon">
                  <o.icon size={19} />
                </div>
                <div>
                  <h3>{o.title}</h3>
                  <p>{o.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ROLLOUT TIMELINE ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-label">
                <Target size={13} /> Roadmap
              </div>
              <h2 className="sec-title reveal" data-reveal>Rollout roadmap</h2>
              <p className="sec-sub">
                Capacity Connect is being rolled out in phases, starting with a needs assessment
                across participating departments.
              </p>
            </div>
          </div>

          <div className="cc-timeline reveal" data-reveal>
            {timeline.map((t) => (
              <div className="tl-item" key={t.year}>
                <p className="tl-phase">{t.year}</p>
                <h4>{t.label}</h4>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- COMPLIANCE / TRUST STRIP ---------- */}
      <section style={{ background: "var(--bg-card)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "56px 0" }}>
        <div className="wrap">
          <div className="trust-check-grid">
            <div className="trust-check reveal" data-reveal>
              <CheckCircle2 size={16} />
              <span>Aligned with Mission Karmayogi's competency framework</span>
            </div>
            <div className="trust-check reveal" data-reveal>
              <CheckCircle2 size={16} />
              <span>Role-based access for trainees, trainers and administrators</span>
            </div>
            <div className="trust-check reveal" data-reveal>
              <CheckCircle2 size={16} />
              <span>Data handled as per Government of India IT security guidelines</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section style={{ textAlign: "center" }}>
        <div className="wrap" style={{ maxWidth: 620 }}>
          <h2 className="sec-title reveal" data-reveal style={{ margin: "0 auto", textAlign: "center", maxWidth: "none" }}>
            Ready to get started?
          </h2>
          <p className="sec-sub" style={{ margin: "16px auto 0" }}>
            Sign in to your role-based dashboard to begin training, teaching or administering
            programmes on Capacity Connect.
          </p>
          <div style={{ marginTop: 30, display: "flex", justifyContent: "center" }}>
            <Link to="/login" className="btn btn-primary btn-lg">
              Enter portal <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer>
        <div className="wrap" style={{ textAlign: "center", padding: "20px 0" }}>
          <p style={{ fontSize: 12, color: "var(--muted-label)" }}>
            Capacity Connect · Demonstration interface with sample data
          </p>
        </div>
      </footer>
    </div>
  );
}
