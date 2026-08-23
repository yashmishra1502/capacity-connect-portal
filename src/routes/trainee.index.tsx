import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { currentUsers, courses } from "@/lib/mock-data";

export const Route = createFileRoute("/trainee/")({
  head: () => ({
    meta: [{ title: "Dashboard — Trainee Portal · Capacity Connect" }],
  }),
  component: TraineeDashboard,
});

function TraineeDashboard() {
  const user = currentUsers.trainee;
  const myCourses = courses.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{user.title} · {user.dept}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="Enrolled courses" value="6" trend="2 in progress" accent="indigo" />
        <StatCard icon={Clock} label="Learning hours" value="64 hrs" trend="+9 hrs this week" trendUp accent="violet" />
        <StatCard icon={TrendingUp} label="Average score" value="86%" trend="Across 4 assessments" trendUp accent="emerald" />
        <StatCard icon={Award} label="Certificates" value="3" trend="1 pending completion" accent="amber" />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-display text-sm font-bold">Continue where you left off</CardTitle>
          <Button variant="link" size="sm" className="h-auto px-0 text-xs" asChild>
            <a href="/trainee/courses">All courses</a>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {myCourses.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-md border p-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">{c.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{c.code} · {c.trainer}</p>
                <div className="mt-2 w-48">
                  <Progress value={c.progress} className="h-1.5" />
                </div>
              </div>
              <Badge variant="secondary" className="shrink-0 text-[10px]">{c.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
