import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Users,
  UserCog,
  Plus,
  Pencil,
  Trash2,
  Search,
  Link2,
  X,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// ---------------------------------------------------------------------------
// Trainer / Trainee management types & mock data
// TODO: replace with real API data
// ---------------------------------------------------------------------------

type Status = "active" | "inactive" | "pending";
type Role = "trainer" | "trainee";

interface Person {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: Status;
  assignedTo: string | null; // trainee -> trainer id
  joinedOn: string;
}

const initialPeople: Person[] = [
  { id: "t1", name: "Anita Sharma", email: "anita.sharma@capacityconnect.io", role: "trainer", department: "Engineering", status: "active", assignedTo: null, joinedOn: "2025-02-11" },
  { id: "t2", name: "Rohit Verma", email: "rohit.verma@capacityconnect.io", role: "trainer", department: "Sales", status: "active", assignedTo: null, joinedOn: "2025-04-03" },
  { id: "t3", name: "Priya Nair", email: "priya.nair@capacityconnect.io", role: "trainer", department: "Design", status: "pending", assignedTo: null, joinedOn: "2026-01-20" },
  { id: "e1", name: "Karan Mehta", email: "karan.mehta@capacityconnect.io", role: "trainee", department: "Engineering", status: "active", assignedTo: "t1", joinedOn: "2025-11-02" },
  { id: "e2", name: "Sneha Iyer", email: "sneha.iyer@capacityconnect.io", role: "trainee", department: "Engineering", status: "active", assignedTo: "t1", joinedOn: "2025-12-14" },
  { id: "e3", name: "Devansh Gupta", email: "devansh.gupta@capacityconnect.io", role: "trainee", department: "Sales", status: "inactive", assignedTo: "t2", joinedOn: "2025-09-18" },
  { id: "e4", name: "Meera Joshi", email: "meera.joshi@capacityconnect.io", role: "trainee", department: "Design", status: "pending", assignedTo: null, joinedOn: "2026-02-01" },
];

const departments = ["Engineering", "Sales", "Design", "Operations", "Support"];

const statusStyles: Record<Status, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  inactive: "bg-muted text-muted-foreground border-border",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

function emptyDraft(role: Role): Omit<Person, "id" | "joinedOn"> {
  return { name: "", email: "", role, department: departments[0], status: "pending", assignedTo: null };
}

// ---------------------------------------------------------------------------
// Trainer / Trainee management section (embedded in dashboard)
// ---------------------------------------------------------------------------

function TrainerTraineeSection() {
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [tab, setTab] = useState<Role>("trainer");
  const [query, setQuery] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<Person, "id" | "joinedOn">>(emptyDraft("trainer"));

  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null);
  const [assignTarget, setAssignTarget] = useState<Person | null>(null);
  const [assignTrainerId, setAssignTrainerId] = useState<string>("");

  const trainers = useMemo(() => people.filter((p) => p.role === "trainer"), [people]);
  const trainees = useMemo(() => people.filter((p) => p.role === "trainee"), [people]);

  const visible = useMemo(() => {
    const list = tab === "trainer" ? trainers : trainees;
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q)
    );
  }, [tab, trainers, trainees, query]);

  const traineeCountFor = (trainerId: string) =>
    trainees.filter((e) => e.assignedTo === trainerId).length;

  const trainerNameFor = (trainerId: string | null) =>
    trainerId ? trainers.find((t) => t.id === trainerId)?.name ?? "Unassigned" : "Unassigned";

  function openCreate() {
    setEditingId(null);
    setDraft(emptyDraft(tab));
    setDialogOpen(true);
  }

  function openEdit(person: Person) {
    setEditingId(person.id);
    setDraft({
      name: person.name,
      email: person.email,
      role: person.role,
      department: person.department,
      status: person.status,
      assignedTo: person.assignedTo,
    });
    setDialogOpen(true);
  }

  function saveDraft() {
    if (!draft.name.trim() || !draft.email.trim()) return;
    if (editingId) {
      setPeople((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...draft } : p)));
    } else {
      const id = `${draft.role === "trainer" ? "t" : "e"}${Date.now()}`;
      setPeople((prev) => [...prev, { ...draft, id, joinedOn: new Date().toISOString().slice(0, 10) }]);
    }
    setDialogOpen(false);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setPeople((prev) =>
      prev
        .filter((p) => p.id !== deleteTarget.id)
        .map((p) => (p.assignedTo === deleteTarget.id ? { ...p, assignedTo: null } : p))
    );
    setDeleteTarget(null);
  }

  function openAssign(person: Person) {
    setAssignTarget(person);
    setAssignTrainerId(person.assignedTo ?? "");
  }

  function saveAssignment() {
    if (!assignTarget) return;
    setPeople((prev) =>
      prev.map((p) => (p.id === assignTarget.id ? { ...p, assignedTo: assignTrainerId || null } : p))
    );
    setAssignTarget(null);
  }

  const activeTrainers = trainers.filter((t) => t.status === "active").length;
  const unassignedTrainees = trainees.filter((e) => !e.assignedTo).length;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard icon={UserCog} label="Trainers" value={String(trainers.length)} accent="violet" />
        <StatCard icon={Users} label="Trainees" value={String(trainees.length)} accent="emerald" />
        <StatCard icon={UserCog} label="Active trainers" value={String(activeTrainers)} accent="violet" />
        <StatCard icon={Users} label="Unassigned trainees" value={String(unassignedTrainees)} accent="amber" />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="font-display text-sm font-bold">Trainers &amp; Trainees</CardTitle>
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              <button
                onClick={() => setTab("trainer")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === "trainer" ? "bg-background shadow-sm" : "text-muted-foreground"
                }`}
              >
                Trainers
              </button>
              <button
                onClick={() => setTab("trainee")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === "trainee" ? "bg-background shadow-sm" : "text-muted-foreground"
                }`}
              >
                Trainees
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="h-8 pl-8 text-xs"
              />
            </div>
            <Button onClick={openCreate} size="sm" className="h-8 gap-1.5">
              <Plus className="size-3.5" />
              Add
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {visible.length === 0 ? (
            <div className="flex h-[160px] items-center justify-center text-xs text-muted-foreground">
              No {tab === "trainer" ? "trainers" : "trainees"} found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Name</th>
                    <th className="pb-2 pr-4 font-medium">Department</th>
                    <th className="pb-2 pr-4 font-medium">Status</th>
                    <th className="pb-2 pr-4 font-medium">
                      {tab === "trainer" ? "Trainees assigned" : "Assigned trainer"}
                    </th>
                    <th className="pb-2 pr-4 font-medium">Joined</th>
                    <th className="pb-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2.5 pr-4">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-muted-foreground">{p.email}</div>
                      </td>
                      <td className="py-2.5 pr-4">{p.department}</td>
                      <td className="py-2.5 pr-4">
                        <Badge variant="outline" className={`capitalize ${statusStyles[p.status]}`}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 pr-4">
                        {tab === "trainer" ? (
                          <span>{traineeCountFor(p.id)} trainee(s)</span>
                        ) : (
                          <span className={p.assignedTo ? "" : "text-muted-foreground"}>
                            {trainerNameFor(p.assignedTo)}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{p.joinedOn}</td>
                      <td className="py-2.5">
                        <div className="flex justify-end gap-1">
                          {tab === "trainee" && (
                            <Button variant="ghost" size="icon" className="size-7" onClick={() => openAssign(p)} title="Assign trainer">
                              <Link2 className="size-3.5" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="size-7" onClick={() => openEdit(p)} title="Edit">
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(p)}
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold">
              {editingId ? "Edit" : "Add"} {draft.role === "trainer" ? "trainer" : "trainee"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">Full name</Label>
              <Input id="name" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="e.g. Anita Sharma" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input id="email" type="email" value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} placeholder="name@capacityconnect.io" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Role</Label>
                <Select
                  value={draft.role}
                  onValueChange={(v: Role) => setDraft((d) => ({ ...d, role: v, assignedTo: v === "trainer" ? null : d.assignedTo }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trainer">Trainer</SelectItem>
                    <SelectItem value="trainee">Trainee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select value={draft.status} onValueChange={(v: Status) => setDraft((d) => ({ ...d, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Department</Label>
              <Select value={draft.department} onValueChange={(v) => setDraft((d) => ({ ...d, department: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {departments.map((dep) => (
                    <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {draft.role === "trainee" && (
              <div className="space-y-1.5">
                <Label className="text-xs">Assigned trainer (optional)</Label>
                <Select value={draft.assignedTo ?? "none"} onValueChange={(v) => setDraft((d) => ({ ...d, assignedTo: v === "none" ? null : v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {trainers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveDraft} disabled={!draft.name.trim() || !draft.email.trim()}>
              {editingId ? "Save changes" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign trainer dialog */}
      <Dialog open={!!assignTarget} onOpenChange={(open) => !open && setAssignTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold">
              Assign trainer to {assignTarget?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <Label className="text-xs">Trainer</Label>
            <Select value={assignTrainerId || "none"} onValueChange={(v) => setAssignTrainerId(v === "none" ? "" : v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {trainers.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} — {traineeCountFor(t.id)} trainee(s)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignTarget(null)}>Cancel</Button>
            <Button onClick={saveAssignment}>Save assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold flex items-center gap-2">
              <X className="size-4 text-destructive" />
              Delete {deleteTarget?.role}?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently remove <span className="font-medium text-foreground">{deleteTarget?.name}</span>.
            {deleteTarget?.role === "trainer" && " Any trainees assigned to them will become unassigned."}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main dashboard
// ---------------------------------------------------------------------------

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

      {/* Trainer / Trainee management */}
      <TrainerTraineeSection />

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
