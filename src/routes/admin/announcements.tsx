import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Plus, Pin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Glass, GlassBackground, accent } from "@/components/glass-ui";

export const Route = createFileRoute("/admin/announcements")({
  head: () => ({
    meta: [{ title: "Announcements — Administration · Capacity Connect" }],
  }),
  component: Announcements,
});

// TODO: replace with real API data (useQuery)
type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: "all" | "trainees" | "trainers" | "admins";
  date: string;
  pinned: boolean;
};

const announcements: Announcement[] = [];

function audienceBadge(audience: Announcement["audience"]) {
  const labelMap: Record<Announcement["audience"], string> = {
    all: "Everyone",
    trainees: "Trainees",
    trainers: "Trainers",
    admins: "Admins",
  };
  return (
    <Badge className="border border-white/30 bg-white/30 text-foreground backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08]">
      {labelMap[audience]}
    </Badge>
  );
}

function Announcements() {
  return (
    <GlassBackground>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Announcements</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Broadcast updates and notices across the platform.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 border border-white/40 bg-white/50 text-foreground backdrop-blur-md hover:bg-white/70 dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <Plus className="size-4" style={{ color: accent }} />
          New Announcement
        </Button>
      </div>

      <Glass className="p-5">
        <h2 className="font-display text-sm font-bold">All announcements</h2>
        <div className="mt-4">
          {announcements.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-center">
              <Megaphone className="size-8 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground">No announcements posted yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="rounded-xl border border-white/30 bg-white/30 p-4 backdrop-blur-md transition-colors hover:bg-white/40 dark:border-white/15 dark:bg-white/[0.06] dark:hover:bg-white/[0.1]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {a.pinned && <Pin className="size-3.5 text-amber-500" />}
                        <h3 className="text-sm font-semibold">{a.title}</h3>
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{a.body}</p>
                    </div>
                    {audienceBadge(a.audience)}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar className="size-3" />
                      {a.date}
                    </div>
                    <div className="space-x-1">
                      <Button size="sm" variant="ghost">
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Glass>
    </GlassBackground>
  );
}
