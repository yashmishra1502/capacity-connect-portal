import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Users, ShieldCheck, ArrowRight } from "lucide-react";
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

function Landing() {
  return (
    <div className="min-h-screen bg-background">
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
          <Button asChild size="sm">
            <Link to="/trainee">Enter portal</Link>
          </Button>
        </div>
      </header>

      <section className="brand-gradient">
        <div className="mx-auto max-w-6xl px-5 py-20 text-navy-foreground">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-foreground/70">
            Digital Capacity Building &amp; Learning Management
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight md:text-5xl">
            One portal for training, assessment and competency planning across departments.
          </h1>
          <p className="mt-5 max-w-2xl text-sm text-navy-foreground/80 md:text-base">
            Capacity Connect brings trainees, trainers and administrators onto a single platform —
            structured courses, verified certification, live analytics and skill-based trainer
            matching.
          </p>
          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["Users", adminStats.users.toLocaleString()],
              ["Courses", adminStats.courses],
              ["Enrollments", adminStats.enrollments.toLocaleString()],
              ["Certificates", adminStats.certificates.toLocaleString()],
            ].map(([l, v]) => (
              <div key={l as string}>
                <p className="font-display text-2xl font-bold">{v}</p>
                <p className="text-xs text-navy-foreground/70">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <footer className="border-t py-8">
        <p className="text-center text-xs text-muted-foreground">
          Capacity Connect · Demonstration interface with sample data
        </p>
      </footer>
    </div>
  );
}
