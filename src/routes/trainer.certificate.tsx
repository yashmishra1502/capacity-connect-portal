import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, Upload, FileCheck2, Trash2, Loader2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export const Route = createFileRoute("/trainer/certificate")({
  head: () => ({
    meta: [{ title: "Certificates — Trainer Portal · Capacity Connect" }],
  }),
  component: CertificateUpload,
});

// Matches public.profiles (trainee rows only)
interface TraineeProfile {
  id: string;
  full_name: string | null;
  name: string | null;
  email: string | null;
}

// Matches public.certificates
interface CertificateRow {
  id: string;
  trainee_id: string;
  file_url: string;
  file_name: string;
  uploaded_by: string;
  created_at: string;
}

const STORAGE_BUCKET = "certificates";

function CertificateUpload() {
  const { session } = useAuth();
  const trainerId = session?.user?.id;

  const [trainees, setTrainees] = useState<TraineeProfile[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTrainee, setSelectedTrainee] = useState<TraineeProfile | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<CertificateRow[]>([]);

  useEffect(() => {
    async function fetchTrainees() {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, name, email")
        .eq("role", "trainee")
        .order("full_name", { ascending: true });
      setTrainees((data as TraineeProfile[]) || []);
      setLoading(false);
    }
    fetchTrainees();
  }, []);

  useEffect(() => {
    if (!trainerId) return;
    async function fetchCertificates() {
      const { data } = await supabase
        .from("certificates")
        .select("*")
        .eq("uploaded_by", trainerId)
        .order("created_at", { ascending: false });
      if (data) setCertificates(data as CertificateRow[]);
    }
    fetchCertificates();
  }, [trainerId]);

  const filteredTrainees = trainees.filter((t) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const name = (t.full_name || t.name || "").toLowerCase();
    const email = (t.email || "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const handleUpload = async () => {
    if (!selectedTrainee) {
      toast.error("Select a trainee first");
      return;
    }
    if (!file) {
      toast.error("Choose a certificate file to upload");
      return;
    }
    if (!trainerId) {
      toast.error("You must be signed in as a trainer");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${selectedTrainee.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);

      const { data: inserted, error: insertError } = await supabase
        .from("certificates")
        .insert({
          trainee_id: selectedTrainee.id,
          file_url: publicUrlData.publicUrl,
          file_name: file.name,
          uploaded_by: trainerId,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Notify the trainee
      await supabase.from("notifications").insert({
        user_id: selectedTrainee.id,
        title: "New certificate available",
        body: `Your certificate "${file.name}" has been uploaded.`,
        unread: true,
        sender_role: "trainer",
        recipient_role: "trainee",
      });

      setCertificates((prev) => [inserted as CertificateRow, ...prev]);
      toast.success(`Certificate uploaded for ${selectedTrainee.full_name || selectedTrainee.name}`);
      setFile(null);
      setSelectedTrainee(null);
    } catch (err: any) {
      console.error("Certificate upload failed:", err);
      toast.error(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (cert: CertificateRow) => {
    const { error } = await supabase.from("certificates").delete().eq("id", cert.id);
    if (error) {
      toast.error("Failed to delete certificate");
      return;
    }
    setCertificates((prev) => prev.filter((c) => c.id !== cert.id));
    toast.success("Certificate removed");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold flex items-center gap-2">
          <Award className="size-5 text-primary" />
          Upload Certificates
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a trainee and upload their certificate file directly (PDF or image).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Upload form */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Select Trainee</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search trainee by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            {loading ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Loading trainees...
              </div>
            ) : (
              <div className="max-h-56 space-y-1 overflow-y-auto rounded-md border p-1">
                {filteredTrainees.length > 0 ? (
                  filteredTrainees.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTrainee(t)}
                      className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
                        selectedTrainee?.id === t.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {t.full_name || t.name || "Unnamed trainee"}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {t.email}
                        </span>
                      </span>
                      {selectedTrainee?.id === t.id && (
                        <FileCheck2 className="size-4 shrink-0" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    No trainees found.
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="certFile">Certificate file</Label>
              <Input
                id="certFile"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              {file && (
                <p className="truncate text-xs text-muted-foreground">Selected: {file.name}</p>
              )}
            </div>

            {selectedTrainee && (
              <div className="rounded-md bg-muted/50 p-2.5 text-xs">
                Uploading for:{" "}
                <span className="font-semibold">
                  {selectedTrainee.full_name || selectedTrainee.name}
                </span>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={uploading || !selectedTrainee || !file}
              className="w-full gap-2"
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              {uploading ? "Uploading..." : "Upload Certificate"}
            </Button>
          </CardContent>
        </Card>

        {/* Uploaded list */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">
              Recently Uploaded ({certificates.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {certificates.length > 0 ? (
              certificates.map((cert) => {
                const trainee = trainees.find((t) => t.id === cert.trainee_id);
                return (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {trainee?.full_name || trainee?.name || "Unknown trainee"}
                      </p>
                      <a
                        href={cert.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-xs text-primary hover:underline"
                      >
                        {cert.file_name}
                      </a>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {new Date(cert.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        Uploaded
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(cert)}
                        className="size-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-40 items-center justify-center text-center text-xs text-muted-foreground">
                No certificates uploaded yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
