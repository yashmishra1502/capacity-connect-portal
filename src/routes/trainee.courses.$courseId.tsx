import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  FileCheck2,
  PlayCircle,
  Star,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { courseModules, courses, resources } from "@/lib/mock-data";

export const Route = createFileRoute("/trainee/courses/$courseId")({
  loader: ({ params }) => {
    const course = courses.find((c) => c.id === params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.course.title ?? "Course"} — Trainee · Capacity Connect` },
      {
        name: "description",
        content: loaderData?.course.description ?? "Course detail and module progress.",
      },
    ],
  }),
  component: CourseDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
      <p className="font-display text-2xl font-bold">Course not found</p>
      <p className="text-sm text-muted-foreground">
        This course may have been unpublished or the link is out of date.
      </p>
      <Link to="/trainee/courses">
        <Button variant="outline" className="gap-1.5 rounded-full">
          <ArrowLeft className="size-3.5" /> Back to courses
        </Button>
      </Link>
    </div>
  ),
});

const MODULE_TYPE_ICON: Record<string, typeof PlayCircle> = {
  Video: PlayCircle,
  Reading: BookOpen,
  "Case Study": FileCheck2,
  Workshop: Users,
  Assessment: FileCheck2,
};

function CourseDetail() {
  const { course } = Route.useLoaderData();
  const [modules, setModules] = useState(courseModules);

  const doneCount = modules.filter((m) => m.done).length;
  const computedProgress = Math.round((doneCount / modules.length) * 100);
  const courseResources = resources.filter((r) => r.course === course.code);

  const toggleModule = (id: number) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m)),
    );
  };

  return (
    <div className="space-y-8">
      <Link
        to="/trainee/courses"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to courses
      </Link>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-full uppercase tracking-wide">{course.category}</Badge>
          <Badge variant="outline" className="rounded-full">
            {course.level}
          </Badge>
          <span className="flex items-center gap-1 text-sm font-semibold text-warning">
            <Star className="size-4 fill-current text-amber-500" /> {course.rating}
          </span>
        </div>
        <h1 className="font-display text-3xl font-bold md:text-4xl">{course.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{course.description}</p>

        <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" /> {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="size-4" /> {course.modules} modules
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-4" /> {course.enrolled.toLocaleString()} enrolled
          </span>
          <span>By {course.trainer}</span>
        </div>
      </header>

      {/* Progress */}
      <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Your progress</p>
            <p className="text-sm font-bold text-primary">{computedProgress}%</p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
              style={{ width: `${computedProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {doneCount} of {modules.length} modules completed
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Module list */}
        <div className="space-y-3 lg:col-span-2">
          <h2 className="font-display text-lg font-bold">Course modules</h2>
          {modules.map((mod, index) => {
            const Icon = MODULE_TYPE_ICON[mod.type] ?? PlayCircle;
            return (
              <Card
                key={mod.id}
                className="cc-page-in border-border/70 bg-card/70 backdrop-blur transition-all duration-300"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <button
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg",
                      mod.done ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {mod.done ? <CheckCircle2 className="size-4.5" /> : <Circle className="size-4.5" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate text-sm font-semibold",
                        mod.done && "text-muted-foreground line-through decoration-1",
                      )}
                    >
                      {mod.title}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon className="size-3.5" /> {mod.type} · {mod.duration}
                    </p>
                  </div>
                </button>
              </Card>
            );
          })}
        </div>

        {/* Sidebar: resources + actions */}
        <div className="space-y-4">
          <Card className="border-border/70 bg-card/70 backdrop-blur">
            <CardContent className="space-y-3 p-5">
              <h3 className="font-display text-sm font-bold">Take action</h3>
              <Link to="/trainee/assessment" className="block">
                <Button className="cc-btn-glass w-full gap-1.5 rounded-full">
                  <FileCheck2 className="size-3.5" /> Go to assessment
                </Button>
              </Link>
              <Link to="/trainee/resources" className="block">
                <Button variant="outline" className="w-full gap-1.5 rounded-full">
                  <BookOpen className="size-3.5" /> All resources
                </Button>
              </Link>
            </CardContent>
          </Card>

          {courseResources.length > 0 && (
            <Card className="border-border/70 bg-card/70 backdrop-blur">
              <CardContent className="space-y-3 p-5">
                <h3 className="font-display text-sm font-bold">Course resources</h3>
                <div className="space-y-2">
                  {courseResources.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-lg border border-border/70 p-3 text-xs"
                    >
                      <p className="font-medium">{r.title}</p>
                      <p className="mt-0.5 text-muted-foreground">
                        {r.type} · {r.size}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
