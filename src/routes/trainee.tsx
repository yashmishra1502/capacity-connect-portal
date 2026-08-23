import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { RequireRole } from "@/components/require-role";

export const Route = createFileRoute("/trainee")({
  component: () => (
    <RequireRole role="trainee">
      <AppShell role="trainee" />
    </RequireRole>
  ),
});
