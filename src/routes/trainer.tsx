import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/trainer")({
  head: () => ({
    meta: [
      { title: "Trainer Portal — Capacity Connect" },
      { name: "description", content: "Author courses, manage resources, question banks and cohort performance." },
      { property: "og:title", content: "Trainer Portal — Capacity Connect" },
      { property: "og:description", content: "Course authoring and cohort insights for trainers." },
    ],
  }),
  component: () => <AppShell role="trainer" />,
});
