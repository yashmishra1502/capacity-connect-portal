import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader, Section, SimpleTable, StatCard, StatusBadge } from "@/components/kit";
import { results } from "@/lib/mock-data";

export const Route = createFileRoute("/trainee/results")({
  component: Results,
});

function Results() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<(typeof results)[number] | null>(null);
  const list = results.filter((r) => (r.assessment + r.course).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader title="Results" subtitle="Assessment scores across all enrolled courses" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assessments taken" value={4} />
        <StatCard label="Average score" value="77.5%" tone="info" />
        <StatCard label="Best score" value="92%" tone="success" />
        <StatCard label="Reattempts pending" value={1} tone="warning" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Section title="Score comparison" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.map((r) => ({ name: r.course, score: r.score }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="score" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
        <Section title="Grading scale">
          <ul className="space-y-2 text-sm">
            {[
              ["A+", "90 – 100"],
              ["A", "80 – 89"],
              ["B+", "70 – 79"],
              ["B", "60 – 69"],
              ["Reattempt", "Below 60"],
            ].map(([g, r]) => (
              <li key={g} className="flex justify-between border-b pb-1.5 last:border-0">
                <span className="font-medium">{g}</span>
                <span className="text-muted-foreground">{r}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="mt-6">
        <Section
          title="Assessment history"
          actions={
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search results"
              className="w-48"
            />
          }
        >
          <SimpleTable
            columns={["Assessment", "Course", "Date", "Score", "Status", ""]}
            rows={list.map((r) => ({
              key: r.id,
              cells: [
                <span className="font-medium">{r.assessment}</span>,
                r.course,
                r.date,
                <span className="tabular-nums font-semibold">
                  {r.score}/{r.total}
                </span>,
                <StatusBadge status={r.status} />,
                <Button size="sm" variant="outline" onClick={() => setOpen(r)}>
                  View
                </Button>,
              ],
            }))}
          />
        </Section>
      </div>

      <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{open?.assessment}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Course</span>
              <span>{open?.course}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Attempted on</span>
              <span>{open?.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Score</span>
              <span className="font-semibold">
                {open?.score}/{open?.total}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Correct answers</span>
              <span>{Math.round(((open?.score ?? 0) / 100) * 40)} of 40</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time taken</span>
              <span>38 min 12 sec</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
