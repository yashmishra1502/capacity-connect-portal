import { createFileRoute } from "@tanstack/react-router";
import { Award, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/trainee/certificates")({
  head: () => ({
    meta: [
      { title: "Certificates — Trainee · Capacity Connect" },
      {
        name: "description",
        content: "View and download your verified certificates linked to your service record.",
      },
    ],
  }),
  component: TraineeCertificates,
});

interface CertificateItem {
  id: string;
  course: string;
  code: string;
  issued: string;
  grade: string;
  hours: number;
}

// Cleared mock data list
const certificates: CertificateItem[] = [];

function TraineeCertificates() {
  const totalHours = certificates.reduce((acc, c) => acc + c.hours, 0);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
          Recognition
        </Badge>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Your Certificates</h1>
        <p className="max-w-2xl text-muted-foreground">
          Verified certificates issued on completion, linked to your service record and
          recognised across departments under the Capacity Building Commission.
        </p>
      </header>

      {/* Stat strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Award className="size-5" />
            </div>
            <div>
              <p className="font-display text-xl font-bold">{certificates.length}</p>
              <p className="text-xs text-muted-foreground">Certificates earned</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="font-display text-xl font-bold">{totalHours}h</p>
              <p className="text-xs text-muted-foreground">Total certified hours</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="font-display text-xl font-bold">Verified</p>
              <p className="text-xs text-muted-foreground">All records tamper-evident</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificate grid */}
      {certificates.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {/* Certificate cards list */}
        </div>
      )}

      {certificates.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Complete a course to earn your first certificate.
        </p>
      )}
    </div>
  );
}
