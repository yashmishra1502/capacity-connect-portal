import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Award,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  RotateCcw,
  Search,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { results } from "@/lib/mock-data";

export const Route = createFileRoute("/trainee/results")({
  head: () => ({
    meta: [
      { title: "Results — Trainee · Capacity Connect" },
      {
        name: "description",
        content: "Review your assessment history, scores and pass status across all courses.",
      },
    ],
  }),
  component: TraineeResults,
});

/* ---------------- helpers ---------------- */

function statusStyle(status: string) {
  switch (status) {
    case "Passed":
      return "border-success/40 bg-success/10 text-success";
    case "Reattempt":
      return "border-destructive/40 bg-destructive/10 text-destructive";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

function scoreColor(pct: number) {
  if (pct >= 80) return "text-success";
  if (pct >= 60) return "text-warning";
  return "text-destructive";
}

/* ---------------- page ---------------- */

function TraineeResults() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const statuses = useMemo(
    () => ["All", ...Array.from(new Set(results.map((r) => r.status)))],
    [],
  );

  const stats = useMemo(() => {
    const total = results.length;
    const passed = results.filter((r) => r.status === "Passed").length;
    const avgScore = total > 0 ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / total) : 0;
    const best = total > 0 ? Math.max(...results.map((r) => r.score)) : 0;
    return { total, passed, avgScore, best };
  }, []);

  const visible = useMemo(() => {
    return results
      .filter((r) => statusFilter === "All" || r.status === statusFilter)
      .filter((r) => {
        const haystack = `${r.assessment} ${r.course}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [query, statusFilter]);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
          Assessment History
        </Badge>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Your Results</h1>
        <p className="max-w-2xl text-muted-foreground">
          A record of every assessment you've attempted, with scores and pass status linked to
          your service profile.
        </p>
      </header>

      {/* Stat strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BarChart3} label="Attempts" value={String(stats.total)} />
        <StatCard icon={CheckCircle2} label="Passed" value={String(stats.passed)} accent="text-success" />
        <StatCard icon={TrendingUp} label="Average score" value={`${stats.avgScore}%`} />
        <StatCard icon={Trophy} label="Best score" value={`${stats.best}%`} accent="text-warning" />
      </div>

      {/* Filters */}
      <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search assessments, courses…"
              className="h-11 rounded-xl pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatusFilter(item)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300",
                  statusFilter === item
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 text-muted-foreground hover:-translate-y-0.5 hover:text-foreground",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results list */}
      <div className="space-y-3">
        {visible.map((result, index) => {
          const isOpen = expanded === result.id;
          return (
            <Card
              key={result.id}
              className="cc-page-in overflow-hidden border-border/70 bg-card/70 backdrop-blur transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : result.id)}
                className="flex w-full items-center gap-4 p-5 text-left"
              >
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold",
                    statusStyle(result.status),
                  )}
                >
                  {result.status === "Passed" ? <Award className="size-5" /> : <Target className="size-5" />}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold md:text-base">
                    {result.assessment}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {result.course} · {result.date}
                  </p>
                </div>

                <div className="hidden shrink-0 items-center gap-4 sm:flex">
                  <Badge className={cn("rounded-full border uppercase tracking-wide", statusStyle(result.status))}>
                    {result.status}
                  </Badge>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className={cn("font-display text-lg font-bold tabular-nums", scoreColor(result.score))}>
                    {result.score}
                    <span className="text-xs font-medium text-muted-foreground">/{result.total}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border/70 px-5 pb-5 pt-4">
                  <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground sm:hidden">
                    <Badge className={cn("rounded-full border uppercase tracking-wide", statusStyle(result.status))}>
                      {result.status}
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Score breakdown</span>
                      <span>{result.score}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700 ease-out",
                          result.score >= 80
                            ? "bg-success"
                            : result.score >= 60
                              ? "bg-warning"
                              : "bg-destructive",
                        )}
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </div>

                  {result.status === "Reattempt" && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                      <RotateCcw className="size-3.5 shrink-0" />
                      Score fell below the pass mark. Head to Assessments to reattempt this test.
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No results match your search criteria.
        </p>
      )}
    </div>
  );
}

/* ---------------- small components ---------------- */

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof BarChart3;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <p className={cn("font-display text-xl font-bold", accent)}>{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
