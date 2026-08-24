import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { Glass, GlassBackground } from "@/components/glass-ui";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [{ title: "Reports — Administration · Capacity Connect" }],
  }),
  component: Reports,
});

function Reports() {
  return (
    <GlassBackground>
      <div>
        <h1 className="font-display text-xl font-bold">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate and export platform reports.
        </p>
      </div>

      <Glass className="p-5">
        <h2 className="font-display text-sm font-bold">Available reports</h2>
        <div className="mt-4 flex h-[200px] items-center justify-center text-xs text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <FileText className="size-6 text-muted-foreground/50" />
            No reports available yet
          </div>
        </div>
      </Glass>
    </GlassBackground>
  );
}
