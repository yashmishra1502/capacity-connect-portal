import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Clock, Loader2, Play, Search, Star, Users, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/trainee/courses")({
  head: () => ({
    meta: [
      { title: "Course Catalog — Trainee · Capacity Connect" },
      {
        name: "description",
        content:
          "Browse certified capacity building courses, filter by domain and open your enrolled learning modules.",
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

export interface Course {
  id: string;
  code?: string;
  title: string;
  description?: string;
  category: string;
  trainer?: string;
  trainer_id?: string | null;
  rating?: number;
  duration?: string;
  enrolled?: number;
  modules_count?: number;
  level?: string;
  playlist_link?: string;
}

// Utility to parse YouTube Playlist ID from full URLs or query parameters
function getPlaylistId(url?: string): string {
  if (!url) return "PLlw9qxNtFom0IBuCE9bU0BWQ-pl-eA9Z-";
  const match = url.match(/[?&]list=([^&]+)/);
  return match ? match[1] : url;
}

// Default course fallback when Supabase table has no records
const DIGITAL_MARKETING_COURSE: Course = {
  id: "digital-marketing-beginners",
  code: "DM-101",
  title: "Digital Marketing for Beginners : Everything You Need To Know",
  description:
    "What is digital marketing? Basically, any form of marketing that exists online! This playlist breaks down what digital marketing is and how it can work for any business.",
  category: "Digital Marketing",
  trainer: "HubSpot Marketing",
  rating: 4.9,
  duration: "13 hours",
  modules_count: 74,
  enrolled: 81220,
  level: "Beginner",
  playlist_link:
    "https://youtube.com/playlist?list=PLlw9qxNtFom0IBuCE9bU0BWQ-pl-eA9Z-&si=PnJGluR4tt_jzO9P",
};

function TraineeCourses() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from("courses")
          .select("*")
          .order("id", { ascending: false });

        if (supabaseError) {
          throw supabaseError;
        }

        if (data && data.length > 0) {
          const mappedCourses: Course[] = data.map((item) => ({
            id: item.id,
            code: item.code || "CC-101",
            title: item.title || "Untitled Course",
            description:
              item.description ||
              "What is digital marketing? Basically, any form of marketing that exists online! This playlist breaks down what digital marketing is and how it can work for any business.",
            category: item.category || "General",
            trainer: item.trainer || "Empanelled Advisor",
            trainer_id: item.trainer_id,
            rating: item.rating ?? 4.9,
            duration: item.duration || "13 hours",
            modules_count: item.modules_count || 74,
            level: item.level || "Beginner",
            enrolled: item.enrolled ?? 81220,
            playlist_link:
              item.playlist_link ||
              "https://youtube.com/playlist?list=PLlw9qxNtFom0IBuCE9bU0BWQ-pl-eA9Z-&si=PnJGluR4tt_jzO9P",
          }));
          setCourses(mappedCourses);
        } else {
          setCourses([DIGITAL_MARKETING_COURSE]);
        }
      } catch (err: any) {
        console.error("Error fetching course catalog:", err);
        setError(err.message || "Failed to load courses.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(courses.map((course) => course.category)))],
    [courses],
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
        <h1 className="font-display text-3xl font-bold md:text-4xl">Capacity Building Courses</h1>
        <p className="max-w-2xl text-muted-foreground">
          Certified public officer training programmes empanelled by leading academics and domain advisors.
        </p>
      </header>

      {/* Filter and Search Controls */}
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

      {/* Loading Indicator */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm">Loading available courses from database...</p>
        </div>
      )}

      {/* Error Display */}
      {!loading && error && (
        <p className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Course Cards Grid */}
      {!loading && !error && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((course, index) => (
            <Card
              key={course.id}
              className="cc-glow-card cc-page-in flex flex-col border-border/70 bg-card/70 backdrop-blur transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <CardContent className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <Badge className="rounded-full uppercase tracking-wide">{course.category}</Badge>
                  <span className="flex items-center gap-1 text-sm font-semibold text-warning">
                    <Star className="size-4 fill-current text-amber-500" /> {course.rating}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-lg font-bold leading-snug">{course.title}</h2>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {course.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="size-3.5" /> {course.modules_count} videos
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="size-3.5" /> {course.enrolled?.toLocaleString()} trainees
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4">
                  <span className="text-xs text-muted-foreground">
                    By {course.trainer || "Empanelled Advisor"}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setActiveCourse(course)}
                    className="cc-btn-glass gap-1.5 rounded-full"
                  >
                    <Play className="size-3.5" /> Open Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty Search Results */}
      {!loading && !error && visible.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No courses match your search criteria.
        </p>
      )}

      {/* Embedded Playlist Modal */}
      {activeCourse && (
        <Dialog open={!!activeCourse} onOpenChange={() => setActiveCourse(null)}>
          <DialogContent className="max-w-4xl border-border/80 bg-background/95 backdrop-blur-xl">
            <DialogHeader className="flex flex-col gap-1 border-b pb-4">
              <Badge className="w-fit rounded-full uppercase">{activeCourse.category}</Badge>
              <DialogTitle className="font-display text-xl font-bold">
                {activeCourse.title}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                {activeCourse.modules_count} videos • {activeCourse.duration} total duration
              </p>
            </DialogHeader>

            <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/videoseries?list=${getPlaylistId(
                  activeCourse.playlist_link,
                )}`}
                title={activeCourse.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <p className="text-sm text-muted-foreground">
              {activeCourse.description}
            </p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
