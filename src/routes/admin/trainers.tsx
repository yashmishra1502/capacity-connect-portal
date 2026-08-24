import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, Search, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Glass, GlassBackground, GlassInputWrap, accent } from "@/components/glass-ui";

export const Route = createFileRoute("/admin/trainers")({
  head: () => ({
    meta: [{ title: "Trainer Management — Administration · Capacity Connect" }],
  }),
  component: TrainerManagement,
});

// TODO: replace with real API data (useQuery)
type Trainer = {
  id: string;
  name: string;
  specialization: string;
  assignedCourses: number;
  status: "active" | "inactive";
};
const trainers: Trainer[] = [];

function TrainerManagement() {
  return (
    <GlassBackground>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Trainer Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, add, and manage trainer records and assignments.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 border border-white/40 bg-white/50 text-foreground backdrop-blur-md hover:bg-white/70 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <UserPlus className="size-4" style={{ color: accent }} />
          Add Trainer
        </Button>
      </div>

      {/* Quick stat strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Glass className="flex items-center gap-3 p-4">
          <span className="flex size-9 items-center justify-center rounded-lg border border-white/40 bg-white/50 dark:border-white/10 dark:bg-white/10">
            <GraduationCap className="size-4" style={{ color: accent }} />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Total trainers</p>
            <p className="font-display text-lg font-bold">{trainers.length || "—"}</p>
          </div>
        </Glass>
        <Glass className="flex items-center gap-3 p-4">
          <span className="flex size-9 items-center justify-center rounded-lg border border-white/40 bg-white/50 dark:border-white/10 dark:bg-white/10">
            <GraduationCap className="size-4" style={{ color: accent }} />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="font-display text-lg font-bold">
              {trainers.filter((t) => t.status === "active").length || "—"}
            </p>
          </div>
        </Glass>
        <Glass className="flex items-center gap-3 p-4">
          <span className="flex size-9 items-center justify-center rounded-lg border border-white/40 bg-white/50 dark:border-white/10 dark:bg-white/10">
            <GraduationCap className="size-4" style={{ color: accent }} />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Inactive</p>
            <p className="font-display text-lg font-bold">
              {trainers.filter((t) => t.status === "inactive").length || "—"}
            </p>
          </div>
        </Glass>
      </div>

      <Glass className="p-5">
        <GlassInputWrap className="relative">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search trainers..."
            className="border-none bg-transparent pl-8 focus-visible:ring-0"
          />
        </GlassInputWrap>

        <div className="mt-4">
          {trainers.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
              No trainers found yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Assigned Courses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainers.map((t) => (
                  <TableRow key={t.id} className="border-white/20 hover:bg-white/20">
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.specialization}</TableCell>
                    <TableCell>{t.assignedCourses}</TableCell>
                    <TableCell>
                      <Badge variant={t.status === "active" ? "default" : "secondary"}>
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Glass>
    </GlassBackground>
  );
}
