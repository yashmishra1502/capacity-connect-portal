import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UserPlus, Search, Users, Edit3, Loader2 } from "lucide-react";
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
            <span className="flex
