import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Save, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/trainer/create-quiz")({
  head: () => ({
    meta: [{ title: "Create Quiz — Trainer Portal · Capacity Connect" }],
  }),
  component: CreateQuizPage,
});

interface Question {
  question_text: string;
  options: string[];
  correct_answer: string;
}

function CreateQuizPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Quiz Meta Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [passingScore, setPassingScore] = useState(70);

  // Dynamic Questions State
  const [questions, setQuestions] = useState<Question[]>([
    { question_text: "", options: ["", "", "", ""], correct_answer: "" },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question_text: "", options: ["", "", "", ""], correct_answer: "" },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].question_text = text;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = text;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex: number, answer: string) => {
    const updated = [...questions];
    updated[qIndex].correct_answer = answer;
    setQuestions(updated);
  };

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide a quiz title.");
      return;
    }

    try {
      setLoading(true);
      const trainerId = session?.user?.id;

      // 1. Insert into assessments table
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("assessments")
        .insert([
          {
            title,
            description,
            passing_score: passingScore,
            created_by: trainerId,
          },
        ])
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      const assessmentId = assessmentData.id;

      // 2. Format and insert questions into your questions table
      const formattedQuestions = questions.map((q) => ({
        assessment_id: assessmentId,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
      }));

      const { error: questionsError } = await supabase
        .from("questions")
        .insert(formattedQuestions);

      if (questionsError) throw questionsError;

      alert("Quiz successfully created and saved to assessments!");
      navigate({ to: "/trainer" });
    } catch (err: any) {
      console.error("Error saving quiz:", err.message);
      alert(`Failed to save quiz: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: "/trainer" })}
        >
          <ArrowLeft className="mr-2 size-4" /> Back to Dashboard
        </Button>
        <h1 className="font-display text-xl font-bold">Create New Assessment / Quiz</h1>
      </div>

      <form onSubmit={handleSaveQuiz} className="space-y-6">
        {/* Quiz Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Quiz Title</label>
              <Input
                placeholder="e.g., Advanced TypeScript & React Patterns"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Description</label>
              <Textarea
                placeholder="Brief summary of what this assessment covers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Passing Score (%)</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Questions Builder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold">Questions</h2>
            <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion}>
              <Plus className="mr-1 size-4" /> Add Question
            </Button>
          </div>

          {questions.map((q, qIndex) => (
            <Card key={qIndex} className="relative border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground">
                  Question #{qIndex + 1}
                </CardTitle>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleRemoveQuestion(qIndex)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    placeholder="Enter question text..."
                    value={q.question_text}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-gap-2 space-y-2">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Options (Fill choices and match exact correct answer below)
                  </label>
                  {q.options.map((opt, optIndex) => (
                    <Input
                      key={optIndex}
                      placeholder={`Option ${optIndex + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                      required
                    />
                  ))}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Correct Answer (Must match one of the options above)
                  </label>
                  <Input
                    placeholder="Type the exact correct option text"
                    value={q.correct_answer}
                    onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" /> Saving Assessment...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" /> Save Quiz to Assessments
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
