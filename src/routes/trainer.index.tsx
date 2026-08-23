import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Users, ClipboardList, Star, Plus, Clock, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/stat-card";

export const Route = createFileRoute("/trainer/")({
  head: () => ({
    meta: [{ title: "Dashboard — Trainer Portal · Capacity Connect" }],
  }),
  component: TrainerDashboard,
});

const myCourses = [
  { title: "Digital Leadership Basics", enrolled: 128, progress: 76, rating: 4.8 },
  { title: "Communication Skills", enrolled: 94, progress: 61, rating: 4.6 },
  { title: "Data Analysis Fundamentals", enrolled: 156, progress: 84, rating: 4.9 },
  { title: "Public Financial Management", enrolled: 34, progress: 22, rating: 4.5 },
];

const upcoming = [
  { title: "Live Q&A — Digital Leadership", time: "Today, 4:00 PM" },
  { title: "Assessment review — Comm. Skills", time: "Tomorrow, 11:00 AM" },
  { title: "Cohort onboarding call", time: "Fri, 2:30 PM" },
];

function TrainerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            An overview of your courses, cohorts and upcoming sessions.
          </p>
        </div>
        <Button size="sm" className="gap-1.5" asChild>
          <a href="/trainer/courses/create">
            <Plus className="size-4" /> New course
          </a>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="Active courses" value="6" trend="+1 this month" trendUp accent="indigo" />
        <StatCard icon={Users} label="Enrolled trainees" value="412" trend="+38 this month" trendUp accent="violet" />
        <StatCard icon={Star} label="Average rating" value="4.7" trend="Top 10%" trendUp accent="amber" />
        <StatCard icon={ClipboardList} label="Pending reviews" value="9" trend="Due soon" accent="emerald" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-display text-sm font-bold">My courses</CardTitle>
            <Button variant="link" size="sm" className="h-auto px-0 text-xs" asChild>
              <a href="/trainer/courses">View all</a>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {myCourses.map((c) => (
              <div key={c.title} className="rounded-md border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold leading-tight">{c.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{c.enrolled} trainees enrolled</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-600">
                    <Star className="size-3.5 fill-amber-500 text-amber-500" /> {c.rating}
                  </div>
                </div>
                <div className="mt-2.5">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Average completion</span>
                    <span>{c.progress}%</span>
                  </div>
                  <Progress value={c.progress} className="h-1.5" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Upcoming</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map((u) => (
              <div key={u.title} className="flex items-start gap-2.5 rounded-md border p-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="size-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium leading-tight">{u.title}</p>
                  <p className="text-[10px] text-muted-foreground">{u.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full text-xs">View full schedule</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-display text-sm font-bold">Recent trainee feedback</CardTitle>
          <MessageSquare className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
            Feedback stream placeholder — hook up to submissions API
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
