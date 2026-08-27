import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, ArrowLeft, Eye, EyeOff, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandIcon } from "@/components/brand-logo";
import { demoCredentials, login } from "@/lib/auth";

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

  const demo = demoCredentials("admin");

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
    <div className="flex min-h-screen flex-col bg-navy">
      {/* Header */}
      <header className="border-b border-navy-foreground/10 px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandIcon size={32} className="rounded-md bg-primary p-1.5 shadow-sm shadow-primary/30" />
            <div className="text-left leading-tight">
              <p className="font-display text-sm font-bold tracking-tight text-navy-foreground">
                Capacity Connect
              </p>
              <p className="text-[11px] text-navy-foreground/60">Capacity Building Commission</p>
            </div>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1 text-xs font-medium text-navy-foreground/70 hover:text-navy-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-5 flex items-center justify-center gap-1.5 rounded-full border border-navy-foreground/15 bg-navy-foreground/5 px-3 py-1 text-center">
            <ShieldCheck className="size-3.5 text-primary" />
            <span className="text-[11px] font-medium text-navy-foreground/70">
              Restricted administrator access
            </span>
          </div>

          <Card className="shadow-lg shadow-black/20">
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
                    className="mt-1.5"
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
                      className="pr-10"
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
                  <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Signing in..." : "Sign in as Admin"}
                  {!submitting && <ArrowRight className="ml-1.5 size-4" />}
                </Button>
              </form>

              <div className="mt-5 rounded-md border bg-muted/50 px-3 py-2.5 text-[11px] text-muted-foreground">
                <p className="font-medium text-foreground">Demo credentials</p>
                <p className="mt-0.5">Email: {demo.email}</p>
                <p>Password: {demo.password}</p>
              </div>

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
      <footer className="border-t border-navy-foreground/10 px-4 py-4">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 text-[11px] text-navy-foreground/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Capacity Connect — Capacity Building Commission, Government of India</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-navy-foreground/80">About</Link>
            <Link to="/" className="hover:text-navy-foreground/80">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
