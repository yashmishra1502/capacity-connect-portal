import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Users, Edit3, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Glass, GlassBackground, GlassInputWrap, accent } from "@/components/glass-ui";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/admin/trainees")({
  head: () => ({
    meta: [{ title: "Trainee Management — Administration · Capacity Connect" }],
  }),
  component: TraineeManagement,
});

type TraineeStatus = "active" | "suspended" | "pending";

type Trainee = {
  id: string;
  name: string;
  email: string;
  department: string;
  enrolledCourses: number;
  status: TraineeStatus;
};

// Animation variants for smooth entrance
const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

function TraineeManagement() {
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Dialog & Form state for Editing
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrainee, setEditingTrainee] = useState<Trainee | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    department: string;
    status: TraineeStatus;
  }>({
    name: "",
    email: "",
    department: "",
    status: "active",
  });

  const fetchTrainees = async () => {
    setLoading(true);
    setError(null);

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, name, email, dept, status")
      .eq("role", "trainee")
      .order("joined_date", { ascending: false });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    const { data: enrollments, error: enrollError } = await supabase
      .from("enrollments")
      .select("trainee_id");

    if (enrollError) {
      setError(enrollError.message);
      setLoading(false);
      return;
    }

    const countByTrainee: Record<string, number> = {};
    (enrollments ?? []).forEach((e: { trainee_id: string }) => {
      countByTrainee[e.trainee_id] = (countByTrainee[e.trainee_id] ?? 0) + 1;
    });

    const mapped: Trainee[] = (profiles ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email ?? "—",
      department: p.dept ?? "—",
      enrolledCourses: countByTrainee[p.id] ?? 0,
      status: (p.status as TraineeStatus) ?? "active",
    }));

    setTrainees(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrainees();
  }, []);

  const handleOpenEdit = (trainee: Trainee) => {
    setEditingTrainee(trainee);
    setFormData({
      name: trainee.name,
      email: trainee.email === "—" ? "" : trainee.email,
      department: trainee.department === "—" ? "" : trainee.department,
      status: trainee.status === "suspended" ? "suspended" : "active",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrainee) return;

    setSubmitting(true);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        name: formData.name,
        email: formData.email.trim(),
        dept: formData.department.trim() || null,
        status: formData.status,
      })
      .eq("id", editingTrainee.id);

    if (updateError) {
      alert(`Failed to update trainee: ${updateError.message}`);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setIsDialogOpen(false);
    fetchTrainees();
  };

  const filteredTrainees = trainees.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <GlassBackground>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header Bar */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold">Trainee Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View and manage trainee records across departments.
            </p>
          </div>
        </motion.div>

        {/* Summary Metric Cards */}
        <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
          <Glass className="flex items-center gap-3 p-4 transition-transform hover:-translate-y-1">
            <span className="flex size-9 items-center justify-center rounded-lg border border-white/40 bg-white/50 dark:border-white/10 dark:bg-white/10">
              <Users className="size-4" style={{ color: accent }} />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Total trainees</p>
              <p className="font-display text-lg font-bold">{trainees.length || "—"}</p>
            </div>
          </Glass>
          <Glass className="flex items-center gap-3 p-4 transition-transform hover:-translate-y-1">
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
          <Glass className="flex items-center gap-3 p-4 transition-transform hover:-translate-y-1">
            <span className="flex size-9 items-center justify-center rounded-lg border border-white/40 bg-white/50 dark:border-white/10 dark:bg-white/10">
              <Users className="size-4" style={{ color: accent }} />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Suspended</p>
              <p className="font-display text-lg font-bold">
                {trainees.filter((t) => t.status === "suspended").length || "—"}
              </p>
            </div>
          </Glass>
        </motion.div>

        {/* Search + Table */}
        <motion.div variants={itemVariants}>
          <Glass className="p-4">
            <div className="mb-4">
              <GlassInputWrap>
                <Search className="size-4 text-muted-foreground" />
                <Input
                  placeholder="Search trainees..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
              </GlassInputWrap>
            </div>

            {loading ? (
              <div className="flex h-[200px] items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading trainees...
              </div>
            ) : error ? (
              <div className="flex h-[200px] items-center justify-center text-sm text-destructive">
                {error}
              </div>
            ) : filteredTrainees.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
                No trainees found yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Enrolled Courses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrainees.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>{t.email}</TableCell>
                      <TableCell>{t.department}</TableCell>
                      <TableCell>{t.enrolledCourses}</TableCell>
                      <TableCell>
                        <Badge variant={t.status === "active" ? "default" : "destructive"}>
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(t)}
                          className="gap-1"
                        >
                          <Edit3 className="size-3.5" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Glass>
        </motion.div>
      </motion.div>

      {/* Edit Trainee Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Trainee</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="trainee-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="trainee-name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Trainee full name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="trainee-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="trainee-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="trainee@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="trainee-department" className="text-sm font-medium">
                Department
              </label>
              <Input
                id="trainee-department"
                value={formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, department: e.target.value }))
                }
                placeholder="e.g. Engineering"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="trainee-status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="trainee-status"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as TraineeStatus,
                  }))
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </GlassBackground>
  );
}
