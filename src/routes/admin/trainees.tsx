import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UserPlus, Search, Users, Edit3, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

type Trainee = {
  id: string;
  name: string;
  department: string;
  enrolledCourses: number;
  status: "active" | "inactive";
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

  // Dialog & Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrainee, setEditingTrainee] = useState<Trainee | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    status: "active" as "active" | "inactive",
  });

  const fetchTrainees = async () => {
    setLoading(true);
    setError(null);

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, name, dept, status")
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
      department: p.dept ?? "—",
      enrolledCourses: countByTrainee[p.id] ?? 0,
      status: (p.status as "active" | "inactive") ?? "inactive",
    }));

    setTrainees(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrainees();
  }, []);

  const handleOpenAdd = () => {
    setEditingTrainee(null);
    setFormData({ name: "", department: "", status: "active" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (trainee: Trainee) => {
    setEditingTrainee(trainee);
    setFormData({
      name: trainee.name,
      department: trainee.department === "—" ? "" : trainee.department,
      status: trainee.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (editingTrainee) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          dept: formData.department.trim() || null,
          status: formData.status,
        })
        .eq("id", editingTrainee.id);

      if (updateError) {
        alert(`Failed to update trainee: ${updateError.message}`);
        setSubmitting(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          name: formData.name,
          dept: formData.department.trim() || null,
          status: formData.status,
          role: "trainee",
          joined_date: new Date().toISOString(),
        });

      if (insertError) {
        alert(`Failed to create trainee: ${insertError.message}`);
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    setIsDialogOpen(false);
    fetchTrainees();
  };

  const filteredTrainees = trainees.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
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
              View, add, and manage trainee records across departments.
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="gap-1.5 border border-white/40 bg-white/50 text-foreground backdrop-blur-md transition-all hover:scale-105 hover:bg-white/70 active:scale-95 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
          >
            <UserPlus className="size-4" style={{ color: accent }} />
            Add Trainee
          </Button>
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
              <p className="text-xs text-muted-foreground">Inactive</p>
              <p className="font-display text-lg font-bold">
                {trainees.filter((t) => t.status === "inactive").length || "—"}
              </p>
            </div>
          </Glass>
        </motion.div>

        {/* Table & Search Container */}
        <motion.div variants={itemVariants}>
          <Glass className="p-5">
            <GlassInputWrap className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search trainees..."
                className="border-none bg-transparent pl-8 focus-visible:ring-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </GlassInputWrap>

            <div className="mt-4">
              {loading ? (
                <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-5 animate-spin" style={{ color: accent }} />
                  Loading trainees...
                </div>
              ) : error ? (
                <div className="flex h-[200px] items-center justify-center text-xs text-destructive">
                  Failed to load trainees: {error}
                </div>
              ) : filteredTrainees.length === 0 ? (
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
                    <AnimatePresence>
                      {filteredTrainees.map((t) => (
                        <motion.tr
                          key={t.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                          className="border-b border-white/20 transition-colors hover:bg-white/20"
                        >
                          <TableCell className="font-medium">{t.name}</TableCell>
                          <TableCell>{t.department}</TableCell>
                          <TableCell>{t.enrolledCourses}</TableCell>
                          <TableCell>
                            <Badge variant={t.status === "active" ? "default" : "secondary"}>
                              {t.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEdit(t)}
                              className="gap-1 transition-transform hover:scale-105 active:scale-95 hover:bg-white/10"
                            >
                              <Edit3 className="size-3.5" />
                              Edit
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              )}
            </div>
          </Glass>
        </motion.div>
      </motion.div>

      {/* Animated Add / Edit Trainee Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-white/20 bg-background/80 text-foreground backdrop-blur-xl sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingTrainee ? "Edit Trainee" : "Add New Trainee"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Full Name</label>
              <Input
                required
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Department</label>
              <Input
                placeholder="e.g. Backend Coder, imd"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as "active" | "inactive" })
                }
                className="w-full rounded-md border border-white/10 bg-background/50 p-2 text-xs text-foreground focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting && <Loader2 className="size-3.5 animate-spin" />}
                {submitting ? "Saving..." : editingTrainee ? "Save Changes" : "Add Trainee"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </GlassBackground>
  );
}
