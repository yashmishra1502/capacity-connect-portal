import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, Search, Users } from "lucide-react";
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

export const Route = createFileRoute("/admin/trainees")({
  head: () => ({
    meta: [{ title: "Trainee Management — Administration · Capacity Connect" }],
  }),
  component: TraineeManagement,
});

// TODO: replace with real API data (useQuery)
type Trainee = {
  id: string;
  name: string;
  department: string;
  enrolledCourses: number;
  status: "active" | "inactive";
};
const trainees: Trainee[] = [];

function TraineeManagement() {
  return (
    <GlassBackground>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Trainee Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, add, and manage trainee records across departments.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 border border-white/40 bg-white/50 text-foreground backdrop-blur-md hover:bg-white/70 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <UserPlus className="size-4" style={{ color: accent }} />
          Add Trainee
        </Button>
      </div>

      {/* Quick stat strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Glass className="flex items-center gap-3 p-4">
          <span className="flex size-9 items-center justify-center rounded-lg border border-white/40 bg-white/50 dark:border-white/10 dark:bg-white/10">
            <Users className="size-4" style={{ color: accent }} />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Total trainees</p>
            <p className="font-display text-lg font-bold">{trainees.length || "—"}</p>
          </div>
        </Glass>
        <Glass className="flex items-center gap-3 p-4">
          <span className="flex size-9 items-center justify-center rounded-lg border border-white/40 bg-white/50 dark:border-white/10 dark:bg-white/10">
            <Users className="size-4" style={{ color: accent }} />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="font-display text-lg font-bold">
              {trainees.filter((t) => t.status === "active").length || "—"}
            </p>
          </div>
        </Glass>
        <Glass className="flex items-center gap-3 p-4">
          <span className="flex size-9 items-center justify-center rounded-lg border border-white/40 bg-white/50 dark:border-white/10 dark:bg-white/10">
            <Users className="size-4" style={{ color: accent }} />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Inactive</p>
            <p className="font-display text-lg font-bold">
              {trainees.filter((t) => t.status === "inactive").length || "—"}
            </p>
          </div>
        </Glass>
      </div>

      <Glass className="p-5">
        <GlassInputWrap className="relative">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search trainees..."
            className="border-none bg-transparent pl-8 focus-visible:ring-0"
          />
        </GlassInputWrap>

        <div className="mt-4">
          {trainees.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
              No trainees found yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Enrolled Courses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainees.map((t) => (
                  <TableRow key={t.id} className="border-white/20 hover:bg-white/20">
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.department}</TableCell>
                    <TableCell>{t.enrolledCourses}</TableCell>
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
