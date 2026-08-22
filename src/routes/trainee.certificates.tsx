import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Award, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader, Section, StatCard } from "@/components/kit";
import { certificates } from "@/lib/mock-data";

export const Route = createFileRoute("/trainee/certificates")({
  component: Certificates,
});

function Certificates() {
  const [open, setOpen] = useState<(typeof certificates)[number] | null>(null);

  return (
    <>
      <PageHeader title="Certificates" subtitle="Verified completion certificates issued to you" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Certificates earned" value={3} tone="success" />
        <StatCard label="Certified hours" value="66 hrs" tone="info" />
        <StatCard label="In progress" value={2} tone="warning" />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {certificates.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-0">
              <div className="brand-gradient flex items-center justify-between rounded-t-lg px-5 py-6 text-navy-foreground">
                <Award className="size-8" />
                <Badge variant="secondary">Grade {c.grade}</Badge>
              </div>
              <div className="p-5">
                <h3 className="font-display text-sm font-semibold leading-snug">{c.course}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.code} · {c.hours} hrs · Issued {c.issued}
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground">Certificate ID: {c.id}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => setOpen(c)}>
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="size-3.5" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Section title="Verification" description="Anyone can verify a certificate using its ID">
          <p className="text-sm text-muted-foreground">
            Certificates issued by Capacity Connect carry a unique ID and QR code. Verification is
            available at the public certificate registry maintained by the Commission.
          </p>
        </Section>
      </div>

      <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Certificate preview</DialogTitle>
          </DialogHeader>
          <div className="rounded-lg border-4 border-primary/20 p-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Capacity Building Commission
            </p>
            <h2 className="mt-4 font-display text-xl font-bold">Certificate of Completion</h2>
            <p className="mt-6 text-sm text-muted-foreground">This is to certify that</p>
            <p className="mt-1 font-display text-lg font-semibold">Yash Mishra</p>
            <p className="mt-3 text-sm text-muted-foreground">has successfully completed</p>
            <p className="mt-1 text-base font-semibold">{open?.course}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {open?.hours} hours · Grade {open?.grade} · Issued {open?.issued}
            </p>
            <p className="mt-6 text-[11px] text-muted-foreground">Certificate ID: {open?.id}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
