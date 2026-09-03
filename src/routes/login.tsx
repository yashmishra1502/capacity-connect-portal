import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type FormEvent, type MouseEvent } from "react";
import { ArrowRight, Eye, EyeOff, ShieldAlert, Loader2, Mail, Lock } from "lucide-react";
import "../landing.css";
import { BrandIcon } from "@/components/brand-logo";
import { login } from "@/lib/auth";
import type { Role } from "@/lib/mock-data";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Trainee / Trainer Login — Capacity Connect" }],
  }),
  component: TraineeTrainerLogin,
});

function TraineeTrainerLogin() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Extract<Role, "trainee" | "trainer">>("trainee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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

  // subtle 3D tilt tracking the pointer — capped so it stays understated, not gimmicky
  function handleTilt(e: MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--rx", `${px * 6}deg`);
    card.style.setProperty("--ry", `${-py * 6}deg`);
  }
  function resetTilt() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  }

  return (
    <div className="ccl">
      <div className="auth-wrap">
        <div
          className="auth-orb"
          style={{
            width: 420,
            height: 420,
            left: "-10%",
            top: "-12%",
            background: "radial-gradient(circle, rgba(30,111,255,0.35), transparent 70%)",
          }}
        />
        <div
          className="auth-orb"
          style={{
            width: 380,
            height: 380,
            right: "-8%",
            bottom: "-10%",
            background: "radial-gradient(circle, rgba(95,168,255,0.3), transparent 70%)",
            animationDelay: "-6s",
          }}
        />

        <div className="auth-brand cc-hero-in">
          <Link to="/" className="brand" style={{ flexDirection: "column", gap: 8 }}>
            <BrandIcon size={40} className="rounded-md" />
            <div>
              <p className="name">Capacity Connect</p>
              <p className="sub">Capacity Building Commission</p>
            </div>
          </Link>
        </div>

        <div
          ref={cardRef}
          className="auth-card cc-hero-in cc-delay-1"
          onMouseMove={handleTilt}
          onMouseLeave={resetTilt}
        >
          <div className="auth-shield">
            <span className="dot" />
            Verified access
          </div>

          <h1>Trainee / Trainer sign in</h1>
          <p className="auth-sub">Choose your role and sign in with your registered credentials.</p>

          <div className="role-switch" role="tablist" data-active={role}>
            <span className="role-thumb" aria-hidden="true" />
            <button
              type="button"
              className={role === "trainee" ? "active" : ""}
              onClick={() => {
                setRole("trainee");
                setError(null);
              }}
            >
              Trainee
            </button>
            <button
              type="button"
              className={role === "trainer" ? "active" : ""}
              onClick={() => {
                setRole("trainer");
                setError(null);
              }}
            >
              Trainer
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <div className="field-wrap">
                <span className="field-icon">
                  <Mail size={15} />
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="name@gov-capacity.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="has-icon"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="field-wrap">
                <span className="field-icon">
                  <Lock size={15} />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="has-icon"
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  className="field-eye"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert-error">
                <ShieldAlert size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center", marginTop: 20 }}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 size={16} className="spin" />
              ) : (
                <>
                  Sign in as {role === "trainee" ? "Trainee" : "Trainer"} <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="auth-foot">
            Signing in as an administrator?{" "}
            <Link to="/admin-login" style={{ color: "var(--blue)", fontWeight: 600 }}>
              Admin login
            </Link>
          </p>
          <p className="auth-foot" style={{ marginTop: 6 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--blue)", fontWeight: 600 }}>
              Register now
            </Link>
          </p>
        </div>

        <div className="auth-back">
          <Link to="/">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
