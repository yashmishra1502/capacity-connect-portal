import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, MessageSquareText, Send, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { courses } from "@/lib/mock-data";

export const Route = createFileRoute("/trainee/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback — Trainee · Capacity Connect" },
      {
        name: "description",
        content: "Share feedback on your courses to help trainers and administrators improve the programme.",
      },
    ],
  }),
  component: TraineeFeedback,
});

interface SubmittedFeedback {
  id: string;
  courseId: string;
  rating: number;
  comment: string;
  date: string;
}

function TraineeFeedback() {
  // Only courses the trainee has actually started/enrolled in make sense
  // to leave feedback on.
  const eligibleCourses = courses.filter((c) => c.status !== "Not Started");

  const [courseId, setCourseId] = useState(eligibleCourses[0]?.id ?? "");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState<SubmittedFeedback[]>([]);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const selectedCourse = courses.find((c) => c.id === courseId);
  const canSubmit = courseId && rating > 0 && comment.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const entry: SubmittedFeedback = {
      id: `local-${Date.now()}`,
      courseId,
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setSubmitted((prev) => [entry, ...prev]);
    setRating(0);
    setComment("");
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 2500);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
          Your Voice
        </Badge>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Course Feedback</h1>
        <p className="max-w-2xl text-muted-foreground">
          Share your experience with a course — trainers and administrators use this to improve
          content, pacing and delivery for future cohorts.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Feedback form */}
        <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur lg:col-span-3">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Course
              </label>
              <div className="flex flex-wrap gap-2">
                {eligibleCourses.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCourseId(c.id)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300",
                      courseId === c.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/70 text-muted-foreground hover:-translate-y-0.5 hover:text-foreground",
                    )}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
              {selectedCourse && (
                <p className="text-sm text-muted-foreground">{selectedCourse.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Your rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => {
                  const filled = n <= (hoverRating || rating);
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                      className="p-0.5"
                    >
                      <Star
                        className={cn(
                          "size-7 transition-all duration-150",
                          filled ? "scale-105 fill-amber-500 text-amber-500" : "text-muted-foreground/40",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Comments
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                placeholder="What worked well? What could be improved?"
                className="w-full resize-none rounded-xl border border-border/70 bg-background/50 p-3.5 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="cc-btn-glass w-full gap-1.5 rounded-full disabled:opacity-50"
            >
              {justSubmitted ? (
                <>
                  <CheckCircle2 className="size-4" /> Submitted
                </>
              ) : (
                <>
                  <Send className="size-3.5" /> Submit feedback
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Recently submitted (session-local) */}
        <div className="space-y-3 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold text-muted-foreground">
            <MessageSquareText className="size-4" /> Submitted this session
          </h2>
          {submitted.length === 0 && (
            <Card className="border-dashed border-border/70 bg-transparent">
              <CardContent className="p-6 text-center text-xs text-muted-foreground">
                Your submitted feedback will appear here.
              </CardContent>
            </Card>
          )}
          {submitted.map((entry) => {
            const course = courses.find((c) => c.id === entry.courseId);
            return (
              <Card key={entry.id} className="cc-page-in border-border/70 bg-card/70 backdrop-blur">
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold">{course?.code}</p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "size-3",
                            i < entry.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{entry.comment}</p>
                  <p className="text-[10px] text-muted-foreground/70">{entry.date}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
