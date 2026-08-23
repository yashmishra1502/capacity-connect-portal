import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Award,
  TrendingUp,
  Bell,
  PlayCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/trainee/")({
  head: () => ({
    meta: [{ title: "Dashboard — Trainee Portal · Capacity Connect" }],
  }),
  component: TraineeDashboard,
});

const activeCourses = [
  { title: "Digital Leadership Basics", progress: 82, nextLesson: "Module 5: Delegation" },
  { title: "Communication Skills", progress: 45, nextLesson: "Module 3: Active listening" },
  { title: "Data Analysis Fundamentals", progress: 100, nextLesson: "Completed" },
];

const deadlines = [
  { title: "Assessment — Communication Skills", due: "Due in 2 days" },
  { title: "Project submission — Data Analysis", due: "Due in 5 days" },
];

function TraineeDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick up where you left off and stay on top of upcoming deadlines.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="Enrolled courses" value="6" accent="indigo" />
        <StatCard icon={Award} label="Certificates earned" value="3" trend="+1 this month" trendUp accent="amber" />
        <StatCard icon={TrendingUp} label="Average progress" value="72%" trend="+8%" trendUp accent="emerald" />
        <StatCard icon={Calendar} label="Upcoming deadlines" value="2" accent="violet" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-display text-sm font-bold">Continue learning</CardTitle>
            <Button variant="link" size="sm" className="h-auto px-0 text-xs" asChild>
              <a href="/trainee/courses">View all courses</a>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeCourses.map((c) => (
              <div key={c.title} className="rounded-md border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold leading-tight">{c.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{c.nextLesson}</p>
                  </div>
                  {c.progress === 100 ? (
                    <Badge className="gap-1 bg-emerald-500/10 text-[10px] text-emerald-600 hover:bg-emerald-500/10">
                      <CheckCircle2 className="size-3" /> Complete
                    </Badge>
                  ) : (
                    <Button size="sm" className="h-7 gap-1 px-2.5 text-xs">
                      <PlayCircle className="size-3.5" /> Resume
                    </Button>
                  )}
                </div>
                <div className="mt-2.5">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Progress</span>
                    <span>{c.progress}%</span>
                  </div>
                  <Progress value={c.progress} className="h-1.5" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-sm font-bold">Upcoming deadlines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {deadlines.map((d) => (
                <div key={d.title} className="flex items-start gap-2.5 rounded-md border p-2.5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                    <Bell className="size-3.5 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium leading-tight">{d.title}</p>
                    <p className="text-[10px] text-muted-foreground">{d.due}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-sm font-bold">Overall progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-2">
                <div
                  className="flex size-24 items-center justify-center rounded-full"
                  style={{
                    background: "conic-gradient(#4f46e5 0deg 259deg, #e5e7eb 259deg 360deg)",
                  }}
                >
                  <div className="flex size-[72px] items-center justify-center rounded-full bg-card">
                    <span className="font-display text-lg font-bold">72%</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-[11px] text-muted-foreground">
                Across all enrolled courses
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
