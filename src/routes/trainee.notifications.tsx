import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, CheckCheck, ChevronDown, Loader2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/trainee/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications · Capacity Connect" },
      {
        name: "description",
        content: "View and manage your account notifications.",
      },
    ],
  }),
  component: NotificationsPage,
});

/* ---------------- types ---------------- */

type Notification = {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  type?: string | null;
};

/* ---------------- helpers ---------------- */

function formatDate(value: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ---------------- page component ---------------- */

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);

      // 1. Get current logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setError(userError.message);
        setLoading(false);
        return;
      }

      // 2. Fetch notifications for current user (or global ones where user_id is null)
      let query = supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (user) {
        query = query.or(`user_id.eq.${user.id},user_id.is.null`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setNotifications(data ?? []);
      }

      setLoading(false);
    };

    fetchNotifications();

    // 3. Set up Realtime listener for incoming notifications
    const channel = supabase
      .channel("public:notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Action: Mark single notification as read permanently in database
  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    if (error) {
      console.error("Failed to update notification read status:", error.message);
    }
  };

  // Action: Mark all notifications as read permanently in database
  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length > 0) {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .in("id", unreadIds);

      if (error) {
        console.error("Failed to update all notifications:", error.message);
      }
    }
  };

  // Action: Delete notification permanently from database
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete notification:", error.message);
    }
  };

  const toggleExpand = (id: string, isUnread: boolean) => {
    setExpanded(expanded === id ? null : id);
    if (isUnread) {
      handleMarkAsRead(id);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
              Updates
            </Badge>
            {unreadCount > 0 && (
              <Badge className="rounded-full bg-primary text-primary-foreground">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your courses, assessments, and platform updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            variant="outline"
            size="sm"
            className="w-fit gap-2 rounded-full border-border/70"
          >
            <CheckCheck className="size-4" /> Mark all as read
          </Button>
        )}
      </header>

      {/* Loading & Error States */}
      {loading ? (
        <div className="flex h-[200px] items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading notifications...
        </div>
      ) : error ? (
        <p className="rounded-xl border border-dashed border-destructive/50 p-10 text-center text-sm text-destructive">
          {error}
        </p>
      ) : (
        <div className="space-y-3">
          {notifications.map((item, index) => {
            const isOpen = expanded === item.id;

            return (
              <Card
                key={item.id}
                className={cn(
                  "cc-glow-card overflow-hidden border-border/70 bg-card/70 backdrop-blur transition-all duration-300",
                  !item.read && "border-primary/40 bg-primary/5"
                )}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleExpand(item.id, !item.read)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      toggleExpand(item.id, !item.read);
                    }
                  }}
                  className="flex cursor-pointer items-start justify-between gap-4 p-5 text-left"
                >
                  <div className="flex gap-4 min-w-0 flex-1">
                    <div
                      className={cn(
                        "mt-1 flex size-9 shrink-0 items-center justify-center rounded-xl",
                        item.read
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      <Bell className="size-4" />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-sm font-semibold leading-snug truncate">
                          {item.title}
                        </h2>
                        {!item.read && (
                          <span className="size-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-sm text-muted-foreground transition-all",
                          !isOpen && "line-clamp-2"
                        )}
                      >
                        {item.message}
                      </p>
                      <p className="text-[11px] text-muted-foreground/80 pt-1">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!item.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(item.id);
                        }}
                        title="Mark as read"
                      >
                        <CheckCheck className="size-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => handleDelete(e, item.id)}
