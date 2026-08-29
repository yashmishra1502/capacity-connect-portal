import "@/styles/dashboard-glass.css";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  BookOpen,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  User,
  Users,
  ShieldCheck,
  BarChart3,
  X,
} from "lucide-react";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrandIcon } from "@/components/brand-logo";
import { navConfig, roleLabel } from "@/components/nav-config";
import { notifications, type Role } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

type Primary = { label: string; to: string; icon: typeof BookOpen };

const primaryNav: Record<Role, Primary[]> = {
  trainee: [
    { label: "Overview", to: "/", icon: Sparkles },
    { label: "Dashboard", to: "/trainee", icon: LayoutDashboard },
    { label: "Courses", to: "/trainee/courses", icon: BookOpen },
    { label: "Assessments", to: "/trainee/assessment", icon: FileCheck2 },
    { label: "Profile", to: "/trainee/profile", icon: User },
  ],
  trainer: [
    { label: "Overview", to: "/", icon: Sparkles },
    { label: "Dashboard", to: "/trainer", icon: LayoutDashboard },
    { label: "Courses", to: "/trainer/courses", icon: BookOpen },
    { label: "Questions", to: "/trainer/questions", icon: FileCheck2 },
    { label: "Profile", to: "/trainer/profile", icon: User },
  ],
  admin: [
    { label: "Overview", to: "/", icon: Sparkles },
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { label: "Trainees", to: "/admin/trainees", icon: Users },
    { label: "Approvals", to: "/admin/approvals", icon: ShieldCheck },
    { label: "Reports", to: "/admin/reports", icon: BarChart3 },
  ],
};

export function AppShell({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  // Bind dynamic authentication state instead of static mock data
  const { profile, session } = useAuth();

  const items = navConfig[role];
  const groups = [...new Set(items.map((item) => item.group))];
  const unread = notifications.filter((notification) => notification.unread).length;

  async function handleSignOut() {
    await logout();
    await navigate({ to: "/" });
  }

  const active = (to: string) =>
    to === "/" ? pathname === "/" : pathname === to || pathname === `${to}/`;

  // Fallback ladder for display values during initial auth loads
  const displayName = profile?.name || session?.user?.email?.split("@")[0] || "User";
  const displayEmail = profile?.email || session?.user?.email || "";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* ambient aurora field */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="cc-aurora size-[38rem] -left-40 -top-52 bg-primary/25" />
        <div className="cc-aurora cc-aurora-2 size-[32rem] right-[-10rem] top-32 bg-info/20" />
        <div className="cc-aurora cc-aurora-3 size-[34rem] bottom-[-12rem] left-1/3 bg-chart-5/15" />
      </div>

      <header className="sticky top-0 z-40 px-3 pt-3 md:px-6 md:pt-5">
        <div className="mx-auto flex max-w-[1400px] items-center gap-1.5 rounded-2xl border border-border/70 bg-card/70 p-2 shadow-card backdrop-blur-xl md:gap-2 md:px-3">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-background/70 px-2.5 py-1.5 transition-transform hover:-translate-y-0.5"
            aria-label="Capacity Connect home"
          >
            <BrandIcon size={30} className="rounded-md" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {primaryNav[role].map((item) => {
              const Icon = item.icon;
              const on = active(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
                    on
                      ? "bg-primary text-primary-foreground shadow-[0_10px_30px_-12px_var(--primary)]"
                      : "text-muted-foreground hover:-translate-y-0.5 hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                  {on && (
                    <span className="absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="hidden h-10 gap-2 rounded-full border-border/70 bg-background/60 px-3 backdrop-blur sm:flex"
              >
                <User className="size-4 text-primary" />
                <span className="text-sm font-semibold">{displayName.split(" ")[0]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                {displayEmail} · {roleLabel[role]}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/${role}`}>Dashboard</Link>
              </DropdownMenuItem>
              {role === "trainee" && (
                <DropdownMenuItem asChild>
                  <Link to="/trainee/profile">Profile</Link>
                </DropdownMenuItem>
              )}
              {role === "admin" && (
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings">Settings</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => void handleSignOut()}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <LogOut className="size-3.5" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full transition-transform hover:-translate-y-0.5"
                aria-label="Notifications"
              >
                <Bell className="size-5" />
                {unread > 0 && (
                  <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                    {unread}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.slice(0, 4).map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex-col items-start gap-0.5 py-2">
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-xs font-semibold">{notification.title}</span>
                    {notification.unread && (
                      <Badge variant="secondary" className="text-[9px]">
                        New
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{notification.body}</span>
                  <span className="text-[10px] text-muted-foreground/70">{notification.time}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="rounded-full border border-border/70 bg-background/60">
            <ThemeToggle />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setOpen(true)}
            aria-label="Open all sections"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </header>

      {/* full navigation drawer */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 right-0 flex w-[19rem] max-w-[88vw] flex-col border-l border-border bg-card/95 backdrop-blur-xl animate-[cc-hero-in_0.35s_ease-out]">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <BrandIcon size={30} className="rounded-md" />
                <div>
                  <p className="font-display cc-heading text-sm">CAPACITY CONNECT</p>
                  <p className="text-[11px] text-muted-foreground">{roleLabel[role]}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {groups.map((group) => (
                <div key={group} className="mb-4">
                  <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                    {group}
                  </p>
                  <div className="space-y-0.5">
                    {items
                      .filter((item) => item.group === group)
                      .map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "block rounded-lg px-3 py-2 text-[13px] transition-all duration-200",
                            active(item.to)
                              ? "bg-primary font-semibold text-primary-foreground"
                              : "text-muted-foreground hover:translate-x-1 hover:bg-accent hover:text-foreground",
                          )}
                        >
                          {item.label}
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-4 text-[11px] text-muted-foreground">
              Government of India · Capacity Building Commission
            </div>
          </aside>
        </div>
      )}

      <main
        key={pathname}
        className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-6 md:py-8 cc-page-in"
      >
        <Outlet />
      </main>
    </div>
  );
}
