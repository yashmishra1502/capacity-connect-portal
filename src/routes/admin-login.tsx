import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";
import "../landing.css";
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
    <div className="ccl" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div
          className="auth-orb"
          style={{
            width: 460,
            height: 460,
            left: "-12%",
            top: "-14%",
            background: "radial-gradient(circle, rgba(11,30,61,0.4), transparent 70%)",
          }}
        />
        <div
          className="auth-orb"
          style={{
            width: 420,
            height: 420,
            right: "-10%",
            bottom: "-14%",
            background: "radial-gradient(circle, rgba(30,111,255,0.32), transparent 70%)",
            animationDelay: "-8s",
          }}
        />
        <div
          className="auth-orb"
          style={{
            width: 300,
            height: 300,
            left: "38%",
            top: "22%",
            background: "radial-gradient(circle, rgba(95,168,255,0.22), transparent 70%)",
            animationDelay: "-14s",
          }}
        />

        <header className="subheader" style={{ position: "relative", zIndex: 5, background: "transparent", backdropFilter: "none", borderBottom: "none" }}>
          <Link to="/" className="brand">
            <BrandIcon size={40} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button className="theme-btn" onClick={toggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <Link to="/" className="link-arrow" style={{ fontSize: 13 }}>
              <ArrowLeft size={13} /> Back to home
            </Link>
          </div>
        </header>

        <main style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
          <div style={{ width: "100%", maxWidth: 440 }}>
            <div
              className="badge cc-hero-in"
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "0 auto 22px",
                width: "fit-content",
                fontSize: 12,
                padding: "7px 16px 7px 10px",
              }}
            >
              <span className="ico">
                <ShieldCheck />
              </span>
              Restricted administrator access
            </div>

            <div className="auth-card cc-hero-in cc-delay-1">
              <h1>Admin sign in</h1>
              <p className="auth-sub">Sign in with your administrator credentials to continue.</p>

              <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
                <div className="field" style={{ marginTop: 0 }}>
                  <label htmlFor="admin-email">Email address</label>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    placeholder="name@gov-capacity.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="admin-password">Password</label>
                  <div className="field-wrap">
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center", marginTop: 20 }} disabled={submitting}>
                  {submitting ? <Loader2 size={16} className="spin" /> : <>Sign in as Admin <ArrowRight size={16} /></>}
                </button>
              </form>

              <p className="auth-foot">
                Not an administrator?{" "}
                <Link to="/login" style={{ color: "var(--blue)", fontWeight: 600 }}>
                  Trainee / Trainer login
                </Link>
              </p>
              <p className="auth-foot" style={{ marginTop: 6 }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "var(--blue)", fontWeight: 600 }}>
                  Register now
                </Link>
              </p>
            </div>
          </div>
        </main>

        <footer style={{ position: "relative", zIndex: 2, borderTop: "1px solid var(--line)", padding: "18px 32px" }}>
          <div
            className="wrap"
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, fontSize: 11.5, color: "var(--muted-label)" }}
          >
            <p>© {new Date().getFullYear()} Capacity Connect — Capacity Building Commission, Government of India</p>
            <div style={{ display: "flex", gap: 18 }}>
              <Link to="/about">About</Link>
              <Link to="/">Home</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
