import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader, Section } from "@/components/kit";
import { quizQuestions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/trainee/assessment")({
  component: Assessment,
});

function Assessment() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<number[]>([]);
  const [seconds, setSeconds] = useState(20 * 60);
  const [confirm, setConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  const q = quizQuestions[index]!;
  const answeredCount = Object.keys(answers).length;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const score = quizQuestions.filter((qq) => answers[qq.id] === qq.answer).length;

  if (submitted) {
    const pct = Math.round((score / quizQuestions.length) * 100);
    return (
      <>
        <PageHeader title="Assessment submitted" subtitle="PPGOV-101 — Final Assessment" />
        <Section title="Your result">
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex size-28 items-center justify-center rounded-full border-8 border-primary/15">
              <span className="font-display text-3xl font-bold text-primary">{pct}%</span>
            </div>
            <p className="mt-4 text-sm font-medium">
              {score} of {quizQuestions.length} correct
            </p>
            <Badge className="mt-2" variant={pct >= 60 ? "default" : "destructive"}>
              {pct >= 60 ? "Passed" : "Reattempt required"}
            </Badge>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/trainee/results">View all results</Link>
              </Button>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                  setIndex(0);
                  setSeconds(20 * 60);
                }}
              >
                Retake quiz
              </Button>
            </div>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="MCQ Assessment"
        subtitle="PPGOV-101 — Final Assessment · 5 questions · 20 minutes"
        actions={
          <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2">
            <Clock className="size-4 text-primary" />
            <span className="font-display text-sm font-bold tabular-nums">
              {mm}:{ss}
            </span>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Section
            title={`Question ${index + 1} of ${quizQuestions.length}`}
            actions={
              <Button
                size="sm"
                variant={flagged.includes(q.id) ? "default" : "outline"}
                onClick={() =>
                  setFlagged((f) => (f.includes(q.id) ? f.filter((x) => x !== q.id) : [...f, q.id]))
                }
              >
                <Flag className="mr-1.5 size-3.5" /> Flag
              </Button>
            }
          >
            <Progress value={((index + 1) / quizQuestions.length) * 100} className="mb-5 h-1.5" />
            <p className="text-base font-medium">{q.question}</p>
            <RadioGroup
              className="mt-4 space-y-2"
              value={answers[q.id]?.toString() ?? ""}
              onValueChange={(v) => setAnswers((a) => ({ ...a, [q.id]: Number(v) }))}
            >
              {q.options.map((o, i) => (
                <Label
                  key={o}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors hover:bg-muted/60",
                    answers[q.id] === i && "border-primary bg-accent",
                  )}
                >
                  <RadioGroupItem value={i.toString()} />
                  {o}
                </Label>
              ))}
            </RadioGroup>

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                disabled={index === 0}
                onClick={() => setIndex((i) => i - 1)}
              >
                Previous
              </Button>
              {index === quizQuestions.length - 1 ? (
                <Button onClick={() => setConfirm(true)}>Submit assessment</Button>
              ) : (
                <Button onClick={() => setIndex((i) => i + 1)}>Next question</Button>
              )}
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Question palette">
            <div className="grid grid-cols-5 gap-2">
              {quizQuestions.map((qq, i) => (
                <button
                  key={qq.id}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-md border text-sm font-medium",
                    i === index && "ring-2 ring-ring",
                    answers[qq.id] !== undefined
                      ? "bg-success/15 text-success"
                      : "bg-muted text-muted-foreground",
                    flagged.includes(qq.id) && "border-warning",
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <p>Answered: {answeredCount}</p>
              <p>Flagged: {flagged.length}</p>
              <p>Remaining: {quizQuestions.length - answeredCount}</p>
            </div>
            <Button className="mt-4 w-full" onClick={() => setConfirm(true)}>
              Submit
            </Button>
          </Section>
          <Section title="Instructions">
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>· Each question carries equal marks.</li>
              <li>· No negative marking.</li>
              <li>· Minimum 60% required to pass.</li>
              <li>· Assessment auto-submits when the timer ends.</li>
            </ul>
          </Section>
        </div>
      </div>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit assessment?</DialogTitle>
            <DialogDescription>
              You have answered {answeredCount} of {quizQuestions.length} questions. Submissions
              cannot be changed afterwards.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Keep working
            </Button>
            <Button
              onClick={() => {
                setConfirm(false);
                setSubmitted(true);
              }}
            >
              Confirm submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
