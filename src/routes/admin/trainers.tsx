import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, GraduationCap, Edit3, Loader2 } from "lucide-react";
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

export const Route = createFileRoute("/admin/trainers")({
  head: () => ({
    meta: [{ title: "Trainer Management — Administration · Capacity Connect" }],
  }),
  component: TrainerManagement,
});

type TrainerStatus = "active" | "suspended";

type Trainer = {
  id: string;
  name: string;
  email: string;
  specialization: string;
  assignedCourses: number;
  status: TrainerStatus;
};

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

function TrainerManagement() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Dialog & Form state for Editing
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    specialization: string;
    status: TrainerStatus;
  }>({
    name: "",
    email: "",
    specialization: "",
    status: "active",
  });

  const fetchTrainers = async () => {
    setLoading(true);
    setError(null);

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, name, email, dept, status")
      .eq("role", "trainer")
      .order("joined_date", { ascending: false });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("trainer_id");

    if (coursesError) {
      setError(coursesError.message);
      setLoading(false);
      return;
    }

    const countByTrainer: Record<string, number> = {};
    (courses ?? []).forEach((c: { trainer_id: string | null }) => {
      if (!c.trainer_id) return;
      countByTrainer[c.trainer_id] = (countByTrainer[c.trainer_id] ?? 0) + 1;
    });

    const mapped: Trainer[] = (profiles ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email ?? "—",
      specialization: p.dept ?? "—",
      assignedCourses: countByTrainer[p.id] ?? 0,
      status: (p.status as TrainerStatus) ?? "active",
    }));

    setTrainers(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleOpenEdit = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name,
      email: trainer.email === "—" ? "" : trainer.email,
      specialization: trainer.specialization === "—" ? "" : trainer.specialization,
      status: trainer.status === "suspended" ? "suspended" : "active",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrainer) return;

    setSubmitting(true);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        name: formData.name,
        email: formData.email.trim(),
        dept: formData.specialization.trim() || null,
        status: formData.status,
      })
      .eq("id", editingTrainer.id);

    if (updateError) {
      alert(`Failed to update trainer: ${updateError.message}`);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setIsDialogOpen(false);
    fetchTrainers();
  };

  const filteredTrainers = trainers.filter(
    (t) =>
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
        <motion.div variants={itemVariants}>
          <h1 className="font-display text-xl font-bold">Trainer Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage trainer records and assignments.
          </p>
        </motion.div>

        {/* Quick stat strip */}
        <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
          <Glass className="flex items-center gap-3 p-4 transition-transform hover:-translate-y-1">
            <span className="flex size-9 items-center justify-center rounded-lg border border-white/40 bg-white/50 dark:border-white/10 dark:bg-white/10">
              <GraduationCap className="size-4" style={{ color: accent }} />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Total trainers</p>
              <p className="font-display text-lg font-bold">{trainers.length || "—"}</p>
            </div>
          </Glass>
          <Glass className="flex items-center gap-3 p-4 transition-transform hover:-translate-y-1">
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
          <Glass className="flex items-center gap-3 p-4 transition-transform hover:-translate-y-1">
            <span className="flex size-9 items-center justify-center rounded-lg border border-white/40 bg-white/50 dark:border-white/10 dark:bg-white/10">
              <GraduationCap className="size-4" style={{ color: accent }} />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Suspended</p>
              <p className="font-display text-lg font-bold">
                {trainers.filter((t) => t.status === "suspended").length || "—"}
              </p>
            </div>
          </Glass>
        </motion.div>

        {/* Search + Table */}
        <motion.div variants={itemVariants}>
          <Glass className="p-5">
            <GlassInputWrap className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search trainers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-none bg-transparent pl-8 focus-visible:ring-0"
              />
            </GlassInputWrap>

            <div className="mt-4">
              {loading ? (
                <div className="flex h-[200px] items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Loading trainers...
                </div>
              ) : error ? (
                <div className="flex h-[200px] items-center justify-center text-sm text-destructive">
                  {error}
                </div>
              ) : filteredTrainers.length === 0 ? (
                <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
                  No trainers found yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20 hover:bg-transparent">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Assigned Courses</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrainers.map((t) => (
                      <TableRow key={t.id} className="border-white/20 hover:bg-white/20">
                        <TableCell className="font-medium">{t.name}</TableCell>
                        <TableCell>{t.email}</TableCell>
                        <TableCell>{t.specialization}</TableCell>
                        <TableCell>{t.assignedCourses}</TableCell>
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
            </div>
          </Glass>
        </motion.div>
      </motion.div>

      {/* Edit Trainer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Trainer</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="trainer-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="trainer-name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Trainer full name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="trainer-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="trainer-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="trainer@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="trainer-specialization" className="text-sm font-medium">
                Specialization
              </label>
              <Input
                id="trainer-specialization"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, specialization: e.target.value }))
                }
                placeholder="e.g. Digital Marketing"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="trainer-status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="trainer-status"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as TrainerStatus,
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
