import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, ProgressCell, Section, SimpleTable, StatCard } from "@/components/kit";
import { courses, skillRadar, weeklyProgress } from "@/lib/mock-data";

export const Route = createFileRoute("/trainee/progress")({
  component: TraineeProgress,
});

function TraineeProgress() {
  return (
    <>
      <PageHeader title="Progress" subtitle="Your learning activity, competency growth and pace" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Overall completion" value="61%" hint="Across 6 courses" />
        <StatCard label="Study streak" value="7 days" tone="success" />
        <StatCard label="Hours this month" value="29 hrs" tone="info" />
        <StatCard label="Pending modules" value={11} tone="warning" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Section title="Weekly study hours">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="hours" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Competency profile" description="Self and assessment based scores">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillRadar}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="skill" fontSize={11} />
                <Radar
                  dataKey="value"
                  stroke="var(--color-chart-1)"
                  fill="var(--color-chart-1)"
                  fillOpacity={0.25}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Section title="Score trend" className="lg:col-span-2">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis domain={[40, 100]} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="var(--color-chart-3)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>
        <Section title="Milestones">
          <ul className="space-y-3 text-sm">
            {[
              ["Completed DGOV-204", "05 Aug 2026"],
              ["Scored 86% in PPGOV-101", "18 Aug 2026"],
              ["Crossed 50 learning hours", "10 Aug 2026"],
              ["Earned 3rd certificate", "05 Aug 2026"],
            ].map(([t, d]) => (
              <li key={t} className="border-b pb-2 last:border-0">
                <p className="font-medium">{t}</p>
                <p className="text-xs text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="mt-6">
        <Section title="Course-wise progress">
          <SimpleTable
            columns={["Course", "Code", "Trainer", "Modules", "Progress"]}
            rows={courses.map((c) => ({
              key: c.id,
              cells: [
                <span className="font-medium">{c.title}</span>,
                c.code,
                c.trainer,
                c.modules,
                <ProgressCell value={c.progress} />,
              ],
            }))}
          />
        </Section>
      </div>
    </>
  );
}
