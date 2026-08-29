import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import "../auth-glass.css";
import { BrandIcon } from "@/components/brand-logo";
import { demoCredentials, login } from "@/lib/auth";
import type { Role } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Trainee / Trainer Login — Capacity Connect" }],
  }),
  component: TraineeTrainerLogin,
});

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-primary/70 focus-within:bg-primary/10">
    {children}
  </div>
);

type Highlight = { stat: string; label: string; note: string };

const highlights: Highlight[] = [
  { stat: "4,800+", label: "Active learners", note: "Trainees onboarded across departments" },
  { stat: "86", label: "Live courses", note: "Updated continuously by verified trainers" },
  { stat: "99.9%", label: "Platform uptime", note: "Government-grade reliability & access control" },
];

function TraineeTrainerLogin() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Extract<Role, "trainee" | "trainer">>("trainee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const demo = demoCredentials(role);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await login(role, email, password);
    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }

    navigate({ to: `/${role}` });
  }

  return (
    <div className="h-[100dvh] w-[100dvw] flex flex-col md:flex-row bg-background text-foreground overflow-hidden">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <Link
              to="/"
              className="animate-element flex items-center gap-2.5 -mb-1"
            >
              <BrandIcon size={34} className="rounded-md" />
              <div>
                <p className="text-sm font-bold leading-tight">Capacity Connect</p>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Capacity Building Commission
                </p>
              </div>
            </Link>

            <div>
              <h1 className="animate-element animate-delay-100 text-3xl md:text-4xl font-semibold leading-tight tracking-tight">
                Welcome back
              </h1>
              <p className="animate-element animate-delay-200 mt-2 text-muted-foreground text-sm">
                Choose your role and sign in with your registered credentials.
              </p>
            </div>

            {/* role switch */}
            <div
              role="tablist"
              data-active={role}
              className="animate-element animate-delay-300 relative grid grid-cols-2 gap-1 rounded-2xl border border-border bg-foreground/5 p-1"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl bg-primary transition-transform duration-300 ease-out",
                  role === "trainer" && "translate-x-[calc(100%+4px)]",
                )}
              />
              <button
                type="button"
                onClick={() => {
                  setRole("trainee");
                  setError(null);
                }}
                className={cn(
                  "relative z-10 rounded-xl py-2.5 text-sm font-medium transition-colors",
                  role === "trainee" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Trainee
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("trainer");
                  setError(null);
                }}
                className={cn(
                  "relative z-10 rounded-xl py-2.5 text-sm font-medium transition-colors",
                  role === "trainer" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Trainer
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-muted-foreground">Email address</label>
                <GlassInputWrapper>
                  <input
                    name="email"
                    type="email"
                    autoComplete="username"
                    placeholder="name@gov-capacity.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                  />
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-500">
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute inset-y-0 right-3 flex items-center"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              {error && (
                <div className="animate-element flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive">
                  <ShieldAlert size={15} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="animate-element animate-delay-600 flex items-center justify-between text-sm">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="custom-checkbox"
                  />
                  <span className="text-foreground/90">Keep me signed in</span>
                </label>
                <Link to="/register" className="hover:underline text-primary transition-colors">
                  Need help?
                </Link>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="animate-element animate-delay-700 w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    Sign in as {role === "trainee" ? "Trainee" : "Trainer"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="animate-element animate-delay-800 rounded-2xl border border-border bg-foreground/5 px-4 py-3 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5 font-semibold text-foreground/90 mb-1">
                <ShieldCheck size={13} />
                Demo credentials ({role})
              </p>
              Email: {demo.email}
              <br />
              Password: {demo.password}
            </div>

            <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
              Signing in as an administrator?{" "}
              <Link to="/admin-login" className="text-primary hover:underline transition-colors">
                Admin login
              </Link>
            </p>
            <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline transition-colors">
                Register now
              </Link>
            </p>
            <p className="animate-element animate-delay-1000 text-center text-xs text-muted-foreground/70">
              <Link to="/" className="hover:text-foreground transition-colors">
                ← Back to home
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: ambient hero + highlight cards (no external image dependency) */}
      <section className="hidden md:block flex-1 relative p-4">
        <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl overflow-hidden bg-navy">
          <div
            className="auth-aurora"
            style={{
              width: 480,
              height: 480,
              left: "-10%",
              top: "-12%",
              background: "radial-gradient(circle, rgba(95,168,255,0.35), transparent 70%)",
            }}
          />
          <div
            className="auth-aurora"
            style={{
              width: 400,
              height: 400,
              right: "-12%",
              bottom: "-14%",
              background: "radial-gradient(circle, rgba(30,111,255,0.3), transparent 70%)",
              animationDelay: "-9s",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage: "radial-gradient(circle at 30% 30%, black, transparent 72%)",
              WebkitMaskImage: "radial-gradient(circle at 30% 30%, black, transparent 72%)",
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-center px-14 text-white">
            <p className="animate-element animate-delay-400 font-mono text-[11px] uppercase tracking-[0.14em] text-white/60 mb-6">
              Capacity Building Commission
            </p>
            <h2 className="animate-element animate-delay-500 text-4xl font-semibold leading-[1.08] tracking-tight max-w-md">
              Access built for people who deliver, not just paperwork.
            </h2>
            <p className="animate-element animate-delay-600 mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              One secure sign-in for every trainee and trainer across departments — course
              progress, assessments, and certification, all in one place.
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
          {highlights.map((h, i) => (
            <div
              key={h.label}
              className={cn(
                "animate-testimonial flex flex-col gap-1 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-56",
                i === 1 && "hidden xl:flex",
                i === 2 && "hidden 2xl:flex",
              )}
              style={{ animationDelay: `${1 + i * 0.2}s` }}
            >
              <span className="font-mono text-2xl font-bold text-white">{h.stat}</span>
              <span className="text-sm font-medium text-white/90">{h.label}</span>
              <span className="text-xs text-white/50 leading-snug">{h.note}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
