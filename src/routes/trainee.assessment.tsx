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

// `status` in the DB is constrained to these values (mixed case exists in the
// CHECK constraint, so we normalize rather than trust exact casing).
type RawStatus = string;
type DisplayStatus = "Live" | "Upcoming" | "Draft";

export interface AssessmentItem {
  id: string;
  title: string;
  course: string;
  questions: number;
  status: RawStatus;
  attempts: number;
  avg: number;
  created_at?: string;
  passing_score?: number | null;
}

interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  question_text: string;
  options: string[];
  correct_option: number;
  order_index: number;
}

const DEFAULT_PASS_THRESHOLD = 70; // matches assessments.passing_score default

function normalizeStatus(status: RawStatus): DisplayStatus {
  const s = status.toLowerCase();
  if (s === "draft") return "Draft";
  if (s === "upcoming") return "Upcoming";
  // "live" and "active" both count as attemptable
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
      questions: AssessmentQuestion[];
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
        onSubmit={(questions, answers, elapsedSeconds) =>
          setView({
            mode: "results",
            assessmentId: active.id,
            questions,
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
        questions={view.questions}
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
                      <ListChecks className="size-3.5" /> {assessment.questions} questions
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
                      {Math.max(5, Math.round(assessment.questions * 1.5))} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="size-3.5" /> {assessment.avg || 0}% avg score
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4">
                    <span className="text-xs text-muted-foreground">
                      {assessment.attempts} attempts so far
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
  onSubmit: (
    questions: AssessmentQuestion[],
    answers: (number | null)[],
    elapsedSeconds: number,
  ) => void;
}) {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const startedAt = useRef(Date.now());
  const submittedRef = useRef(false);

  // Fetch this assessment's real questions from Supabase
  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoadingQuestions(true);
        const { data, error } = await supabase
          .from("assessment_questions")
          .select("*")
          .eq("assessment_id", assessment.id)
          .order("order_index", { ascending: true });

        if (error) throw error;

        const normalized: AssessmentQuestion[] = (data || []).map((row) => ({
          id: row.id,
          assessment_id: row.assessment_id,
          question_text: row.question_text,
          // options is stored as jsonb; guard in case it comes back as a string
          options: Array.isArray(row.options)
            ? row.options
            : JSON.parse(row.options ?? "[]"),
          correct_option: row.correct_option,
          order_index: row.order_index,
        }));

        setQuestions(normalized);
        setAnswers(normalized.map(() => null));
        setSecondsLeft(normalized.length * 60);
        startedAt.current = Date.now();
      } catch (err) {
        console.error("Error fetching assessment questions from Supabase:", err);
        setQuestions([]);
      } finally {
        setLoadingQuestions(false);
      }
    }

    fetchQuestions();
  }, [assessment.id]);

  const handleSubmit = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const elapsed = Math.round((Date.now() - startedAt.current) / 1000);
    onSubmit(questions, answers, elapsed);
  };

  useEffect(() => {
    if (loadingQuestions || questions.length === 0) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, loadingQuestions, questions.length]);

  if (loadingQuestions) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-8 animate-spin" />
        <p className="text-sm font-medium">Loading questions...</p>
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

  if (!q) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          No questions have been added to this assessment yet.
        </p>
        <Button variant="outline" onClick={onExit} className="gap-1.5 rounded-full">
          <ArrowLeft className="size-3.5" /> Back to assessments
        </Button>
      </div>
    );
  }

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
            {q.question_text}
          </h2>

          <div className="space-y-2.5">
            {q.options.map((option, i) => {
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
  questions,
  answers,
  elapsedSeconds,
  onRetake,
  onBackToList,
}: {
  assessment: AssessmentItem;
  questions: AssessmentQuestion[];
  answers: (number | null)[];
  elapsedSeconds: number;
  onRetake: () => void;
  onBackToList: () => void;
}) {
  const correctCount = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct_option ? 1 : 0),
    0,
  );
  const scorePct =
    questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const passThreshold = assessment.passing_score ?? DEFAULT_PASS_THRESHOLD;
  const passed = scorePct >= passThreshold;

  const savedRef = useRef(false);

  // Record the attempt: insert into results, bump assessments.attempts/avg
  useEffect(() => {
    if (savedRef.current || questions.length === 0) return;
    savedRef.current = true;

    async function saveAttempt() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { error: resultError } = await supabase.from("results").insert({
            trainee_id: user.id,
            user_id: user.id,
            assessment_id: assessment.id,
            score: correctCount,
            total: questions.length,
            status: passed ? "passed" : "failed",
          });
          if (resultError) throw resultError;
        }

        const newAttempts = (assessment.attempts ?? 0) + 1;
        const priorTotal = (assessment.avg ?? 0) * (assessment.attempts ?? 0);
        const newAvg = Math.round((priorTotal + scorePct) / newAttempts);

        const { error: assessmentError } = await supabase
          .from("assessments")
          .update({ attempts: newAttempts, avg: newAvg })
          .eq("id", assessment.id);
        if (assessmentError) throw assessmentError;
      } catch (err) {
        console.error("Error saving assessment attempt to Supabase:", err);
      }
    }

    saveAttempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              const correct = userAnswer === q.correct_option;
              return (
                <div
                  key={q.id}
                  className={cn(
                    "rounded-xl border p-4 text-sm",
                    correct
                      ? "border-success/30 bg-success/5"
                      : "border-destructive/30 bg-destructive/5",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium leading-snug">{q.question_text}</p>
                    {correct ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                    ) : (
                      <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Your answer:{" "}
                    <span className={correct ? "text-success" : "text-destructive"}>
                      {userAnswer !== null && userAnswer !== undefined
                        ? q.options[userAnswer]
                        : "Not answered"}
                    </span>
                  </p>
                  {!correct && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Correct answer:{" "}
                      <span className="text-success">{q.options[q.correct_option]}</span>
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
