import { createFileRoute } from "@tanstack/react-router";
import { Award, Lock, Sparkles, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { achievements } from "@/lib/mock-data";

export const Route = createFileRoute("/trainee/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — Trainee · Capacity Connect" },
      {
        name: "description",
        content: "Track badges and points earned through consistent learning and performance.",
      },
    ],
  }),
  component: TraineeAchievements,
});

function TraineeAchievements() {
  const earned = achievements.filter((a) => a.earned);
  const locked = achievements.filter((a) => !a.earned);
  const totalPoints = earned.reduce((acc, a) => acc + a.points, 0);
  const maxPoints = achievements.reduce((acc, a) => acc + a.points, 0);
  const pct = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
          Recognition
        </Badge>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Achievements</h1>
        <p className="max-w-2xl text-muted-foreground">
          Badges earned for consistent learning, strong performance and contribution to your
          cohort.
        </p>
      </header>

      {/* Points summary */}
      <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="space-y-3 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-warning" />
              <p className="font-display text-lg font-bold">
                {totalPoints} <span className="text-sm font-normal text-muted-foreground">/ {maxPoints} points</span>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {earned.length} of {achievements.length} badges earned
            </p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-info transition-all duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Earned */}
      {earned.length > 0 && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <Award className="size-4.5 text-primary" /> Earned
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {earned.map((a, index) => (
              <Card
                key={a.id}
                className="cc-glow-card cc-page-in border-primary/30 bg-primary/5 backdrop-blur transition-all duration-300 hover:shadow-lg"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <CardContent className="flex items-start gap-3.5 p-5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Sparkles className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-sm font-bold">{a.title}</h3>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                    <Badge variant="secondary" className="mt-1 rounded-full text-[10px]">
                      +{a.points} pts
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-muted-foreground">
            <Lock className="size-4.5" /> Locked
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {locked.map((a, index) => (
              <Card
                key={a.id}
                className="cc-page-in border-border/70 bg-card/40 opacity-70 backdrop-blur transition-all duration-300"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <CardContent className="flex items-start gap-3.5 p-5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Lock className="size-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className={cn("font-display text-sm font-bold")}>{a.title}</h3>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                    <Badge variant="outline" className="mt-1 rounded-full text-[10px] text-muted-foreground">
                      +{a.points} pts
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
