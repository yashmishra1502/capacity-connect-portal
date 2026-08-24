import { useState } from "react";
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  Search,
  Mail,
  GraduationCap,
  Users,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { StatCard } from "@/components/stat-card";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Dashboard — Administration · Capacity Connect" }],
  }),
  component: AdminDashboard,
});

// TODO: replace with real API data
const departmentProgress: { name: string; pct: number }[] = [];
const enrollmentTrend: { month: string; enrollments: number; completions: number }[] = [];
const categoryDistribution: { name: string; value: number }[] = [];

const pieColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
      {label}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Trainer / Trainee management — inlined directly into this route   */
/* ------------------------------------------------------------------ */

type PersonStatus = "active" | "inactive" | "pending";

type Trainer = {
  id: string;
  name: string;
  email: string;
  specialty: string;
  traineeCount: number;
  status: PersonStatus;
};

type Trainee = {
  id: string;
  name: string;
  email: string;
  department: string;
  trainerId: string | null;
  status: PersonStatus;
};

const initialTrainers: Trainer[] = [
  { id: "t1", name: "Ananya Rao", email: "ananya.rao@capacityconnect.com", specialty: "Safety & Compliance", traineeCount: 4, status: "active" },
  { id: "t2", name: "Vikram Shah", email: "vikram.shah@capacityconnect.com", specialty: "Technical Skills", traineeCount: 2, status: "active" },
  { id: "t3", name: "Meera Iyer", email: "meera.iyer@capacityconnect.com", specialty: "Leadership", traineeCount: 0, status: "pending" },
];

const initialTrainees: Trainee[] = [
  { id: "e1", name: "Rohan Gupta", email: "rohan.gupta@capacityconnect.com", department: "Operations", trainerId: "t1", status: "active" },
  { id: "e2", name: "Priya Nair", email: "priya.nair@capacityconnect.com", department: "Engineering", trainerId: "t2", status: "active" },
  { id: "e3", name: "Karan Mehta", email: "karan.mehta@capacityconnect.com", department: "Operations", trainerId: "t1", status: "inactive" },
];

const statusStyles: Record<PersonStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  inactive: "bg-muted text-muted-foreground border-border",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function StatusBadge({ status }: { status: PersonStatus }) {
  return (
    <Badge variant="outline" className={`capitalize text-[11px] ${statusStyles[status]}`}>
      {status}
    </Badge>
  );
}

type TrainerFormState = { name: string; email: string; specialty: string; status: PersonStatus };
type TraineeFormState = { name: string; email: string; department: string; trainerId: string; status: PersonStatus };

const emptyTrainerForm: TrainerFormState = { name: "", email: "", specialty: "", status: "active" };
const emptyTraineeForm: TraineeFormState = { name: "", email: "", department: "", trainerId: "", status: "active" };

function TrainerTraineeManagement() {
  const [tab, setTab] = useState<"trainers" | "trainees">("trainers");
  const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers);
  const [trainees, setTrainees] = useState<Trainee[]>(initialTrainees);
  const [query, setQuery] = useState("");

  const [trainerDialogOpen, setTrainerDialogOpen] = useState(false);
  const [editingTrainerId, setEditingTrainerId] = useState<string | null>(null);
  const [trainerForm, setTrainerForm] = useState<TrainerFormState>(emptyTrainerForm);

  const [traineeDialogOpen, setTraineeDialogOpen] = useState(false);
  const [editingTraineeId, setEditingTraineeId] = useState<string | null>(null);
  const [traineeForm, setTraineeForm] = useState<TraineeFormState>(emptyTraineeForm);

  const filteredTrainers = trainers.filter((t) =>
    `${t.name} ${t.email} ${t.specialty}`.toLowerCase().includes(query.toLowerCase())
  );
  const filteredTrainees = trainees.filter((t) =>
    `${t.name} ${t.email} ${t.department}`.toLowerCase().includes(query.toLowerCase())
  );

  function openAddTrainer() {
    setEditingTrainerId(null);
    setTrainerForm(emptyTrainerForm);
    setTrainerDialogOpen(true);
  }

  function openEditTrainer(t: Trainer) {
    setEditingTrainerId(t.id);
    setTrainerForm({ name: t.name, email: t.email, specialty: t.specialty, status: t.status });
    setTrainerDialogOpen(true);
  }

  function saveTrainer() {
    if (!trainerForm.name.trim() || !trainerForm.email.trim()) return;
    if (editingTrainerId) {
      setTrainers((prev) =>
        prev.map((t) => (t.id === editingTrainerId ? { ...t, ...trainerForm } : t))
      );
    } else {
      setTrainers((prev) => [
        ...prev,
        { id: `t${Date.now()}`, traineeCount: 0, ...trainerForm },
      ]);
    }
    setTrainerDialogOpen(false);
  }

  function deleteTrainer(id: string) {
    setTrainers((prev) => prev.filter((t) => t.id !== id));
    setTrainees((prev) =>
      prev.map((tr) => (tr.trainerId === id ? { ...tr, trainerId: null } : tr))
    );
  }

  function openAddTrainee() {
    setEditingTraineeId(null);
    setTraineeForm(emptyTraineeForm);
    setTraineeDialogOpen(true);
  }

  function openEditTrainee(t: Trainee) {
    setEditingTraineeId(t.id);
    setTraineeForm({
      name: t.name,
      email: t.email,
      department: t.department,
      trainerId: t.trainerId ?? "",
      status: t.status,
    });
    setTraineeDialogOpen(true);
  }

  function saveTrainee() {
    if (!traineeForm.name.trim() || !traineeForm.email.trim()) return;
    const payload = {
      name: traineeForm.name,
      email: traineeForm.email,
      department: traineeForm.department,
      trainerId: traineeForm.trainerId || null,
      status: traineeForm.status,
    };
    if (editingTraineeId) {
      setTrainees((prev) =>
        prev.map((t) => (t.id === editingTraineeId ? { ...t, ...payload } : t))
      );
    } else {
      setTrainees((prev) => [...prev, { id: `e${Date.now()}`, ...payload }]);
    }
    setTraineeDialogOpen(false);
  }

  function deleteTrainee(id: string) {
    setTrainees((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="font-display text-sm font-bold">Trainer &amp; trainee management</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Add, edit, or remove trainers and trainees across the platform.
          </p>
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as "trainers" | "trainees")}>
          <TabsList>
            <TabsTrigger value="trainers" className="gap-1.5 text-xs">
              <GraduationCap className="size-3.5" />
              Trainers
            </TabsTrigger>
            <TabsTrigger value="trainees" className="gap-1.5 text-xs">
              <Users className="size-3.5" />
              Trainees
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tab === "trainers" ? "Search trainers…" : "Search trainees…"}
              className="h-8 pl-8 text-xs"
            />
          </div>
          <Button
            size="sm"
            className="gap-1.5 text-xs"
            onClick={tab === "trainers" ? openAddTrainer : openAddTrainee}
          >
            <Plus className="size-3.5" />
            {tab === "trainers" ? "Add trainer" : "Add trainee"}
          </Button>
        </div>

        {tab === "trainers" ? (
          filteredTrainers.length === 0 ? (
            <EmptyState label={query ? "No trainers match your search" : "No trainers added yet"} />
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Trainer</TableHead>
                    <TableHead className="text-xs">Specialty</TableHead>
                    <TableHead className="text-xs">Trainees</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="w-20 text-right text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrainers.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-7">
                            <AvatarFallback className="text-[10px]">{initials(t.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-xs font-medium">{t.name}</div>
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Mail className="size-3" />
                              {t.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{t.specialty || "—"}</TableCell>
                      <TableCell className="text-xs">{t.traineeCount}</TableCell>
                      <TableCell>
                        <StatusBadge status={t.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => openEditTrainer(t)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive hover:text-destructive"
                            onClick={() => deleteTrainer(t.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        ) : filteredTrainees.length === 0 ? (
          <EmptyState label={query ? "No trainees match your search" : "No trainees added yet"} />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Trainee</TableHead>
                  <TableHead className="text-xs">Department</TableHead>
                  <TableHead className="text-xs">Trainer</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="w-20 text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainees.map((t) => {
                  const trainer = trainers.find((tr) => tr.id === t.trainerId);
                  return (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-7">
                            <AvatarFallback className="text-[10px]">{initials(t.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-xs font-medium">{t.name}</div>
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Mail className="size-3" />
                              {t.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{t.department || "—"}</TableCell>
                      <TableCell className="text-xs">{trainer ? trainer.name : "Unassigned"}</TableCell>
                      <TableCell>
                        <StatusBadge status={t.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => openEditTrainee(t)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive hover:text-destructive"
                            onClick={() => deleteTrainee(t.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Add / edit trainer dialog */}
      <Dialog open={trainerDialogOpen} onOpenChange={setTrainerDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-sm font-bold">
              {editingTrainerId ? "Edit trainer" : "Add trainer"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Full name</Label>
              <Input
                value={trainerForm.name}
                onChange={(e) => setTrainerForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Ananya Rao"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input
                type="email"
                value={trainerForm.email}
                onChange={(e) => setTrainerForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Specialty</Label>
              <Input
                value={trainerForm.specialty}
                onChange={(e) => setTrainerForm((f) => ({ ...f, specialty: e.target.value }))}
                placeholder="e.g. Safety & Compliance"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select
                value={trainerForm.status}
                onValueChange={(v) => setTrainerForm((f) => ({ ...f, status: v as PersonStatus }))}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setTrainerDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={saveTrainer}>
              {editingTrainerId ? "Save changes" : "Add trainer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / edit trainee dialog */}
      <Dialog open={traineeDialogOpen} onOpenChange={setTraineeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-sm font-bold">
              {editingTraineeId ? "Edit trainee" : "Add trainee"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Full name</Label>
              <Input
                value={traineeForm.name}
                onChange={(e) => setTraineeForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Rohan Gupta"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input
                type="email"
                value={traineeForm.email}
                onChange={(e) => setTraineeForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Department</Label>
              <Input
                value={traineeForm.department}
                onChange={(e) => setTraineeForm((f) => ({ ...f, department: e.target.value }))}
                placeholder="e.g. Operations"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Trainer</Label>
              <Select
                value={traineeForm.trainerId || "unassigned"}
                onValueChange={(v) =>
                  setTraineeForm((f) => ({ ...f, trainerId: v === "unassigned" ? "" : v }))
                }
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {trainers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select
                value={traineeForm.status}
                onValueChange={(v) => setTraineeForm((f) => ({ ...f, status: v as PersonStatus }))}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setTraineeDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={saveTrainee}>
              {editingTraineeId ? "Save changes" : "Add trainee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ------------------------------------------------------------------ */

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide overview across courses and approvals.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard icon={BookOpen} label="Active courses" value="—" accent="violet" />
        <StatCard icon={Award} label="Completion rate" value="—" accent="emerald" />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-sm font-bold">Department completion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {departmentProgress.length === 0 ? (
            <EmptyState label="No department data available yet" />
          ) : (
            departmentProgress.map((d) => (
              <div key={d.name}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium">{d.name}</span>
                  <span className="text-muted-foreground">{d.pct}%</span>
                </div>
                <Progress value={d.pct} className="h-1.5" />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Enrollment &amp; completion trend</CardTitle>
            <p className="text-xs text-muted-foreground">Monthly enrollments vs completions</p>
          </CardHeader>
          <CardContent>
            {enrollmentTrend.length === 0 ? (
              <EmptyState label="No enrollment data available yet" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={enrollmentTrend} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="enrollFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="completeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="enrollments" stroke="var(--color-chart-1)" fill="url(#enrollFill)" strokeWidth={2} name="Enrollments" />
                  <Area type="monotone" dataKey="completions" stroke="var(--color-chart-3)" fill="url(#completeFill)" strokeWidth={2} name="Completions" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm font-bold">Courses by category</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryDistribution.length === 0 ? (
              <EmptyState label="No course data available yet" />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                      {categoryDistribution.map((_, i) => (
                        <Cell key={i} fill={pieColors[i % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-1.5">
                  {categoryDistribution.map((c, i) => (
                    <div key={c.name} className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                        {c.name}
                      </span>
                      <span className="text-muted-foreground">{c.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trainer / Trainee management — built inline, right here */}
      <TrainerTraineeManagement />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-sm font-bold">System status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span>Certificate issuance — Operational</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span>Assessment engine — Operational</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Clock className="size-4 text-amber-500" />
            <span>Trainer matching — Sync in progress</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>Access control — Verified</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
