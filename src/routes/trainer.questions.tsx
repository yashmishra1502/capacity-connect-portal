import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Save, ArrowLeft, Loader2, ListChecks, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/trainer/create-quiz")({
  head: () => ({
    meta: [{ title: "Assessments Management — Trainer Portal · Capacity Connect" }],
  }),
  component: TrainerAssessmentsPage,
});

interface Question {
  question_text: string;
  options: string[];
  correct_answer: string;
}

function TrainerAssessmentsPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");
  
  // List State
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Form State
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { question_text: "", options: ["", "", "", ""], correct_answer: "" },
  ]);

  useEffect(() => {
    async function fetchCourses() {
      const { data } = await supabase.from("courses").select("id, title");
      if (data) setCourses(data);
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    if (activeTab === "list") {
      fetchAssessments();
    }
  }, [activeTab]);

  const fetchAssessments = async () => {
    try {
      setLoadingList(true);
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (err: any) {
      console.error("Error fetching assessments:", err.message);
    } finally {
      setLoadingList(false);
    }
  };

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

      const rowsToInsert = questions.map((q) => ({
        title,
        description,
        passing_score: passingScore,
        course: selectedCourse || null,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        created_by: trainerId || null,
      }));

      const { error } = await supabase.from("assessments").insert(rowsToInsert);

      if (error) throw error;

      alert("Quiz successfully created and saved to assessments!");
      setTitle("");
      setDescription("");
      setPassingScore(70);
      setSelectedCourse("");
      setQuestions([{ question_text: "", options: ["", "", "", ""], correct_answer: "" }]);
      setActiveTab("list");
    } catch (err: any) {
      console.error("Error saving quiz:", err.message);
      alert(`Failed to save quiz: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Header & Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: "/trainer" })}
          className="w-fit"
        >
          <ArrowLeft className="mr-2 size-4" /> Back to Dashboard
        </Button>
        <h1 className="font-display text-xl font-bold">Trainer Assessments Portal</h1>
      </div>

      {/* Tabs Navigation */}
      <div className="flex rounded-lg border bg-card p-1 text-card-foreground shadow-sm">
        <button
          onClick={() => setActiveTab("create")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-xs font-semibold transition-all ${
            activeTab === "create"
              ? "bg-primary text-primary-foreground shadow"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Plus className="size-4" /> Create Quiz
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-xs font-semibold transition-all ${
            activeTab === "list"
              ? "bg-primary text-primary-foreground shadow"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ListChecks className="size-4" /> My Assessments
        </button>
      </div>

      {/* Tab 1: Create Quiz Form */}
      {activeTab === "create" && (
        <form onSubmit={handleSaveQuiz} className="space-y-6">
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
                <label className="text-xs font-semibold text-muted-foreground">Select Course</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="">-- Select a Course (Optional) --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.title || c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
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

                  <div className="space-y-2">
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
      )}

      {/* Tab 2: Uploaded Assessments List */}
      {activeTab === "list" && (
        <div className="space-y-4">
          <h2 className="font-display text-base font-bold">Uploaded Assessments & Questions</h2>

          {loadingList ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : assessments.length === 0 ? (
            <Card className="py-12 text-center text-muted-foreground">
              <FileText className="mx-auto mb-2 size-8 opacity-50" />
              <p>No assessments uploaded yet.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {assessments.map((item, idx) => (
                <Card key={item.id || idx}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sm font-bold">{item.title}</CardTitle>
                        {item.course && (
                          <span className="mt-1 inline-block rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            Course: {item.course}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        Passing Score: {item.passing_score}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    {item.description && (
                      <p className="text-muted-foreground">{item.description}</p>
                    )}
                    <div className="rounded-md border bg-muted/40 p-3">
                      <p className="font-semibold text-foreground">
                        Q: {item.question_text}
                      </p>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                        {item.options?.map((opt: string, optIdx: number) => (
                          <li
                            key={optIdx}
                            className={
                              opt === item.correct_answer
                                ? "font-bold text-green-600 dark:text-green-400"
                                : ""
                            }
                          >
                            {opt} {opt === item.correct_answer && "(Correct)"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
