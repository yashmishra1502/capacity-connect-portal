import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Film,
  Loader2,
  Search,
  Table2,
  File,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

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

/* ---------------- types ---------------- */

type Resource = {
  id: string;
  title: string;
  type: string;
  size: string | null;
  courseId: string | null;
  courseTitle: string | null;
  moduleId: string | null;
  moduleTitle: string | null;
  uploadedDate: string | null;
  downloads: number;
  fileUrl: string | null;
};

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

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ---------------- page ---------------- */

function TraineeResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("resources")
        .select(
          `
          id,
          title,
          type,
          size,
          uploaded_date,
          downloads,
          file_url,
          course_id,
          course_module_id,
          courses ( title ),
          course_modules ( title )
        `
        )
        .order("uploaded_date", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      const mapped: Resource[] = (data ?? []).map((r: any) => ({
        id: r.id,
        title: r.title,
        type: r.type ?? "File",
        size: r.size,
        courseId: r.course_id,
        courseTitle: r.courses?.title ?? null,
        moduleId: r.course_module_id,
        moduleTitle: r.course_modules?.title ?? null,
        uploadedDate: r.uploaded_date,
        downloads: r.downloads ?? 0,
        fileUrl: r.file_url,
      }));

      setResources(mapped);
      setLoading(false);
    };

    fetchResources();
  }, []);

  const types = useMemo(
    () => ["All", ...Array.from(new Set(resources.map((r) => r.type)))],
    [resources]
  );

  const visible = useMemo(() => {
    return resources
      .filter((r) => typeFilter === "All" || r.type === typeFilter)
      .filter((r) => {
        const haystack = `${r.title} ${r.courseTitle ?? ""} ${r.moduleTitle ?? ""}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
      .sort((a, b) => b.downloads - a.downloads);
  }, [query, typeFilter, resources]);

  const handleDownloadIncrement = async (id: string, currentDownloads: number) => {
    // Update state locally first
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, downloads: r.downloads + 1 } : r))
    );

    // Sync count increment to Supabase
    await supabase
      .from("resources")
      .update({ downloads: currentDownloads + 1 })
      .eq("id", id);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
          Resource Library
        </Badge>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Learning Resources</h1>
        <p className="max-w-2xl text-muted-foreground">
          Handbooks, worksheets, datasets and session recordings uploaded by your trainers,
          organised by course and module.
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
                    : "border-border/70 text-muted-foreground hover:-translate-y-0.5 hover:text-foreground"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loading / error / list states */}
      {loading ? (
        <div className="flex h-[200px] items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading resources...
        </div>
      ) : error ? (
        <p className="rounded-xl border border-dashed border-destructive/50 p-10 text-center text-sm text-destructive">
          {error}
        </p>
      ) : (
        <>
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
                          TYPE_STYLE[resource.type] ?? "bg-muted text-muted-foreground"
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
                      {(resource.courseTitle || resource.moduleTitle) && (
                        <p className="text-xs text-muted-foreground">
                          {resource.courseTitle}
                          {resource.moduleTitle ? ` · ${resource.moduleTitle}` : ""}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                      <span>{resource.size ?? "—"}</span>
                      <span>·</span>
                      <span>Uploaded {formatDate(resource.uploadedDate)}</span>
                      <span>·</span>
                      <span>{resource.downloads.toLocaleString()} downloads</span>
                    </div>

                    <Button
                      asChild={!!resource.fileUrl}
                      size="sm"
                      variant="outline"
                      disabled={!resource.fileUrl}
                      className="mt-auto w-full gap-1.5 rounded-full border-border/70"
                      onClick={() => {
                        if (resource.fileUrl) {
                          handleDownloadIncrement(resource.id, resource.downloads);
                        }
                      }}
                    >
                      {resource.fileUrl ? (
                        <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" download>
                          <Download className="size-3.5" /> Download
                        </a>
                      ) : (
                        <span>
                          <Download className="size-3.5" /> No file linked
                        </span>
                      )}
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
        </>
      )}
    </div>
  );
}
