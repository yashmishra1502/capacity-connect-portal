import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader, Section, SimpleTable, StatCard } from "@/components/kit";
import { achievements } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/trainee/achievements")({
  component: Achievements,
});

const leaderboard = [
  { rank: 1, name: "Sneha Kulkarni", dept: "Women & Child", points: 1420 },
  { rank: 2, name: "Priya Sharma", dept: "Health", points: 1310 },
  { rank: 3, name: "Yash Mishra", dept: "Rural Development", points: 1180 },
  { rank: 4, name: "Ananya Das", dept: "Education", points: 1045 },
  { rank: 5, name: "Fatima Sheikh", dept: "Social Justice", points: 980 },
];

function Achievements() {
  const earned = achievements.filter((a) => a.earned);
  const points = earned.reduce((s, a) => s + a.points, 0);

  return (
    <>
      <PageHeader title="Achievements" subtitle="Badges, points and departmental leaderboard" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Badges earned" value={`${earned.length} / ${achievements.length}`} />
        <StatCard label="Total points" value={points} tone="success" />
        <StatCard label="Leaderboard rank" value="#3" tone="info" />
        <StatCard label="Next badge at" value="1,300 pts" tone="warning" />
      </div>

      <div className="mt-6">
        <Progress value={(points / 1300) * 100} className="h-2" />
        <p className="mt-2 text-xs text-muted-foreground">
          {1300 - points} points to unlock the Capacity Champion badge.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {achievements.map((a) => (
          <Card key={a.id} className={cn(!a.earned && "opacity-70")}>
            <CardContent className="flex gap-4 p-5">
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-md",
                  a.earned ? "bg-warning/20 text-warning-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {a.earned ? <Trophy className="size-5" /> : <Lock className="size-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{a.title}</h3>
                  <Badge variant="secondary" className="text-[10px]">
                    {a.points} pts
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
                <p className="mt-2 text-[11px] font-medium">
                  {a.earned ? "Earned" : "Locked"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Section title="Leaderboard" description="Top learners this quarter">
          <SimpleTable
            columns={["Rank", "Name", "Department", "Points"]}
            rows={leaderboard.map((l) => ({
              key: String(l.rank),
              cells: [
                <span className="font-display font-bold">#{l.rank}</span>,
                <span className={cn("font-medium", l.name === "Yash Mishra" && "text-primary")}>
                  {l.name}
                </span>,
                l.dept,
                <span className="tabular-nums">{l.points}</span>,
              ],
            }))}
          />
        </Section>
      </div>
    </>
  );
}
