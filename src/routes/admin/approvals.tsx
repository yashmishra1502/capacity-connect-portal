import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, XCircle, Clock, Search } from "lucide-react";
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

export const Route = createFileRoute("/admin/approvals")({
  head: () => ({
    meta: [{ title: "Approvals — Administration · Capacity Connect" }],
  }),
  component: Approvals,
});

// TODO: replace with real API data (useQuery)
type ApprovalRequest = {
  id: string;
  title: string;
  type: "course" | "content" | "registration" | "leave";
  requestedBy: string;
  date: string;
  status: "pending" | "approved" | "rejected";
};

const approvalRequests: ApprovalRequest[] = [];

function statusBadge(status: ApprovalRequest["status"]) {
  switch (status) {
    case "approved":
      return (
        <Badge className="gap-1 border border-emerald-400/30 bg-emerald-400/15 text-emerald-600 backdrop-blur-md hover:bg-emerald-400/15 dark:text-emerald-400">
          <CheckCircle2 className="size-3" />
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="gap-1 border border-red-400/30 bg-red-400/15 text-red-600 backdrop-blur-md hover:bg-red-400/15 dark:text-red-400">
          <XCircle className="size-3" />
          Rejected
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
  const pendingCount = approvalRequests.filter((r) => r.status === "pending").length;
  const approvedCount = approvalRequests.filter((r) => r.status === "approved").length;
  const rejectedCount = approvalRequests.filter((r) => r.status === "rejected").length;

  return (
    <GlassBackground>
      <div>
        <h1 className="font-display text-xl font-bold">Approvals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and action pending requests across the platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Glass className="flex items-center gap-3 p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
            <Clock className="size-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="font-display text-lg font-bold">{pendingCount}</p>
          </div>
        </Glass>
        <Glass className="flex items-center gap-3 p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
            <CheckCircle2 className="size-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Approved</p>
            <p className="font-display text-lg font-bold">{approvedCount}</p>
          </div>
        </Glass>
        <Glass className="flex items-center gap-3 p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
            <XCircle className="size-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rejected</p>
            <p className="font-display text-lg font-bold">{rejectedCount}</p>
          </div>
        </Glass>
      </div>

      <Glass className="p-5">
        <h2 className="font-display text-sm font-bold">All requests</h2>
        <GlassInputWrap className="relative mt-3">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            className="border-none bg-transparent pl-8 focus-visible:ring-0"
          />
        </GlassInputWrap>

        <div className="mt-4">
          {approvalRequests.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
              No approval requests yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-transparent">
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvalRequests.map((r) => (
                  <TableRow key={r.id} className="border-white/20 hover:bg-white/20">
                    <TableCell className="font-medium">{r.title}</TableCell>
                    <TableCell className="capitalize">{r.type}</TableCell>
                    <TableCell>{r.requestedBy}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{statusBadge(r.status)}</TableCell>
                    <TableCell className="space-x-1 text-right">
                      {r.status === "pending" ? (
                        <>
                          <Button size="sm" variant="ghost" className="text-emerald-500 hover:text-emerald-600">
                            Approve
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      )}
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
