import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Capacity Connect" },
      { name: "description", content: "Users, approvals, analytics, competency mapping and trainer matching." },
      { property: "og:title", content: "Administration — Capacity Connect" },
      { property: "og:description", content: "Portal-wide administration and analytics." },
    ],
  }),
  component: () => <AppShell role="admin" />,
});
