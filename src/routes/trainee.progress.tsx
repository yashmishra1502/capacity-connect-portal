import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Award, Clock, Flame, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { courses, skillRadar, weeklyProgress } from "@/lib/mock-data";

export const Route = createFileRoute("/trainee/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Trainee · Capacity Connect" },
      {
        name: "description",
        content: "Track your weekly learning hours, skill growth and course completion.",
      },
    ],
  }),
  component: TraineeProgress,
});

function TraineeProgress() {
  const totalHours = weeklyProgress.reduce((acc, w) => acc + w.hours, 0);
  const latestScore = weeklyProgress[weeklyProgress.length - 1]?.score ?? 0;
  const firstScore = weeklyProgress[0]?.score ?? 0;
  const scoreDelta = latestScore - firstScore;
  const avgCourseProgress = Math.round(
    courses.reduce((acc, c) => acc + c.progress, 0) / courses.length,
  );
  const strongestSkill = [...skillRadar].sort((a, b) => b.value - a.value)[0];

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
          Learning Analytics
        </Badge>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Your Progress</h1>
        <p className="max-w-2xl text-muted-foreground">
          A running view of your learning hours, assessment scores and competency growth over
          the last six weeks.
        </p>
      </header>

      {/* Stat strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Clock} label="Hours (6 weeks)" value={`${totalHours}h`} />
        <StatCard
          icon={TrendingUp}
          label="Score trend"
          value={`${scoreDelta >= 0 ? "+" : ""}${scoreDelta} pts`}
          accent={scoreDelta >= 0 ? "text-success" : "text-destructive"}
        />
        <StatCard icon={Award} label="Avg. course progress" value={`${avgCourseProgress}%`} />
        <StatCard icon={Flame} label="Strongest skill" value={strongestSkill?.skill ?? "—"} />
      </div>

      {/* Weekly hours + score chart */}
      <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="space-y-4 p-5">
          <div>
            <h2 className="font-display text-base font-bold">Weekly learning activity</h2>
            <p className="text-xs text-muted-foreground">Hours studied and average assessment score, per week.</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyProgress} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="hoursFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-info)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-info)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  name="Hours"
                  stroke="var(--color-primary)"
                  fill="url(#hoursFill)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  name="Score"
                  stroke="var(--color-info)"
                  fill="url(#scoreFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Skill radar */}
        <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
          <CardContent className="space-y-4 p-5">
            <div>
              <h2 className="font-display text-base font-bold">Competency map</h2>
              <p className="text-xs text-muted-foreground">Relative strength across core skill areas.</p>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillRadar}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <Radar
                    dataKey="value"
                    stroke="var(--color-primary)"
                    fill="var(--color-primary)"
                    fillOpacity={0.28}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Course progress list */}
        <Card className="border-border/70 bg-card/70 backdrop-blur">
          <CardContent className="space-y-4 p-5">
            <div>
              <h2 className="font-display text-base font-bold">Course completion</h2>
              <p className="text-xs text-muted-foreground">Progress across your enrolled courses.</p>
            </div>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate pr-2 font-medium">{course.title}</span>
                    <span className="shrink-0 font-semibold text-muted-foreground">{course.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700 ease-out",
                        course.progress === 100
                          ? "bg-success"
                          : course.progress > 0
                            ? "bg-primary"
                            : "bg-muted-foreground/30",
                      )}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
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
  icon: typeof Clock;
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
