import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Film,
  Search,
  Table2,
  File,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resources, courses } from "@/lib/mock-data";

export const Route = createFileRoute("/trainee/resources")({
  head: () => ({
    meta: [
      { title: "Learning Resources — Trainee · Capacity Connect" },
      {
        name: "description",
        content: "Download handbooks, worksheets and session recordings linked to your courses.",
      },
    ],
  }),
  component: TraineeResources,
});

/* ---------------- helpers ---------------- */

const TYPE_ICON: Record<string, typeof FileText> = {
  PDF: FileText,
  XLSX: FileSpreadsheet,
  DOCX: FileText,
  CSV: Table2,
  Video: Film,
};

const TYPE_STYLE: Record<string, string> = {
  PDF: "bg-destructive/10 text-destructive",
  XLSX: "bg-success/10 text-success",
  DOCX: "bg-info/10 text-info",
  CSV: "bg-warning/10 text-warning",
  Video: "bg-primary/10 text-primary",
};

function courseTitleFor(code: string) {
  return courses.find((c) => c.code === code)?.title ?? code;
}

/* ---------------- page ---------------- */

function TraineeResources() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const types = useMemo(
    () => ["All", ...Array.from(new Set(resources.map((r) => r.type)))],
    [],
  );

  const visible = useMemo(() => {
    return resources
      .filter((r) => typeFilter === "All" || r.type === typeFilter)
      .filter((r) => {
        const haystack = `${r.title} ${r.course} ${courseTitleFor(r.course)}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
      .sort((a, b) => b.downloads - a.downloads);
  }, [query, typeFilter]);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
          Resource Library
        </Badge>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Learning Resources</h1>
        <p className="max-w-2xl text-muted-foreground">
          Handbooks, worksheets, datasets and session recordings uploaded by your trainers,
          organised by course.
        </p>
      </header>

      {/* Filters */}
      <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search resources, courses…"
              className="h-11 rounded-xl pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {types.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTypeFilter(item)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300",
                  typeFilter === item
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 text-muted-foreground hover:-translate-y-0.5 hover:text-foreground",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resource grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((resource, index) => {
          const Icon = TYPE_ICON[resource.type] ?? File;
          return (
            <Card
              key={resource.id}
              className="cc-glow-card cc-page-in border-border/70 bg-card/70 backdrop-blur transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-xl",
                      TYPE_STYLE[resource.type] ?? "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <Badge variant="secondary" className="rounded-full uppercase tracking-wide">
                    {resource.type}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h2 className="font-display text-sm font-bold leading-snug md:text-base">
                    {resource.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">{courseTitleFor(resource.course)}</p>
                </div>

                <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                  <span>{resource.size}</span>
                  <span>·</span>
                  <span>Uploaded {resource.uploaded}</span>
                  <span>·</span>
                  <span>{resource.downloads.toLocaleString()} downloads</span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="mt-auto w-full gap-1.5 rounded-full border-border/70"
                >
                  <Download className="size-3.5" /> Download
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No resources match your search criteria.
        </p>
      )}
    </div>
  );
}
