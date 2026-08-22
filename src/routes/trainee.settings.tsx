import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/settings-page";

export const Route = createFileRoute("/trainee/settings")({
  component: () => <SettingsPage role="trainee" />,
});
