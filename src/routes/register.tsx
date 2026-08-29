import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";
import "../landing.css";
import { BrandIcon } from "@/components/brand-logo";
import { register } from "@/lib/auth";
import type { Role } from "@/lib/mock-data";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [{ title: "Register — Capacity Connect" }],
  }),
  component: Register,
});

const ROLES: Role[] = ["trainee", "trainer", "admin"];

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

        {success ? (
          <div className="auth-card cc-hero-in" style={{ maxWidth: 420 }}>
            <div className="success-panel">
              <div className="check">
                <CheckCircle2 size={28} />
              </div>
              <h1>Registration successful</h1>
              <p className="auth-sub">Redirecting you to the {role} login page…</p>
            </div>
          </div>
        ) : (
          <>
            <div className="auth-brand cc-hero-in">
              <Link to="/" className="brand" style={{ flexDirection: "column", gap: 8 }}>
                <BrandIcon size={40} className="rounded-md" />
                <div>
                  <p className="name">Capacity Connect</p>
                  <p className="sub">Capacity Building Commission</p>
                </div>
              </Link>
            </div>

            <div className="auth-card cc-hero-in cc-delay-1">
              <h1>Create an account</h1>
              <p className="auth-sub">Register as a trainee, trainer or administrator.</p>

              <div className="role-switch" role="tablist">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={role === r ? "active" : ""}
                    onClick={() => {
                      setRole(r);
                      setError(null);
                    }}
                    style={{ textTransform: "capitalize" }}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="name">Full name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="dept">Department</label>
                  <input
                    id="dept"
                    type="text"
                    placeholder="e.g. Rural Development"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="reg-email">Email address</label>
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="username"
                    placeholder="name@gov-capacity.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="reg-password">Password</label>
                  <div className="field-wrap">
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ paddingRight: 42 }}
                    />
                    <button
                      type="button"
                      className="field-eye"
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="confirm-password">Confirm password</label>
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
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
                  style={{ width: "100%", justifyContent: "center", marginTop: 20, textTransform: "capitalize" }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 size={16} className="spin" />
                  ) : (
                    <>
                      Create {role} account <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <p className="auth-foot">
                Already have an account?{" "}
                <Link to="/login" style={{ color: "var(--blue)", fontWeight: 600 }}>
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}

        <div className="auth-back">
          <Link to="/">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
