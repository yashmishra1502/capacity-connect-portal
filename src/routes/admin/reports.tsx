import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [{ title: "Reports — Administration · Capacity Connect" }],
  }),
  component: Reports,
});

function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate and export platform reports.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-sm font-bold">Available reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <FileText className="size-6 text-muted-foreground/50" />
              No reports available yet
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
