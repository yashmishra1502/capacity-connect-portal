import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandIcon } from "@/components/brand-logo";
import { register } from "@/lib/auth";
import type { Role } from "@/lib/mock-data";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [{ title: "Register — Capacity Connect" }],
  }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("trainee");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dept, setDept] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    const result = await register({ role, name, email, password, dept });

    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
    setTimeout(() => {
      navigate({ to: role === "admin" ? "/admin-login" : "/login" });
    }, 1800);
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <CheckCircle2 className="size-10 text-emerald-500" />
            <h1 className="font-display text-lg font-semibold">Registration successful</h1>
            <p className="text-sm text-muted-foreground">
              Redirecting you to the {role} login page…
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandIcon size={36} className="rounded-md bg-primary p-1.5 shadow-sm shadow-primary/30" />
            <div className="text-left">
              <p className="font-display text-sm font-bold tracking-tight">Capacity Connect</p>
              <p className="text-[11px] text-muted-foreground">Capacity Building Commission</p>
            </div>
          </Link>
        </div>

        <Card>
          <CardContent className="p-6">
            <h1 className="font-display text-lg font-semibold">Create an account</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Register as a trainee, trainer or administrator.
            </p>

            <Tabs
              value={role}
              onValueChange={(v) => {
                setRole(v as Role);
                setError(null);
              }}
              className="mt-5"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="trainee">Trainee</TabsTrigger>
                <TabsTrigger value="trainer">Trainer</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name" className="text-xs">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  className="mt-1.5"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="dept" className="text-xs">Department</Label>
                <Input
                  id="dept"
                  type="text"
                  placeholder="e.g. Rural Development"
                  className="mt-1.5"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="reg-email" className="text-xs">Email address</Label>
                <Input
                  id="reg-email"
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
                <Label htmlFor="reg-password" className="text-xs">Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirm-password" className="text-xs">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  className="mt-1.5"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                Create {role} account
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </form>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
