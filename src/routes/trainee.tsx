import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/trainee")({
  head: () => ({
    meta: [
      { title: "Trainee Portal — Capacity Connect" },
      { name: "description", content: "Courses, assessments, certificates and learning progress for trainees." },
      { property: "og:title", content: "Trainee Portal — Capacity Connect" },
      { property: "og:description", content: "Track courses, assessments and certificates." },
    ],
  }),
  component: () => <AppShell role="trainee" />,
});
