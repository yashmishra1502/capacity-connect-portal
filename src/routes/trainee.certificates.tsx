import { createFileRoute } from "@tanstack/react-router";
import { Award, Download, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { certificates } from "@/lib/mock-data";

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

const GRADE_STYLE: Record<string, string> = {
  "A+": "border-success/40 bg-success/10 text-success",
  A: "border-success/40 bg-success/10 text-success",
  "B+": "border-info/40 bg-info/10 text-info",
  B: "border-warning/40 bg-warning/10 text-warning",
};

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
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {certificates.map((cert, index) => (
          <Card
            key={cert.id}
            className="cc-glow-card cc-page-in overflow-hidden border-border/70 bg-card/70 backdrop-blur transition-all duration-300 hover:shadow-lg"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {/* Certificate "seal" header */}
            <div className="relative flex items-center justify-between bg-gradient-to-br from-navy to-[#123368] p-5">
              <div className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20">
                <Award className="size-5" />
              </div>
              <Badge className={cn("rounded-full border font-bold", GRADE_STYLE[cert.grade] ?? "border-border bg-muted")}>
                Grade {cert.grade}
              </Badge>
            </div>

            <CardContent className="flex flex-col gap-4 p-5">
              <div className="space-y-1">
                <h2 className="font-display text-base font-bold leading-snug">{cert.course}</h2>
                <p className="text-xs text-muted-foreground">{cert.code} · {cert.id}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>Issued {cert.issued}</span>
                <span>·</span>
                <span>{cert.hours}h certified</span>
              </div>

              <Button size="sm" className="cc-btn-glass mt-auto w-full gap-1.5 rounded-full">
                <Download className="size-3.5" /> Download certificate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {certificates.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Complete a course to earn your first certificate.
        </p>
      )}
    </div>
  );
}
