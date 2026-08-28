import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, Search, AlertOctagon } from "lucide-react";
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
import { Glass, GlassBackground, GlassInputWrap } from "@/components/glass-ui";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/admin/approvals")({
  head: () => ({
    meta: [{ title: "Approvals — Administration · Capacity Connect" }],
  }),
  component: Approvals,
});

type TrainerProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  dept: string;
  status: "pending" | "active" | "suspended";
  joined_date: string;
};

function statusBadge(status: TrainerProfile["status"]) {
  switch (status) {
    case "active":
      return (
        <Badge className="gap-1 border border-emerald-400/30 bg-emerald-400/15 text-emerald-600 backdrop-blur-md hover:bg-emerald-400/15 dark:text-emerald-400">
          <CheckCircle2 className="size-3" />
          Active
        </Badge>
      );
    case "suspended":
      return (
        <Badge className="gap-1 border border-red-400/30 bg-red-400/15 text-red-600 backdrop-blur-md hover:bg-red-400/15 dark:text-red-400">
          <AlertOctagon className="size-3" />
          Suspended
        </Badge>
      );
    default:
      return (
        <Badge className="gap-1 border border-amber-400/30 bg-amber-400/15 text-amber-600 backdrop-blur-md hover:bg-amber-400/15 dark:text-amber-400">
          <Clock className="size-3" />
          Pending
        </Badge>
      );
  }
}

function Approvals() {
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 1. Fetch trainers from public.profiles
  const fetchTrainers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "trainer")
      .order("joined_date", { ascending: false });

    if (error) {
      console.error("Error fetching trainers:", error.message);
    } else {
      setTrainers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  // 2. Handle Activate or Suspend status changes
  const handleUpdateStatus = async (
    trainerId: string,
    newStatus: "active" | "suspended"
  ) => {
    setActionLoading(trainerId);

    const { error } = await supabase
      .from("profiles")
      .update({ status: newStatus })
      .eq("id", trainerId);

    if (error) {
      alert(`Failed to update trainer status: ${error.message}`);
    } else {
      setTrainers((prev) =>
        prev.map((t) => (t.id === trainerId ? { ...t, status: newStatus } : t))
      );
    }

    setActionLoading(null);
  };

  // Filtered trainers by search
  const filteredTrainers = trainers.filter(
    (t) =>
      t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.dept?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic counts
  const pendingCount = trainers.filter((t) => t.status === "pending").length;
  const activeCount = trainers.filter((t) => t.status === "active").length;
  const suspendedCount = trainers.filter((t) => t.status === "suspended").length;

  return (
    <GlassBackground>
      <div>
        <h1 className="font-display text-xl font-bold">Trainer Approvals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review pending trainers, activate accounts, or suspend user access across the platform.
        </p>
      </div>

      {/* Counters */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Glass className="flex items-center gap-3 p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
            <Clock className="size-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pending Trainers</p>
            <p className="font-display text-lg font-bold">{pendingCount}</p>
          </div>
        </Glass>

        <Glass className="flex items-center gap-3 p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
            <CheckCircle2 className="size-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Active Trainers</p>
            <p className="font-display text-lg font-bold">{activeCount}</p>
          </div>
        </Glass>

        <Glass className="flex items-center gap-3 p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
            <AlertOctagon className="size-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Suspended Trainers</p>
            <p className="font-display text-lg font-bold">{suspendedCount}</p>
          </div>
        </Glass>
      </div>

      {/* Table Section */}
      <Glass className="p-5">
        <h2 className="font-display text-sm font-bold">All Trainer Accounts</h2>
        <GlassInputWrap className="relative mt-3">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or department..."
            className="border-none bg-transparent pl-8 focus-visible:ring-0"
          />
        </GlassInputWrap>

        <div className="mt-4">
          {loading ? (
            <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
              Loading trainers...
            </div>
          ) : filteredTrainers.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
              No trainer accounts found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-transparent">
                  <TableHead>Trainer Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead className="text-right">Account Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainers.map((trainer) => (
                  <TableRow
                    key={trainer.id}
                    className="border-white/20 hover:bg-white/20"
                  >
                    <TableCell className="font-medium">{trainer.name}</TableCell>
                    <TableCell>{trainer.email}</TableCell>
                    <TableCell className="uppercase">{trainer.dept}</TableCell>
                    <TableCell>{statusBadge(trainer.status)}</TableCell>
                    <TableCell className="space-x-2 text-right">
                      {/* Activate Account Option */}
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={
                          actionLoading === trainer.id || trainer.status === "active"
                        }
                        onClick={() => handleUpdateStatus(trainer.id, "active")}
                        className="text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600 disabled:opacity-40"
                      >
                        {actionLoading === trainer.id ? "Updating..." : "Activate"}
                      </Button>

                      {/* Suspend Account Option */}
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={
                          actionLoading === trainer.id || trainer.status === "suspended"
                        }
                        onClick={() => handleUpdateStatus(trainer.id, "suspended")}
                        className="text-red-500 hover:bg-red-500/10 hover:text-red-600 disabled:opacity-40"
                      >
                        {actionLoading === trainer.id ? "Updating..." : "Suspend"}
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
