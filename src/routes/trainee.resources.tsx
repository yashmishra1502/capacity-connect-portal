import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, Section, SimpleTable } from "@/components/kit";
import { resources } from "@/lib/mock-data";

export const Route = createFileRoute("/trainee/resources")({
  component: TraineeResources,
});

function TraineeResources() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");

  const list = resources.filter(
    (r) =>
      (type === "all" || r.type === type) &&
      (r.title + r.course).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Learning Resources"
        subtitle="Handbooks, recordings, templates and datasets shared by your trainers"
      />

      <Section
        title="Resource library"
        description={`${list.length} items available`}
        actions={
          <div className="flex gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search resources"
                className="w-44 pl-9 md:w-56"
              />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
                <SelectItem value="XLSX">XLSX</SelectItem>
                <SelectItem value="DOCX">DOCX</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        <SimpleTable
          columns={["Resource", "Course", "Type", "Size", "Uploaded", "Downloads", ""]}
          rows={list.map((r) => ({
            key: r.id,
            cells: [
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <span className="font-medium">{r.title}</span>
              </div>,
              r.course,
              <Badge variant="secondary">{r.type}</Badge>,
              r.size,
              r.uploaded,
              r.downloads.toLocaleString(),
              <Button size="sm" variant="outline">
                <Download className="mr-1.5 size-3.5" /> Get
              </Button>,
            ],
          }))}
        />
      </Section>
    </>
  );
}
