import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Plus, Pin, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Glass, GlassBackground, accent } from "@/components/glass-ui";
import { supabase } from "@/lib/supabaseClient"; // Adjust this import to match your project setup

export const Route = createFileRoute("/admin/announcements")({
  head: () => ({
    meta: [{ title: "Announcements — Administration · Capacity Connect" }],
  }),
  component: Announcements,
});

type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: "both" | "trainee" | "trainer";
  date: string;
  pinned?: boolean;
  status?: string;
  sender_role?: string;
};

function audienceBadge(audience: Announcement["audience"]) {
  const labelMap: Record<string, string> = {
    both: "Everyone",
    trainee: "Trainees",
    trainer: "Trainers",
  };
  return (
    <Badge className="border border-white/30 bg-white/30 text-foreground backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08]">
      {labelMap[audience] || audience}
    </Badge>
  );
}

function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    audience: "both" as "both" | "trainee" | "trainer",
  });

  // 1. Fetch announcements on page load
  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching announcements:", error.message);
    } else {
      setAnnouncements(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // 2. Handle publishing announcement & generating notifications
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Step A: Insert into announcements table
      const { data: announcement, error: announcementError } = await supabase
        .from("announcements")
        .insert([
          {
            title: formData.title,
            body: formData.body,
            audience: formData.audience,
            sender_role: "admin",
            date: new Date().toISOString().split("T")[0],
            status: "Active",
          },
        ])
        .select()
        .single();

      if (announcementError) throw announcementError;

      // Step B: Fetch targeted users from profiles
      let userQuery = supabase.from("profiles").select("id, role");

      if (formData.audience === "trainee") {
        userQuery = userQuery.eq("role", "trainee");
      } else if (formData.audience === "trainer") {
        userQuery = userQuery.eq("role", "trainer");
      } else if (formData.audience === "both") {
        userQuery = userQuery.in("role", ["trainee", "trainer"]);
      }

      const { data: targetUsers, error: userError } = await userQuery;

      if (userError) throw userError;

      // Step C: Bulk insert into notifications table
      if (targetUsers && targetUsers.length > 0) {
        const notificationsToInsert = targetUsers.map((user) => ({
          user_id: user.id,
          title: formData.title,
          body: formData.body,
          sender_role: "admin",
          time: new Date().toISOString(),
          unread: true,
        }));

        const { error: notificationError } = await supabase
          .from("notifications")
          .insert(notificationsToInsert);

        if (notificationError) throw notificationError;
      }

      // Reset Form & Refresh Announcements list
      setIsModalOpen(false);
      setFormData({ title: "", body: "", audience: "both" });
      await fetchAnnouncements();
    } catch (error: any) {
      console.error("Error broadcasting announcement:", error.message);
      alert(`Failed to broadcast: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

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
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 border border-white/40 bg-white/50 text-foreground backdrop-blur-md hover:bg-white/70 dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <Plus className="size-4" style={{ color: accent }} />
          New Announcement
        </Button>
      </div>

      <Glass className="p-5 mt-6">
        <h2 className="font-display text-sm font-bold">All announcements</h2>
        <div className="mt-4">
          {loading ? (
            <div className="flex h-[200px] items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-center">
              <Megaphone className="size-8 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground">
                No announcements posted yet
              </p>
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
                        {a.pinned && (
                          <Pin className="size-3.5 text-amber-500" />
                        )}
                        <h3 className="text-sm font-semibold">{a.title}</h3>
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {a.body}
                      </p>
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
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                      >
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

      {/* New Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/20 bg-slate-900/90 p-6 text-white shadow-2xl backdrop-blur-xl">
            <h2 className="text-lg font-bold mb-4">Create Announcement</h2>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Announcement Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Message Body
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write the announcement description..."
                  value={formData.body}
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Target Audience
                </label>
                <select
                  value={formData.audience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      audience: e.target.value as "both" | "trainee" | "trainer",
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="both">Both (Trainees & Trainers)</option>
                  <option value="trainee">Trainees Only</option>
                  <option value="trainer">Trainers Only</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin mr-2" />
                  ) : null}
                  {submitting ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </GlassBackground>
  );
}
