import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Target,
  ShieldCheck,
  Users2,
  BarChart4,
  Building2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BrandIcon } from "@/components/brand-logo";

// ================================================================
// PASTE: src/routes/about.tsx  (naya file banao)
// Route path automatically "/about" ban jayega (TanStack file-based routing)
// Navbar me "About" link already hai — usko `to="/about"` bana dena
// ================================================================

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
  return (
    <div className="min-h-screen bg-background">
      {/* ---------- HEADER ---------- */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandIcon size={36} className="rounded-md bg-primary p-1.5" />
            <div>
              <p className="font-display text-sm font-bold tracking-tight">CAPACITY CONNECT</p>
              <p className="text-[11px] text-muted-foreground">Capacity Building Commission</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <a href="#" className="border-b-2 border-primary pb-1 text-foreground">About</a>
            <Link to="/" hash="how-it-works" className="hover:text-foreground">How it works</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
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
        <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-cyan-400/15 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 top-0 size-96 rounded-full bg-cyan-400/15 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center text-navy-foreground">
          <p className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 bg-navy-foreground/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-navy-foreground/80">
            <Building2 className="size-3.5" />
            An initiative under the Capacity Building Commission
          </p>
          <h1 className="mt-6 font-display text-3xl font-bold leading-tight md:text-4xl">
            Building a unified capacity building framework for government
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-navy-foreground/80 md:text-base">
            Capacity Connect standardises how government departments train, assess and certify
            personnel — replacing fragmented processes with one transparent, verifiable and
            data-driven platform.
          </p>
        </div>
      </section>

      {/* ---------- MISSION / VISION / MANDATE ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((p) => (
            <Card key={p.title} className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <h3 className="font-display text-base font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- OBJECTIVES ---------- */}
      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <h2 className="font-display text-xl font-bold">What the platform delivers</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Four core outcomes guide the design of Capacity Connect, in line with the
              competency-based training mandate of the Commission.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {objectives.map((o) => (
              <Card key={o.title}>
                <CardContent className="flex gap-4 p-6">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent/15">
                    <o.icon className="size-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold">{o.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{o.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ROLLOUT TIMELINE ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-xl font-bold">Rollout roadmap</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Capacity Connect is being rolled out in phases, starting with a needs assessment
          across participating departments.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {timeline.map((t, i) => (
            <div key={t.year} className="relative pl-6">
              <div className="absolute left-0 top-1.5 flex size-3 items-center justify-center rounded-full bg-primary" />
              {i !== timeline.length - 1 && (
                <div className="absolute left-[5px] top-5 hidden h-[calc(100%+1.5rem)] w-px bg-border md:block" />
              )}
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">{t.year}</p>
              <h3 className="mt-1 font-display text-sm font-semibold">{t.label}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- COMPLIANCE / TRUST STRIP ---------- */}
      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-3">
          <TrustPoint text="Aligned with Mission Karmayogi's competency framework" />
          <TrustPoint text="Role-based access for trainees, trainers and administrators" />
          <TrustPoint text="Data handled as per Government of India IT security guidelines" />
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-4xl px-5 py-16 text-center">
        <h2 className="font-display text-xl font-bold">Ready to get started?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Sign in to your role-based dashboard to begin training, teaching or administering
          programmes on Capacity Connect.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/trainee">
            Enter portal <ArrowRight className="ml-1.5 size-4" />
          </Link>
        </Button>
      </section>

      <footer className="border-t py-8">
        <p className="text-center text-xs text-muted-foreground">
          Capacity Connect · Demonstration interface with sample data
        </p>
      </footer>
    </div>
  );
}

function TrustPoint({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
      <p className="text-sm text-foreground">{text}</p>
    </div>
  );
}
