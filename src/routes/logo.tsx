import * as React from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Upload, Trash2, Pencil, Check, X, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import "../landing.css";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchLogos,
  addLogo,
  updateLogoName,
  replaceLogoImage,
  deleteLogo,
  reorderLogos,
  type DepartmentLogo,
} from "@/lib/logos";

export const Route = createFileRoute("/logo")({
  head: () => ({
    meta: [{ title: "Manage Department Logos — Capacity Connect" }],
  }),
  component: LogoDashboard,
});

function LogoDashboard() {
  const { session, profile, loading: authLoading } = useAuth();

  // gate: must be a logged-in admin
  if (!authLoading && (!session || profile?.role !== "admin")) {
    return <Navigate to="/admin-login" />;
  }

  const [logos, setLogos] = React.useState<DepartmentLogo[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // add-new form state
  const [newName, setNewName] = React.useState("");
  const [newFile, setNewFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  // inline edit state
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");
  const replaceInputRef = React.useRef<Record<string, HTMLInputElement | null>>({});

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLogos();
      setLogos(data);
    } catch (e: any) {
      setError(e.message || "Failed to load logos.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newFile || !newName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await addLogo(newFile, newName.trim());
      setNewName("");
      setNewFile(null);
      await load();
    } catch (e: any) {
      setError(e.message || "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveName(id: string) {
    if (!editName.trim()) return;
    try {
      await updateLogoName(id, editName.trim());
      setEditingId(null);
      await load();
    } catch (e: any) {
      setError(e.message || "Rename failed.");
    }
  }

  async function handleReplaceImage(logo: DepartmentLogo, file: File) {
    try {
      await replaceLogoImage(logo, file);
      await load();
    } catch (e: any) {
      setError(e.message || "Image replace failed.");
    }
  }

  async function handleDelete(logo: DepartmentLogo) {
    if (!confirm(`Remove "${logo.name}" from the carousel?`)) return;
    try {
      await deleteLogo(logo);
      await load();
    } catch (e: any) {
      setError(e.message || "Delete failed.");
    }
  }

  async function handleMove(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= logos.length) return;
    const next = [...logos];
    [next[index], next[target]] = [next[target], next[index]];
    setLogos(next);
    try {
      await reorderLogos(next.map((l, i) => ({ id: l.id, display_order: i })));
    } catch (e: any) {
      setError(e.message || "Reorder failed.");
      await load();
    }
  }

  if (authLoading) return null;

  return (
    <div className="ccl">
      <div className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>
          Department logos
        </h1>
        <p style={{ marginTop: 8, color: "var(--ink-soft)", fontSize: 14 }}>
          These logos and names power the "Trusted by government departments" carousel on the
          homepage. Changes appear there immediately.
        </p>

        {error && (
          <div className="alert-error" style={{ marginTop: 20 }}>
            {error}
          </div>
        )}

        {/* ---------- add new ---------- */}
        <form
          onSubmit={handleAdd}
          className="contact-form-card"
          style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}
        >
          <div className="field" style={{ flex: "1 1 220px" }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6, display: "block" }}>
              Department name
            </label>
            <input
              type="text"
              placeholder="e.g. Ministry of Home Affairs"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>

          <div style={{ flex: "1 1 220px" }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6, display: "block" }}>
              Logo image
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? <Loader2 size={15} className="spin" /> : <Upload size={15} />}
            {submitting ? "Uploading..." : "Add logo"}
          </button>
        </form>

        {/* ---------- list ---------- */}
        <div style={{ marginTop: 36 }}>
          {loading ? (
            <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>Loading logos…</p>
          ) : logos.length === 0 ? (
            <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
              No logos yet — add your first one above.
            </p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {logos.map((logo, i) => (
                <div
                  key={logo.id}
                  className="contact-point"
                  style={{ alignItems: "center", padding: 14 }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      border: "1px solid var(--line)",
                      background: "var(--bg-card)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={logo.logo_url}
                      alt={logo.name}
                      style={{ width: 30, height: 30, objectFit: "contain" }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {editingId === logo.id ? (
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                          style={{
                            border: "1px solid var(--line)",
                            borderRadius: 8,
                            padding: "6px 10px",
                            fontSize: 13.5,
                            background: "var(--bg)",
                            color: "var(--ink)",
                            width: "100%",
                            maxWidth: 260,
                          }}
                        />
                        <button
                          className="theme-btn"
                          style={{ width: 32, height: 32 }}
                          onClick={() => handleSaveName(logo.id)}
                          type="button"
                          aria-label="Save name"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          className="theme-btn"
                          style={{ width: 32, height: 32 }}
                          onClick={() => setEditingId(null)}
                          type="button"
                          aria-label="Cancel edit"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <h3 style={{ fontSize: 14.5, fontWeight: 700 }}>{logo.name}</h3>
                    )}
                    <p className="cp-sub" style={{ marginTop: 3 }}>
                      Position {i + 1} of {logos.length}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button
                      className="theme-btn"
                      style={{ width: 34, height: 34 }}
                      onClick={() => handleMove(i, -1)}
                      disabled={i === 0}
                      type="button"
                      aria-label="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      className="theme-btn"
                      style={{ width: 34, height: 34 }}
                      onClick={() => handleMove(i, 1)}
                      disabled={i === logos.length - 1}
                      type="button"
                      aria-label="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>

                    <button
                      className="theme-btn"
                      style={{ width: 34, height: 34 }}
                      onClick={() => {
                        setEditingId(logo.id);
                        setEditName(logo.name);
                      }}
                      type="button"
                      aria-label="Edit name"
                    >
                      <Pencil size={14} />
                    </button>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      style={{ display: "none" }}
                      ref={(el) => (replaceInputRef.current[logo.id] = el)}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleReplaceImage(logo, f);
                        e.target.value = "";
                      }}
                    />
                    <button
                      className="theme-btn"
                      style={{ width: 34, height: 34 }}
                      onClick={() => replaceInputRef.current[logo.id]?.click()}
                      type="button"
                      aria-label="Replace image"
                      title="Replace image"
                    >
                      <Upload size={14} />
                    </button>

                    <button
                      className="theme-btn"
                      style={{ width: 34, height: 34, color: "#d64545" }}
                      onClick={() => handleDelete(logo)}
                      type="button"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
