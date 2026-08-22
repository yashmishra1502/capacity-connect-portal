import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { CheckCircle2, Circle, Download, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Section, StatCard, StatusBadge } from "@/components/kit";
import { courseModules, courses, resources, feedbackEntries } from "@/lib/mock-data";

export const Route = createFileRoute("/trainee/courses/$courseId")({
  component: CourseDetails,
});

function CourseDetails() {
  const { courseId } = useParams({ from: "/trainee/courses/$courseId" });
  const course = courses.find((c) => c.id === courseId) ?? courses[0]!;

  return (
    <>
      <PageHeader
        title={course.title}
        subtitle={`${course.code} · ${course.trainer} · ${course.level} · ${course.duration}`}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/trainee/resources">Resources</Link>
            </Button>
            <Button asChild>
              <Link to="/trainee/assessment">Take assessment</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Progress" value={`${course.progress}%`} hint="5 of 8 modules done" />
        <StatCard label="Enrolled" value={course.enrolled} hint="Across 4 batches" tone="info" />
        <StatCard label="Rating" value={`★ ${course.rating}`} hint="From 260 reviews" tone="warning" />
        <StatCard label="Status" value={course.status} tone="success" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="modules">
            <TabsList>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="mt-4">
              <Section title="Course content" description={`${courseModules.length} modules`}>
                <ul className="space-y-2">
                  {courseModules.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center justify-between gap-3 rounded-md border p-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {m.done ? (
                          <CheckCircle2 className="size-4 shrink-0 text-success" />
                        ) : (
                          <Circle className="size-4 shrink-0 text-muted-foreground" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {m.id}. {m.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {m.type} · {m.duration}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant={m.done ? "outline" : "default"} className="shrink-0">
                        <PlayCircle className="mr-1.5 size-3.5" />
                        {m.done ? "Revisit" : "Start"}
                      </Button>
                    </li>
                  ))}
                </ul>
              </Section>
            </TabsContent>

            <TabsContent value="overview" className="mt-4">
              <Section title="About this course">
                <p className="text-sm text-muted-foreground">{course.description}</p>
                <h4 className="mt-5 text-sm font-semibold">Learning outcomes</h4>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  {[
                    "Frame policy problems using evidence and field data",
                    "Conduct stakeholder and feasibility analysis",
                    "Apply cost-benefit techniques to scheme design",
                    "Build monitoring and evaluation frameworks",
                  ].map((o) => (
                    <li key={o} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                      {o}
                    </li>
                  ))}
                </ul>
                <h4 className="mt-5 text-sm font-semibold">Eligibility</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Officers of Group A / Group B with a minimum of 2 years of field experience.
                </p>
              </Section>
            </TabsContent>

            <TabsContent value="resources" className="mt-4">
              <Section title="Attached resources">
                <ul className="space-y-2">
                  {resources.slice(0, 4).map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{r.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.type} · {r.size} · {r.uploaded}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="mr-1.5 size-3.5" /> Download
                      </Button>
                    </li>
                  ))}
                </ul>
              </Section>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <Section title="Trainee reviews">
                <ul className="space-y-4">
                  {feedbackEntries.map((f) => (
                    <li key={f.id} className="border-b pb-3 last:border-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{f.trainee}</p>
                        <Badge variant="secondary">★ {f.rating}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{f.comment}</p>
                      <p className="mt-1 text-xs text-muted-foreground/70">{f.date}</p>
                    </li>
                  ))}
                </ul>
              </Section>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Section title="Your progress">
            <Progress value={course.progress} className="h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {course.progress}% complete · estimated 6 hrs remaining
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Modules completed</span>
                <span className="font-medium">5 / 8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quizzes attempted</span>
                <span className="font-medium">3 / 5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Attendance</span>
                <span className="font-medium">94%</span>
              </div>
            </div>
          </Section>
          <Section title="Trainer">
            <p className="text-sm font-semibold">{course.trainer}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Senior Faculty · 14 years experience · 4.7 rating
            </p>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              Message trainer
            </Button>
          </Section>
          <Section title="Certificate">
            <p className="text-sm text-muted-foreground">
              Available after completing all modules and scoring 60% or above.
            </p>
            <div className="mt-3">
              <StatusBadge status={course.status === "Completed" ? "Completed" : "Pending"} />
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}
