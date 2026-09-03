import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  MailOpen,
  RefreshCw,
  Search,
  Send,
  MessagesSquare,
  Inbox,
  Clock,
  Trash2,
  CheckCheck,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/admin/support")({
  head: () => ({
    meta: [{ title: "Support — Administration · Capacity Connect" }],
  }),
  component: AdminSupport,
});

type ContactMessage = {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read?: boolean | null;
};

const accent = "#818cf8";

function Glass({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "rounded-2xl border border-white/30 bg-white/40 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 " +
        className
      }
    >
      {children}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <Glass className="flex items-center gap-4 p-5">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
        <Icon className="size-5" style={{ color: accent }} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-display text-xl font-bold">{value}</p>
      </div>
    </Glass>
  );
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function AdminSupport() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasReadColumn, setHasReadColumn] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMessages(data as ContactMessage[]);
      // detect whether a `read` column actually exists on the row shape
      setHasReadColumn(data.length === 0 || "read" in data[0]);
    } else {
      setMessages([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter(
      (m) =>
        m.full_name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q),
    );
  }, [messages, query]);

  const unreadCount = messages.filter((m) => !m.read).length;
  const selected = messages.find((m) => m.id === selectedId) ?? filtered[0] ?? null;

  const markRead = async (id: string, value = true) => {
    if (!hasReadColumn) return;
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: value } : m)));
    await supabase.from("contact_messages").update({ read: value }).eq("id", id);
  };

  const deleteMessage = async (id: string) => {
    const ok = window.confirm("Delete this message? This can't be undone.");
    if (!ok) return;

    const prev = messages;
    setMessages((cur) => cur.filter((m) => m.id !== id));
    if (selectedId === id) setSelectedId(null);

    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      alert(`Failed to delete message: ${error.message}`);
      setMessages(prev);
    }
  };

  const openMessage = (m: ContactMessage) => {
    setSelectedId(m.id);
    if (!m.read) markRead(m.id, true);
  };

  return (
    <div
      className="space-y-6 rounded-3xl p-6"
      style={{
        background:
          "radial-gradient(circle at 15% 10%, rgba(129,140,248,0.25), transparent 45%), radial-gradient(circle at 85% 30%, rgba(56,189,248,0.18), transparent 40%), radial-gradient(circle at 50% 90%, rgba(217,119,255,0.15), transparent 45%)",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold">Support</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Messages submitted through the public contact form.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchMessages}
          disabled={loading}
          className="gap-2 border-white/20 bg-white/20 backdrop-blur-md hover:bg-white/30"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={Inbox}
          label="Total messages"
          value={loading ? "Loading..." : messages.length}
        />
        <StatCard
          icon={Mail}
          label="Unread"
          value={loading ? "Loading..." : hasReadColumn ? unreadCount : "—"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Message list */}
        <Glass className="p-4 lg:col-span-2">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, subject..."
              className="border-white/30 bg-white/40 pl-8 text-xs backdrop-blur-md dark:border-white/10 dark:bg-white/5"
            />
          </div>

          <div className="max-h-[520px] space-y-1.5 overflow-y-auto pr-1">
            {loading ? (
              <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
                Loading messages...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
                <MessagesSquare className="size-6 opacity-40" />
                No messages yet
              </div>
            ) : (
              filtered.map((m) => {
                const isActive = selected?.id === m.id;
                return (
                  <div
                    key={m.id}
                    className={`group relative w-full rounded-xl border px-3 py-2.5 transition-all duration-200 ${
                      isActive
                        ? "border-white/50 bg-white/60 dark:border-white/20 dark:bg-white/10"
                        : "border-white/20 bg-white/20 hover:bg-white/35 dark:border-white/5 dark:bg-white/[0.03] dark:hover:bg-white/10"
                    }`}
                  >
                    <button onClick={() => openMessage(m)} className="w-full text-left">
                      <div className="flex items-center justify-between gap-2 pr-6">
                        <span className="flex items-center gap-1.5 truncate text-[13px] font-semibold">
                          {hasReadColumn && !m.read && (
                            <span
                              className="size-1.5 shrink-0 rounded-full"
                              style={{ background: accent }}
                            />
                          )}
                          <span className="truncate">{m.full_name}</span>
                        </span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {timeAgo(m.created_at)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate pr-6 text-[12px] font-medium text-muted-foreground">
                        {m.subject}
                      </p>
                      <p className="mt-0.5 truncate pr-6 text-[11px] text-muted-foreground/70">
                        {m.message}
                      </p>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(m.id);
                      }}
                      title="Delete message"
                      className="absolute right-2 top-2.5 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </Glass>

        {/* Message detail */}
        <Glass className="p-6 lg:col-span-3">
          {!selected ? (
            <div className="flex h-[400px] flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <MailOpen className="size-7 opacity-40" />
              Select a message to view it
            </div>
          ) : (
            <div className="flex h-full flex-col">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/20 pb-4">
                <div>
                  <h2 className="font-display text-base font-bold">{selected.subject}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {selected.full_name} · {selected.email}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  {new Date(selected.created_at).toLocaleString()}
                </span>
              </div>

              <p className="mt-4 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {selected.message}
              </p>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-white/20 pt-4">
                <Button asChild size="sm" className="gap-2">
                  <a
                    href={`mailto:${selected.email}?subject=${encodeURIComponent(
                      `Re: ${selected.subject}`,
                    )}`}
                  >
                    <Send className="size-3.5" />
                    Reply by email
                  </a>
                </Button>

                {hasReadColumn && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-white/20 bg-white/20 backdrop-blur-md hover:bg-white/30"
                    onClick={() => markRead(selected.id, !selected.read)}
                  >
                    {selected.read ? (
                      <>
                        <CircleDot className="size-3.5" />
                        Mark as unread
                      </>
                    ) : (
                      <>
                        <CheckCheck className="size-3.5" />
                        Mark as read
                      </>
                    )}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-white/20 bg-white/20 text-destructive backdrop-blur-md hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => deleteMessage(selected.id)}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </Glass>
      </div>
    </div>
  );
}
