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
  Plus,
  Edit3,
  Trash2,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/trainer/resources")({
  head: () => ({
    meta: [
      { title: "Resource Library — Trainer · Capacity Connect" },
      {
        name: "description",
        content: "Manage and upload your course resources, handbooks, and session recordings.",
      },
    ],
  }),
  component: TrainerResources,
});

type Resource = {
  id: string;
  title: string;
  type: string;
  size: string | null;
  uploadedDate: string | null;
  downloads: number;
  fileUrl: string | null;
  user_id?: string;
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

function TrainerResources() {
  const { session } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("PDF");
  const [size, setSize] = useState("1.5 MB");
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchResources = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    setError(null);

    // Fetch strictly resources belonging to this logged-in trainer
    const { data, error: fetchError } = await supabase
      .from("resources")
      .select("id, title, type, size, uploaded_date, downloads, file_url, user_id")
      .eq("user_id", session.user.id)
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
      user_id: r.user_id,
    }));

    setResources(mapped);
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchResources();
    }
  }, [session?.user?.id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      alert("You must be logged in as a trainer.");
      return;
    }
    setSubmitting(true);

    if (editingResource) {
      const { error: updateError } = await supabase
        .from("resources")
        .update({ title, type, size, file_url: fileUrl })
        .eq("id", editingResource.id);

      if (updateError) {
        alert("Update failed: " + updateError.message);
      } else {
        setIsModalOpen(false);
        resetForm();
        await fetchResources();
      }
    } else {
      const { error: insertError } = await supabase.from("resources").insert([
        {
          title,
          type,
          size,
          file_url: fileUrl,
          downloads: 0,
          uploaded_date: new Date().toISOString().split("T")[0],
          user_id: session.user.id,
        },
      ]);

      if (insertError) {
        alert("Upload failed: " + insertError.message);
      } else {
        setIsModalOpen(false);
        resetForm();
        await fetchResources();
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    const { error: deleteError } = await supabase.from("resources").delete().eq("id", id);
    if (deleteError) {
      alert("Delete failed: " + deleteError.message);
    } else {
      setResources((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleEditClick = (resource: Resource) => {
    setEditingResource(resource);
    setTitle(resource.title);
    setType(resource.type);
    setSize(resource.size || "1.0 MB");
    setFileUrl(resource.fileUrl || "");
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setTitle("");
    setType("PDF");
    setSize("1.5 MB");
    setFileUrl("");
    setEditingResource(null);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-3">
          <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
            Trainer Portal
          </Badge>
          <h1 className="font-display text-3xl font-bold md:text-4xl">My Resource Library</h1>
          <p className="max-w-2xl text-muted-foreground">
            Upload, manage, and edit handbooks, worksheets, and session recordings.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="gap-2 rounded-full"
        >
          <Plus className="size-4" /> Upload Resource
        </Button>
      </header>

      <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your resources…"
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

      {loading ? (
        <div className="flex h-[200px] items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading your resources...
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

                    <div className="flex items-center gap-2 mt-auto pt-2">
                      <Button
                        asChild={!!resource.fileUrl}
                        size="sm"
                        variant="outline"
                        disabled={!resource.fileUrl}
                        className="flex-1 gap-1.5 rounded-full border-border/70 text-xs"
                      >
                        {resource.fileUrl ? (
                          <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" download>
                            <Download className="size-3.5" /> View/Download
                          </a>
                        ) : (
                          <span>No file linked</span>
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full px-3"
                        onClick={() => handleEditClick(resource)}
                        title="Edit Resource"
                      >
                        <Edit3 className="size-3.5" />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full px-3 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(resource.id)}
                        title="Delete Resource"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {visible.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              You haven't uploaded any resources matching your search criteria.
            </p>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="font-semibold text-lg">
                {editingResource ? "Edit Resource" : "Upload New Resource"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Resource Title
                </label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Module 1 Lecture Notes"
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    File Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full h-10 px-3 text-sm bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="PDF">PDF</option>
                    <option value="XLSX">XLSX</option>
                    <option value="DOCX">DOCX</option>
                    <option value="CSV">CSV</option>
                    <option value="Video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    File Size
                  </label>
                  <Input
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g., 2.4 MB"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  File URL / Link
                </label>
                <Input
                  type="url"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://example.com/files/resource.pdf"
                  className="rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="rounded-full">
                  {submitting ? "Saving..." : editingResource ? "Update Resource" : "Upload"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
