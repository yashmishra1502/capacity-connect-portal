import { Link, useLocation } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { navConfig, roleLabel } from "@/lib/nav-config";
import type { Role } from "@/lib/mock-data";
import { accent } from "@/components/glass-ui";

function groupItems(items: { label: string; to: string; group: string }[]) {
  const groups: { group: string; items: typeof items }[] = [];
  for (const item of items) {
    const existing = groups.find((g) => g.group === item.group);
    if (existing) existing.items.push(item);
    else groups.push({ group: item.group, items: [item] });
  }
  return groups;
}

export function Sidebar({ role }: { role: Role }) {
  const location = useLocation();
  const groups = groupItems(navConfig[role]);

  return (
    <aside
      className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-white/20 bg-white/30 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
      style={{
        // ambient tint so the glass has something to catch behind fixed content too
        backgroundImage:
          "radial-gradient(circle at 20% 0%, rgba(129,140,248,0.18), transparent 55%)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/40 px-3 py-3 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          C
        </div>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold">Capacity Connect</p>
          <p className="text-[11px] text-muted-foreground">{roleLabel[role]}</p>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="mt-6 flex-1 space-y-5 overflow-y-auto pr-1">
        {groups.map((g) => (
          <div key={g.group}>
            <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {g.group}
            </p>
            <div className="mt-1.5 space-y-1">
              {g.items.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={
                      "block rounded-lg border px-3 py-2 text-sm backdrop-blur-md transition " +
                      (active
                        ? "border-white/40 bg-white/60 font-medium shadow-sm dark:border-white/20 dark:bg-white/15"
                        : "border-transparent text-muted-foreground hover:border-white/30 hover:bg-white/30 hover:text-foreground dark:hover:border-white/10 dark:hover:bg-white/10")
                    }
                    style={active ? { color: accent } : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / sign out */}
      <button
        type="button"
        className="mt-4 flex items-center gap-2 rounded-lg border border-white/30 bg-white/30 px-3 py-2 text-sm text-muted-foreground backdrop-blur-md transition hover:bg-white/50 hover:text-foreground dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      >
        <LogOut className="size-4" />
        Sign out
      </button>
    </aside>
  );
}
