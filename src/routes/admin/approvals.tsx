import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, XCircle, Clock, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Badge className="gap-1 bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/15">
          <CheckCircle2 className="size-3" />
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="gap-1 bg-red-500/15 text-red-500 hover:bg-red-500/15">
          <XCircle className="size-3" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge className="gap-1 bg-amber-500/15 text-amber-500 hover:bg-amber-500/15">
          <Clock className="size-3" />
          Pending
        </Badge>
      );
  }
}

function Approvals() {
  const pendingCount = approvalRequests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold">Approvals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and action pending requests across the platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="rounded-lg bg-amber-500/15 p-2">
              <Clock className="size-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-lg font-bold">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="rounded-lg bg-emerald-500/15 p-2">
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Approved</p>
              <p className="text-lg font-bold">
                {approvalRequests.filter((r) => r.status === "approved").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="rounded-lg bg-red-500/15 p-2">
              <XCircle className="size-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rejected</p>
              <p className="text-lg font-bold">
                {approvalRequests.filter((r) => r.status === "rejected").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-sm font-bold">All requests</CardTitle>
          <div className="relative pt-2">
            <Search className="absolute left-2.5 top-4.5 size-4 text-muted-foreground" />
            <Input placeholder="Search requests..." className="pl-8" />
          </div>
        </CardHeader>
        <CardContent>
          {approvalRequests.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
              No approval requests yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
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
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.title}</TableCell>
                    <TableCell className="capitalize">{r.type}</TableCell>
                    <TableCell>{r.requestedBy}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{statusBadge(r.status)}</TableCell>
                    <TableCell className="text-right space-x-1">
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
        </CardContent>
      </Card>
    </div>
  );
}
