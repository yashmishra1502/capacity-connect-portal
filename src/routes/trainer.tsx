import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { RequireRole } from "@/components/require-role";

export const Route = createFileRoute("/trainer")({
  component: () => (
    <RequireRole role="trainer">
      <AppShell role="trainer" />
    </RequireRole>
  ),
});
