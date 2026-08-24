import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [{ title: "Reports — Administration · Capacity Connect" }],
  }),
  component: Reports,
});

// TODO: replace with real API data (useQuery)
type Report = {
  id: string;
  name: string;
  category: "enrollment" | "completion" | "financial" | "compliance";
  generatedOn: string;
  format: "PDF" | "XLSX" | "CSV";
};

const reports: Report[] = [];

const quickReports = [
  { title: "Enrollment Summary", description: "Monthly enrollment counts by department" },
  { title: "Completion Report", description: "Course completion rates across trainees" },
  { title: "Trainer Activity", description: "Sessions conducted and hours logged" },
  { title: "Compliance Audit", description: "Certification and policy adherence status" },
];

function categoryBadge(category: Report["category"]) {
  const labelMap: Record<Report["category"], string> = {
    enrollment: "Enrollment",
    completion: "Completion",
    financial: "Financial",
    compliance: "Compliance",
  };
  return <Badge variant="secondary">{labelMap[category]}</Badge>;
}

function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate and download platform reports.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickReports.map((r) => (
          <Card key={r.title} className="transition-colors hover:bg-muted/40">
            <CardContent className="space-y-2 pt-6">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileText className="size-4 text-primary" />
                </div>
              </div>
              <p className="text-sm font-semibold">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.description}</p>
              <Button size="sm" variant="outline" className="mt-2 w-full gap-1.5">
                <Download className="size-3.5" />
                Generate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-sm font-bold">Generated reports</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Filter className="size-3.5" />
                Filter
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Calendar className="size-3.5" />
                Date range
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
              No reports generated yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Generated On</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{categoryBadge(r.category)}</TableCell>
                    <TableCell>{r.generatedOn}</TableCell>
                    <TableCell>{r.format}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" className="gap-1.5">
                        <Download className="size-3.5" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
