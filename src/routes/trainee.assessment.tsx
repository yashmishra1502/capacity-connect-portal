import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Circle,
  Clock,
  FileCheck2,
  ListChecks,
  Loader2,
  RotateCcw,
  Timer,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/trainee/assessment")({
  head: () => ({
    meta: [
      { title: "Assessments — Trainee · Capacity Connect" },
      {
        name: "description",
        content: "Attempt live assessments and track your scores across enrolled courses.",
      },
    ],
  }),
  component: TraineeAssessment,
});

/* ---------------- types & helpers ---------------- */

export interface QuestionItem {
  question: string;
  options: string[];
  answer: number; // index of the correct option
}

export interface AssessmentItem {
  id: string;
  title: string;
  course: string;
  status: string;
  attempts: number;
  avg?: number;
  questions?: QuestionItem[]; // Questions stored directly inside the assessment record
  created_at?: string;
}

const PASS_THRESHOLD = 60; // percent

// Helper to reliably check if an assessment is live or active (case-insensitive)
function isAssessmentLive(status: string) {
  if (!status) return false;
  const s = status.toLowerCase().trim();
  return s === "live" || s === "active";
}

function statusStyle(status: string) {
  if (isAssessmentLive(status)) {
    return "border-success/40 bg-success/10 text-success";
  }
  const s = status?.toLowerCase().trim();
  if (s === "draft") {
    return "border-warning/40 bg-warning/10 text-warning";
  }
  return "border-muted-foreground/30 bg-muted text-muted-foreground";
}

function formatClock(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

type ViewState =
  | { mode: "list" }
  | { mode: "quiz"; assessmentId: string }
  | {
      mode: "results";
      assessmentId: string;
      answers: (number | null)[];
      elapsedSeconds: number;
    };

/* ---------------- main page component ---------------- */

function TraineeAssessment() {
  const [view, setView] = useState<ViewState>({ mode: "list" });
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch assessments directly from Supabase
  useEffect(() => {
    async function fetchAssessments() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("assessments")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAssessments(data || []);
      } catch (err) {
        console.error("Error fetching assessments from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAssessments();
  }, []);

  const active = useMemo(
    () =>
      view.mode !== "list"
        ? assessments.find((a) => a.id === view.assessmentId)
        : undefined,
    [view, assessments],
  );

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-8 animate-spin" />
        <p className="text-sm font-medium">Loading assessments...</p>
      </div>
    );
  }

  if (view.mode === "quiz" && active) {
    return (
      <QuizRunner
        assessment={active}
        onExit={() => setView({ mode: "list" })}
        onSubmit={(answers, elapsedSeconds) =>
          setView({ mode: "results", assessmentId: active.id, answers, elapsedSeconds })
        }
      />
    );
  }

  if (view.mode === "results" && active) {
    return (
      <ResultsScreen
        assessment={active}
        answers={view.answers}
        elapsedSeconds={view.elapsedSeconds}
        onRetake={() => setView({ mode: "quiz", assessmentId: active.id })}
        onBackToList={() => setView({ mode: "list" })}
      />
    );
  }

  return (
    <AssessmentList
      assessments={assessments}
      onStart={(id) => setView({ mode: "quiz", assessmentId: id })}
    />
  );
}

/* ---------------- list view ---------------- */

function AssessmentList({
  assessments,
  onStart,
}: {
  assessments: AssessmentItem[];
  onStart: (assessmentId: string) => void;
}) {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
          Assessment Centre
        </Badge>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Your Assessments</h1>
        <p className="max-w-2xl text-muted-foreground">
          Attempt live assessments linked to your enrolled courses. Each attempt is timed and
          your best score is recorded against your service profile.
        </p>
      </header>

      {assessments.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No assessments available at the moment.
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {assessments.map((assessment, index) => {
            const isLive = isAssessmentLive(assessment.status);
            const questionCount = Array.isArray(assessment.questions)
              ? assessment.questions.length
              : 0;

            return (
              <Card
                key={assessment.id}
                className="cc-glow-card cc-page-in flex flex-col border-border/70 bg-card/70 backdrop-blur transition-all duration-300 hover:shadow-lg"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <CardContent className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Badge
                      className={cn(
                        "rounded-full border uppercase tracking-wide",
                        statusStyle(assessment.status),
                      )}
                    >
                      {assessment.status || "Unknown"}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <ListChecks className="size-3.5" /> {questionCount} questions
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="font-display text-lg font-bold leading-snug">
                      {assessment.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">{assessment.course}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="size-3.5" /> {assessment.avg || 0}% avg score
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4">
                    <span className="text-xs text-muted-foreground">
                      {assessment.attempts || 0} attempts so far
                    </span>
                    <Button
                      size="sm"
                      disabled={!isLive}
                      onClick={() => onStart
