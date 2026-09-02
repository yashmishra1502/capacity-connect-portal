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
      { title: "Resource Library — Trainee · Capacity Connect" },
      {
        name: "description",
        content: "Browse and download course resources, handbooks, and session recordings uploaded by trainers.",
      },
    ],
  }),
  component: TraineeResources,
});

type Resource = {
  id: string;
  title: string;
  type: string;
  size: string | null;
  uploadedDate: string | null;
  downloads: number;
  fileUrl: string | null;
};

const TYPE_ICON: Record<string, typeof FileText> = {
  PDF: FileText,
  XLSX: FileSpreadsheet,
  DOCX: FileText,
  CSV: Table2,
  Video: Film,
};

const TYPE_STYLE: Record<string, string> = {
  PDF: "bg-destructive/10 text-destructive",
  XLSX: "bg-emerald-500/10 text-emerald-500",
  DOCX: "bg-blue-500/10 text-blue-500",
  CSV: "bg-amber-500/10 text-amber-500",
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

function TraineeResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const fetchResources = async () => {
    setLoading(true);
    setError(null);

    // Fetch all available resources uploaded by trainers
    const { data, error: fetchError } = await supabase
      .from("resources")
      .select("id, title, type, size, uploaded_date, downloads, file_url")
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
      uploadedDate: r.uploaded_date,
      downloads: r.downloads ?? 0,
      fileUrl: r.file_url,
    }));

    setResources(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const types = useMemo(
    () => ["All", ...Array.from(new Set(resources.map((r) => r.type)))],
    [resources]
  );

  const visible = useMemo(() => {
    return resources
      .filter((r) => typeFilter === "All" || r.type === typeFilter)
      .filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.downloads - a.downloads);
  }, [query, typeFilter, resources]);

  // Optional: Increment download counter when a trainee clicks download
  const handleDownloadClick = async (id: string, currentDownloads: number) => {
    await supabase
      .from("resources")
      .update({ downloads: currentDownloads + 1 })
      .eq("id", id);
    
    // Refresh list locally to update count badge
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, downloads: r.downloads + 1 } : r))
    );
  };

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
          Trainee Portal
        </Badge>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Resource Library</h1>
        <p className="max-w-2xl text-muted-foreground">
          Access course materials, handbooks, session recordings, and downloadable assets provided by your trainers.
        </p>
      </header>

      {/* Search & Filter Toolbar */}
      <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search resources by title or type…"
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

      {/* Content Area */}
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
                  className="cc-glow-card border-border/70 bg-card/70 backdrop-blur transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="flex flex-col gap-4 p-5 flex-1">
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
                    </div>

                    <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                      <span>{resource.size ?? "—"}</span>
                      <span>·</span>
                      <span>Uploaded {formatDate(resource.uploadedDate)}</span>
                      <span>·</span>
                      <span>{resource.downloads.toLocaleString()} downloads</span>
                    </div>

                    <div className="mt-auto pt-2">
                      <Button
                        asChild={!!resource.fileUrl}
                        size="sm"
                        variant="default"
                        disabled={!resource.fileUrl}
                        className="w-full gap-1.5 rounded-full text-xs"
                        onClick={() => handleDownloadClick(resource.id, resource.downloads)}
                      >
                        {resource.fileUrl ? (
                          <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" download>
                            <Download className="size-3.5" /> Download Asset
                          </a>
                        ) : (
                          <span>Link unavailable</span>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {visible.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No training resources found matching your search.
            </p>
          )}
        </>
      )}
    </div>
  );
}
