import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, Section, SimpleTable } from "@/components/kit";
import { courses, feedbackEntries } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/trainee/feedback")({
  component: Feedback,
});

function Feedback() {
  const [rating, setRating] = useState(4);
  const [course, setCourse] = useState(courses[0]!.code);
  const [comment, setComment] = useState("");
  const [pace, setPace] = useState([70]);

  return (
    <>
      <PageHeader title="Feedback" subtitle="Share your experience to improve future programmes" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Submit feedback" className="lg:col-span-2">
          <div className="space-y-5">
            <div>
              <Label className="text-xs">Course</Label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.code}>
                      {c.code} — {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Overall rating</Label>
              <div className="mt-2 flex gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setRating(s)} aria-label={`Rate ${s}`}>
                    <Star
                      className={cn(
                        "size-7",
                        s <= rating ? "fill-warning text-warning" : "text-muted-foreground",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs">Course pace was comfortable</Label>
              <Slider value={pace} onValueChange={setPace} max={100} step={5} className="mt-3" />
              <p className="mt-1.5 text-xs text-muted-foreground">Agreement level: {pace[0]}%</p>
            </div>

            <div>
              <Label className="text-xs">Comments</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                placeholder="What worked well? What could be improved?"
                className="mt-1.5"
              />
            </div>

            <Button
              onClick={() => {
                toast.success("Feedback submitted", {
                  description: `Thank you for rating ${course} — ${rating} star(s).`,
                });
                setComment("");
              }}
            >
              Submit feedback
            </Button>
          </div>
        </Section>

        <Section title="Guidelines">
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>· Feedback is anonymised before being shared with trainers.</li>
            <li>· Ratings contribute to the trainer performance index.</li>
            <li>· One submission is allowed per course per batch.</li>
            <li>· Please avoid personally identifiable information.</li>
          </ul>
        </Section>
      </div>

      <div className="mt-6">
        <Section title="Your past feedback">
          <SimpleTable
            columns={["Course", "Rating", "Comment", "Date"]}
            rows={feedbackEntries.slice(0, 3).map((f) => ({
              key: f.id,
              cells: [f.course, `★ ${f.rating}`, f.comment, f.date],
            }))}
          />
        </Section>
      </div>
    </>
  );
}
