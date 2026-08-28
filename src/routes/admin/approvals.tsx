import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Search, AlertOctagon, UserCheck, Users } from "lucide-react";
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

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: "trainer" | "trainee";
  dept: string;
  status: "pending" | "active" | "suspended";
  joined_date: string;
};

function statusBadge(status: UserProfile["status"]) {
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
  const [activeTab, setActiveTab] = useState<"trainers" | "trainees">("trainers");
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 1. Fetch profiles based on selected role tab
  const fetchProfiles = async (role: "trainer" | "trainee") => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", role)
      .order("joined_date", { ascending: false });

    if (error) {
      console.error(`Error fetching ${role}s:`, error.message);
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles(activeTab === "trainers" ? "trainer" : "trainee");
  }, [activeTab]);

  // 2. Handle Activate or Suspend status updates
  const handleUpdateStatus = async (
    userId: string,
    newStatus: "active" | "suspended"
  ) => {
    setActionLoading(userId);

    const { data, error } = await supabase
      .from("profiles")
      .update({ status: newStatus })
      .eq("id", userId)
      .select();

    if (error) {
      alert(`Failed to update status: ${error.message}`);
    } else if (!data || data.length === 0) {
      alert("Update failed: Row Level Security (RLS) prevented modifying this profile.");
    } else {
      setProfiles((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, status: newStatus } : p))
      );
    }

    setActionLoading(null);
  };

  // Filter accounts by search query
  const filteredProfiles = profiles.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.dept?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic status counters
  const pendingCount = profiles.filter((p) => p.status === "pending").length;
  const activeCount = profiles.filter((p) => p.status === "active").length;
  const suspendedCount = profiles.filter((p) => p.status === "suspended").length;

  return (
    <GlassBackground>
      {/* Main Header */}
      <div>
        <h1 className="font-display text-xl font-bold">Approvals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review pending accounts, activate profiles, or suspend user access across the platform.
        </p>
      </div>

      {/* Role Navigation Tabs */}
      <div className="mt-4 flex gap-2 border-b border-white/10 pb-3">
        <Button
          variant={activeTab === "trainers" ? "default" : "ghost"}
          size="sm"
          onClick={() => {
            setActiveTab("trainers");
            setSearchQuery("");
          }}
          className="gap-2"
        >
          <UserCheck className="size-4" />
          All Trainer Accounts
        </Button>
        <Button
          variant={activeTab === "trainees" ? "default" : "ghost"}
          size="sm"
          onClick={() => {
            setActiveTab("trainees");
            setSearchQuery("");
          }}
          className="gap-2"
        >
          <Users className="size-4" />
          All Trainee Accounts
        </Button>
      </div>

      {/* Counters */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Glass className="flex items-center gap-3 p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
            <Clock className="size-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Pending {activeTab === "trainers" ? "Trainers" : "Trainees"}
            </p>
            <p className="font-display text-lg font-bold">{pendingCount}</p>
          </div>
        </Glass>

        <Glass className="flex items-center gap-3 p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
            <CheckCircle2 className="size-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Active {activeTab === "trainers" ? "Trainers" : "Trainees"}
            </p>
            <p className="font-display text-lg font-bold">{activeCount}</p>
          </div>
        </Glass>

        <Glass className="flex items-center gap-3 p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
            <AlertOctagon className="size-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Suspended {activeTab === "trainers" ? "Trainers" : "Trainees"}
            </p>
            <p className="font-display text-lg font-bold">{suspendedCount}</p>
          </div>
        </Glass>
      </div>

      {/* Table Section */}
      <Glass className="p-5">
        <h2 className="font-display text-sm font-bold">
          {activeTab === "trainers" ? "All Trainer Accounts" : "All Trainee Accounts"}
        </h2>
        <GlassInputWrap className="relative mt-3">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab} by name, email, or department...`}
            className="border-none bg-transparent pl-8 focus-visible:ring-0"
          />
        </GlassInputWrap>

        <div className="mt-4">
          {loading ? (
            <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
              Loading {activeTab}...
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
              No {activeTab} accounts found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-transparent">
                  <TableHead>
                    {activeTab === "trainers" ? "Trainer Name" : "Trainee Name"}
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead className="text-right">Account Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-white/20 hover:bg-white/20"
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="uppercase">{user.dept || "—"}</TableCell>
                    <TableCell>{statusBadge(user.status)}</TableCell>
                    <TableCell className="space-x-2 text-right">
                      {/* Activate Account Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={
                          actionLoading === user.id || user.status === "active"
                        }
                        onClick={() => handleUpdateStatus(user.id, "active")}
                        className="text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600 disabled:opacity-40"
                      >
                        {actionLoading === user.id ? "Updating..." : "Activate"}
                      </Button>

                      {/* Suspend Account Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={
                          actionLoading === user.id || user.status === "suspended"
                        }
                        onClick={() => handleUpdateStatus(user.id, "suspended")}
                        className="text-red-500 hover:bg-red-500/10 hover:text-red-600 disabled:opacity-40"
                      >
                        {actionLoading === user.id ? "Updating..." : "Suspend"}
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
