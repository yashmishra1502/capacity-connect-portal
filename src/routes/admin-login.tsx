import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { ArrowRight, ArrowLeft, Eye, EyeOff, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandIcon } from "@/components/brand-logo";
import { login } from "@/lib/auth";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [{ title: "Admin Login — Capacity Connect" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Read the theme homepage already set — keeps this page in sync, doesn't own the state
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setIsDark(stored ? stored === "dark" : document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await login("admin", email, password);
    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }

    navigate({ to: "/admin" });
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Decorative glow orbs */}
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-primary/30 blur-[120px] dark:bg-primary/40" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 size-96 rounded-full bg-blue-500/20 blur-[120px] dark:bg-blue-500/30" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-72 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-[100px] dark:bg-cyan-400/20" />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-black/10 bg-white/40 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center">
            <BrandIcon size={96} className="object-contain" />
          </Link>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="flex size-8 items-center justify-center rounded-full border border-black/10 bg-white/40 backdrop-blur-xl hover:bg-white/60 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <img
                src={isDark ? "/night.png" : "/day.png"}
                alt={isDark ? "Dark mode" : "Light mode"}
                className="size-4 object-contain"
              />
            </button>

            <Link
              to="/"
              className="flex items-center gap-1 text-xs font-medium text-foreground/70 hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to home
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-[1] flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-5 flex items-center justify-center gap-1.5 rounded-full border border-black/10 bg-white/40 px-3 py-1 text-center backdrop-blur-xl dark:border-white/20 dark:bg-white/10">
            <ShieldCheck className="size-3.5 text-primary" />
            <span className="text-[11px] font-medium text-foreground/80">
              Restricted administrator access
            </span>
          </div>

          <Card className="border border-black/10 bg-white/40 shadow-2xl shadow-black/10 backdrop-blur-2xl dark:border-white/20 dark:bg-white/10 dark:shadow-black/40">
            <CardContent className="p-6">
              <h1 className="font-display text-lg font-semibold">Admin sign in</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in with your administrator credentials to continue.
              </p>

              <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="admin-email" className="text-xs">
                    Email address
                  </Label>
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    placeholder="name@gov-capacity.in"
                    className="mt-1.5 border-black/10 bg-white/40 backdrop-blur-xl placeholder:text-foreground/40 dark:border-white/20 dark:bg-white/10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="admin-password" className="text-xs">
                    Password
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-black/10 bg-white/40 pr-10 backdrop-blur-xl placeholder:text-foreground/40 dark:border-white/20 dark:bg-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive backdrop-blur-xl">
                    <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Signing in..." : "Sign in as Admin"}
                  {!submitting && <ArrowRight className="ml-1.5 size-4" />}
                </Button>
              </form>

              <p className="mt-5 text-center text-xs text-muted-foreground">
                Not an administrator?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Trainee / Trainer login
                </Link>
              </p>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  Register now
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-[1] border-t border-black/10 bg-white/40 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 text-[11px] text-foreground/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Capacity Connect — Capacity Building Commission, Government of India</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-foreground/80">About</Link>
            <Link to="/" className="hover:text-foreground/80">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
