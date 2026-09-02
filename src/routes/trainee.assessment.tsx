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

type RawStatus = string;
type DisplayStatus = "Live" | "Upcoming" | "Draft";

export interface QuestionItem {
  question: string;
  options: string[];
  answer: number; // index of the correct option
}

export interface AssessmentItem {
  id: string;
  title: string;
  course: string;
  status: RawStatus;
  attempts: number;
  avg: number;
  created_at?: string;
  passing_score?: number | null;
  questions?: QuestionItem[] | string | any; // Stored directly inside the assessment row
}

const DEFAULT_PASS_THRESHOLD = 70;

function normalizeStatus(status: RawStatus): DisplayStatus {
  if (!status) return "Draft";
  const s = status.toLowerCase().trim();
  if (s === "draft") return "Draft";
  if (s === "upcoming") return "Upcoming";
  return "Live";
}

function statusStyle(status: DisplayStatus) {
  switch (status) {
    case "Live":
      return "border-success/40 bg-success/10 text-success";
    case "Upcoming":
      return "border-warning/40 bg-warning/10 text-warning";
    case "Draft":
      return "border-muted-foreground/30 bg-muted text-muted-foreground";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
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
          setView({
            mode: "results",
            assessmentId: active.id,
            answers,
            elapsedSeconds,
          })
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
            const display = normalizeStatus(assessment.status);
            const isLive = display === "Live";
            
            let parsedQuestions: QuestionItem[] = [];
            try {
              const raw = assessment.questions;
              if (Array.isArray(raw)) {
                parsedQuestions = raw;
              } else if (typeof raw === "string") {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) parsedQuestions = parsed;
                else if (parsed && Array.isArray(parsed.questions)) parsedQuestions = parsed.questions;
              } else if (raw && typeof raw === "object" && Array.isArray(raw.questions)) {
                parsedQuestions = raw.questions;
              }
            } catch {
              parsedQuestions = [];
            }
            const questionCount = parsedQuestions.length;

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
                        statusStyle(display),
                      )}
                    >
                      {display}
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
                      <Clock className="size-3.5" /> ~
                      {Math.max(5, Math.round(questionCount * 1.5))} min
                    </span>
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
                      onClick={() => onStart(assessment.id)}
                      className="cc-btn-glass gap-1.5 rounded-full disabled:opacity-50"
                    >
                      <FileCheck2 className="size-3.5" />
                      {isLive
                        ? "Start Assessment"
                        : display === "Draft"
                        ? "Not yet open"
                        : "Upcoming"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------- quiz runner ---------------- */

function QuizRunner({
  assessment,
  onExit,
  onSubmit,
}: {
  assessment: AssessmentItem;
  onExit: () => void;
  onSubmit: (answers: (number | null)[], elapsedSeconds: number) => void;
}) {
  useEffect(() => {
    console.log("Raw Assessment Object:", assessment);
    console.log("Raw assessment.questions:", assessment.questions, typeof assessment.questions);
  }, [assessment]);

  const questions: QuestionItem[] = useMemo(() => {
    try {
      const raw = assessment.questions;
      if (!raw) return [];

      if (Array.isArray(raw)) return raw;

      if (typeof raw === "string") {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.questions)) {
          return parsed.questions;
        }
      }

      if (typeof raw === "object" && raw !== null) {
        if (Array.isArray((raw as any).questions)) {
          return (raw as any).questions;
        }
      }
    } catch (err) {
      console.error("Failed to parse assessment questions:", err);
    }
    return [];
  }, [assessment.questions]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [secondsLeft, setSecondsLeft] = useState(() => Math.max(questions.length * 60, 60));
  const startedAt = useRef(Date.now());
  const submittedRef = useRef(false);

  const handleSubmit = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const elapsed = Math.round((Date.now() - startedAt.current) / 1000);
    onSubmit(answers, elapsed);
  };

  useEffect(() => {
    if (questions.length === 0) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, questions.length]);

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-12 text-center">
        <Card className="p-6 border-border/70 bg-card/70 backdrop-blur">
          <p className="text-sm font-medium text-destructive mb-2">
            No questions found or failed to parse question structure.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Check your browser console (F12) to inspect what data columns exist on this assessment row.
          </p>
          <Button variant="outline" onClick={onExit} className="gap-1.5 rounded-full">
            <ArrowLeft className="size-3.5" /> Back to assessments
          </Button>
        </Card>
      </div>
    );
  }

  const q = questions[current];
  const answeredCount = answers.filter((a) => a !== null).length;
  const isLast = current === questions.length - 1;
  const lowTime = secondsLeft <= 30;

  const selectAnswer = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = optionIndex;
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {assessment.course}
          </p>
          <h1 className="font-display text-xl font-bold md:text-2xl">{assessment.title}</h1>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold tabular-nums transition-colors",
            lowTime
              ? "border-destructive/50 bg-destructive/10 text-destructive"
              : "border-border/70 bg-card/70 text-foreground",
          )}
        >
          <Timer className={cn("size-4", lowTime && "animate-pulse")} />
          {formatClock(secondsLeft)}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Question {current + 1} of {questions.length}
          </span>
          <span>{answeredCount} answered</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="space-y-5 p-6">
          <h2 className="font-display text-lg font-semibold leading-snug md:text-xl">
            {q?.question}
          </h2>

          <div className="space-y-2.5">
            {q?.options?.map((option, i) => {
              const selected = answers[current] === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectAnswer(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200",
                    selected
                      ? "border-primary bg-primary/10 text-foreground shadow-sm"
                      : "border-border/70 text-muted-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {selected ? (
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  ) : (
                    <Circle className="size-4 shrink-0 text-muted-foreground/50" />
                  )}
                  {option}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="gap-1.5 rounded-full"
        >
          <ArrowLeft className="size-3.5" /> Previous
        </Button>

        {isLast ? (
          <Button onClick={handleSubmit} className="cc-btn-glass gap-1.5 rounded-full">
            Submit Assessment <FileCheck2 className="size-3.5" />
          </Button>
        ) : (
          <Button
            onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
            className="cc-btn-glass gap-1.5 rounded-full"
          >
            Next <ArrowRight className="size-3.5" />
          </Button>
        )}
      </div>

      <button
        type="button"
        onClick={onExit}
        className="mx-auto block text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Exit without submitting
      </button>
    </div>
  );
}

/* ---------------- results screen ---------------- */

function ResultsScreen({
  assessment,
  answers,
  elapsedSeconds,
  onRetake,
  onBackToList,
}: {
  assessment: AssessmentItem;
  answers: (number | null)[];
  elapsedSeconds: number;
  onRetake: () => void;
  onBackToList: () => void;
}) {
  const questions: QuestionItem[] = useMemo(() => {
    try {
      const raw = assessment.questions;
      if (!raw) return [];
      if (Array.isArray(raw)) return raw;
      if (typeof raw === "string") {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && Array.isArray(parsed.questions)) return parsed.questions;
      }
      if (raw && typeof raw === "object" && Array.isArray(raw.questions)) {
        return raw.questions;
      }
    } catch {
      return [];
    }
    return [];
  }, [assessment.questions]);

  const correctCount = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
    0,
  );
  const scorePct =
    questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const passThreshold = assessment.passing_score ?? DEFAULT_PASS_THRESHOLD;
  const passed = scorePct >= passThreshold;

  const savedRef = useRef(false);

  useEffect(() => {
    if (savedRef.current || questions.length === 0) return;
    savedRef.current = true;

    async function saveAttempt() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await supabase.from("results").insert({
            trainee_id: user.id,
            user_id: user.id,
            assessment_id: assessment.id,
            score: correctCount,
            total: questions.length,
            status: passed ? "passed" : "failed",
          });
        }

        const newAttempts = (assessment.attempts ?? 0) + 1;
        const priorTotal = (assessment.avg ?? 0) * (assessment.attempts ?? 0);
        const newAvg = Math.round((priorTotal + scorePct) / newAttempts);

        await supabase
          .from("assessments")
          .update({ attempts: newAttempts, avg: newAvg })
          .eq("id", assessment.id);
      } catch (err) {
        console.error("Error saving assessment attempt to Supabase:", err);
      }
    }

    saveAttempt();
  }, [assessment, correctCount, passed, questions.length, scorePct]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="cc-glow-card cc-page-in overflow-hidden border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div
            className={cn(
              "flex size-16 items-center justify-center rounded-full",
              passed ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {passed ? <Trophy className="size-8" /> : <XCircle className="size-8" />}
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {assessment.title}
            </p>
            <h1 className="font-display text-3xl font-bold md:text-4xl">{scorePct}%</h1>
            <Badge
              className={cn(
                "rounded-full border uppercase tracking-wide",
                passed
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-destructive/40 bg-destructive/10 text-destructive",
              )}
            >
              {passed ? "Passed" : "Reattempt Required"}
            </Badge>
          </div>

          <div className="grid w-full grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl border border-border/70 bg-background/50 p-3">
              <p className="font-display text-lg font-bold">
                {correctCount}/{questions.length}
              </p>
              <p className="text-[11px] text-muted-foreground">Correct</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/50 p-3">
              <p className="font-display text-lg font-bold">{formatClock(elapsedSeconds)}</p>
              <p className="text-[11px] text-muted-foreground">Time taken</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/50 p-3">
              <p className="font-display text-lg font-bold">{passThreshold}%</p>
              <p className="text-[11px] text-muted-foreground">Pass mark</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="space-y-4 p-6">
          <h2 className="flex items-center gap-2 font-display text-base font-bold">
            <Award className="size-4 text-primary" /> Answer review
          </h2>
          <div className="space-y-3">
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const correct = userAnswer === q.answer;
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-xl border p-4 text-sm",
                    correct
                      ? "border-success/30 bg-success/5"
                      : "border-destructive/30 bg-destructive/5",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium leading-snug">{q.question}</p>
                    {correct ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                    ) : (
                      <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Your answer:{" "}
                    <span className={correct ? "text-success" : "text-destructive"}>
                      {userAnswer !== null && userAnswer !== undefined && q.options?.[userAnswer]
                        ? q.options[userAnswer]
                        : "Not answered"}
                    </span>
                  </p>
                  {!correct && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Correct answer:{" "}
                      <span className="text-success">{q.options?.[q.answer]}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" onClick={onBackToList} className="gap-1.5 rounded-full">
          <ArrowLeft className="size-3.5" /> Back to assessments
        </Button>
        <Button onClick={onRetake} className="cc-btn-glass gap-1.5 rounded-full">
          <RotateCcw className="size-3.5" /> Retake assessment
        </Button>
      </div>
    </div>
  );
}
