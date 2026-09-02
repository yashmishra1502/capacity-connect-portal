import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageSquareText, Star, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/trainer/feedback")({
  head: () => ({
    meta: [
      { title: "Course Feedback — Trainer · Capacity Connect" },
      {
        name: "description",
        content: "View feedback and ratings submitted by trainees for your courses.",
      },
    ],
  }),
  component: TrainerFeedback,
});

interface CourseRow {
  id: string;
  code: string;
  title: string;
}

interface FeedbackRow {
  id: string;
  course_id: string;
  rating: number;
  comment: string;
  date: string;
  trainee_id?: string;
}

function TrainerFeedback() {
  const { session } = useAuth();
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("All");
  const [feedbackList, setFeedbackList] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainerFeedback = async () => {
      if (!session?.user?.id) return;
      setLoading(true);
      setError(null);

      // 1. Fetch courses assigned to this trainer
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("id, code, title")
        .eq("trainer_id", session.user.id)
        .order("code");

      if (courseError) {
        setError(courseError.message);
        setLoading(false);
        return;
      }

      setCourses(courseData ?? []);

      if (!courseData || courseData.length === 0) {
        setLoading(false);
        return;
      }

      const courseIds = courseData.map((c) => c.id);

      // 2. Fetch feedback associated with these course IDs
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("feedback")
        .select("id, course_id, rating, comment, date, trainee_id")
        .in("course_id", courseIds)
        .order("date", { ascending: false });

      if (feedbackError) {
        setError(feedbackError.message);
      } else {
        setFeedbackList(feedbackData ?? []);
      }

      setLoading(false);
    };

    fetchTrainerFeedback();
  }, [session?.user?.id]);

  const filteredFeedback =
    selectedCourseId === "All"
      ? feedbackList
      : feedbackList.filter((f) => f.course_id === selectedCourseId);

  // Calculate average rating for filtered view
  const averageRating =
    filteredFeedback.length > 0
      ? (
          filteredFeedback.reduce((acc, curr) => acc + curr.rating, 0) /
          filteredFeedback.length
        ).toFixed(1)
      : "—";

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
          Trainer Portal
        </Badge>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Course Feedback</h1>
        <p className="max-w-2xl text-muted-foreground">
          Review ratings and comments submitted by trainees to evaluate and improve your course delivery.
        </p>
      </header>

      {/* Summary Metrics & Course Filter Toolbar */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur lg:col-span-2 flex flex-col justify-center p-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Average Rating
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold">{averageRating}</span>
            <span className="text-sm text-muted-foreground">/ 5.0</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Based on {filteredFeedback.length} total review{filteredFeedback.length === 1 ? "" : "s"}
          </p>
        </Card>

        <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur lg:col-span-3 p-6 flex flex-col justify-center space-y-3">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Filter by Course
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCourseId("All")}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300",
                selectedCourseId === "All"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 text-muted-foreground hover:-translate-y-0.5 hover:text-foreground"
              )}
            >
              All Courses
            </button>
            {courses.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCourseId(c.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300",
                  selectedCourseId === c.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 text-muted-foreground hover:-translate-y-0.5 hover:text-foreground"
                )}
              >
                {c.code}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Feedback Feed */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-muted-foreground">
          <MessageSquareText className="size-4" /> Trainee Reviews ({filteredFeedback.length})
        </h2>

        {loading ? (
          <div className="flex h-[200px] items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading feedback records...
          </div>
        ) : error ? (
          <p className="rounded-xl border border-dashed border-destructive/50 p-10 text-center text-sm text-destructive">
            {error}
          </p>
        ) : filteredFeedback.length === 0 ? (
          <Card className="border-dashed border-border/70 bg-transparent">
            <CardContent className="p-10 text-center text-xs text-muted-foreground">
              No feedback has been submitted for your courses yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredFeedback.map((entry) => {
              const course = courses.find((c) => c.id === entry.course_id);
              return (
                <Card
                  key={entry.id}
                  className="cc-glow-card border-border/70 bg-card/70 backdrop-blur transition-all duration-300 flex flex-col justify-between"
                >
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="rounded-full uppercase tracking-wide">
                        {course?.code ?? "Course"}
                      </Badge>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-3.5",
                              i < entry.rating
                                ? "fill-amber-500 text-amber-500"
                                : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {course?.title && (
                      <p className="text-xs font-semibold text-muted-foreground">
                        {course.title}
                      </p>
                    )}

                    <p className="text-sm text-foreground/90 italic">"{entry.comment}"</p>

                    <div className="flex justify-between items-center pt-2 border-t border-border/40 text-[11px] text-muted-foreground/70">
                      <span>Submitted feedback</span>
                      <span>{entry.date}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
