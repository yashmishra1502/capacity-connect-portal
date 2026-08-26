import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, Play, Search, Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { courses } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/trainee/courses")({
  head: () => ({
    meta: [
      { title: "Course Catalog — Trainee · Capacity Connect" },
      {
        name: "description",
        content:
          "Browse certified national capacity building courses, filter by domain and open your enrolled learning modules.",
      },
      { property: "og:title", content: "Course Catalog — Capacity Connect" },
      {
        property: "og:description",
        content: "Certified public officer training programmes with domain filters and live progress.",
      },
    ],
  }),
  component: TraineeCourses,
});

function TraineeCourses() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(courses.map((course) => course.category))],
    [],
  );

  const visible = courses.filter((course) => {
    const matchesCategory = category === "All" || course.category === category;
    const haystack = `${course.title} ${course.trainer} ${course.category} ${course.code}`.toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
          Capacity Catalog
        </Badge>
        <h1 className="font-display text-3xl font-bold md:text-4xl">National Capacity Building Courses</h1>
        <p className="max-w-2xl text-muted-foreground">
          Certified public officer training programmes empanelled by leading academics and domain advisors.
        </p>
      </header>

      <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses, trainers, tags…"
              className="h-11 rounded-xl pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300",
                  category === item
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

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((course, index) => (
          <Card
            key={course.id}
            className="cc-glow-card cc-page-in flex flex-col border-border/70 bg-card/70 backdrop-blur"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <CardContent className="flex flex-1 flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <Badge className="rounded-full uppercase tracking-wide">{course.category}</Badge>
                <span className="flex items-center gap-1 text-sm font-semibold text-warning">
                  <Star className="size-4 fill-current" /> {course.rating}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="font-display text-lg font-bold leading-snug">{course.title}</h2>
                <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" /> {course.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-3.5" /> {course.enrolled} trainees
                </span>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4">
                <span className="text-xs text-muted-foreground">By {course.trainer}</span>
                <Button size="sm" className="cc-btn-glass gap-1.5 rounded-full">
                  <Play className="size-3.5" /> Open
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No courses match your search.
        </p>
      )}
    </div>
  );
}
