import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Section } from "@/components/kit";
import { notifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/trainee/notifications")({
  component: Notifications,
});

function Notifications() {
  const [items, setItems] = useState(notifications);
  const [tab, setTab] = useState("all");
  const list = items.filter((n) => (tab === "all" ? true : tab === "unread" ? n.unread : !n.unread));

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Alerts about assessments, resources and certificates"
        actions={
          <Button
            variant="outline"
            onClick={() => setItems((i) => i.map((n) => ({ ...n, unread: false })))}
          >
            <CheckCheck className="mr-1.5 size-4" /> Mark all as read
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={setTab} className="mb-5">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
      </Tabs>

      <Section title="Inbox" description={`${list.length} notifications`}>
        <ul className="space-y-2">
          {list.map((n) => (
            <li
              key={n.id}
              className={cn(
                "flex items-start gap-3 rounded-md border p-4",
                n.unread && "border-primary/30 bg-accent/40",
              )}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <Bell className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <Badge variant="secondary" className="text-[10px]">
                    {n.type}
                  </Badge>
                  {n.unread && <Badge className="text-[10px]">New</Badge>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-xs text-muted-foreground/70">{n.time}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  setItems((prev) =>
                    prev.map((x) => (x.id === n.id ? { ...x, unread: !x.unread } : x)),
                  )
                }
              >
                {n.unread ? "Mark read" : "Unread"}
              </Button>
            </li>
          ))}
          {list.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">Nothing here.</p>
          )}
        </ul>
      </Section>
    </>
  );
}
