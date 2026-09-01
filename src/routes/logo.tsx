import * as React from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import {
  Upload,
  Trash2,
  Pencil,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Loader2,
  ImageOff,
} from "lucide-react";
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
import {
  fetchFeatureCards,
  addFeatureCard,
  updateFeatureCardText,
  replaceFeatureCardImage,
  clearFeatureCardImage,
  deleteFeatureCard,
  reorderFeatureCards,
  type FeatureCard,
} from "@/lib/features";

export const Route = createFileRoute("/logo")({
  head: () => ({
    meta: [{ title: "Manage Homepage Content — Capacity Connect" }],
  }),
  component: LogoDashboard,
});

function LogoDashboard() {
  const { session, profile, loading: authLoading } = useAuth();
  const [tab, setTab] = React.useState<"logos" | "features">("logos");

  if (!authLoading && (!session || profile?.role !== "admin")) {
    return <Navigate to="/admin-login" />;
  }
  if (authLoading) return null;

  return (
    <div className="ccl">
      <div className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>
          Homepage content
        </h1>
        <p style={{ marginTop: 8, color: "var(--ink-soft)", fontSize: 14 }}>
          Manage the department logo carousel and the feature cards shown on the homepage.
          Changes appear there immediately.
        </p>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 28,
            borderBottom: "1px solid var(--line)",
          }}
        >
          <TabButton active={tab === "logos"} onClick={() => setTab("logos")}>
            Department logos
          </TabButton>
          <TabButton active={tab === "features"} onClick={() => setTab("features")}>
            Feature cards
          </TabButton>
        </div>

        <div style={{ marginTop: 28 }}>
          {tab === "logos" ? <LogosPanel /> : <FeatureCardsPanel />}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "10px 4px",
        marginBottom: -1,
        background: "none",
        border: "none",
        borderBottom: active ? "2px solid var(--blue)" : "2px solid transparent",
        color: active ? "var(--ink)" : "var(--ink-soft)",
        fontWeight: active ? 700 : 500,
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

/* ============================================================
   Department logos panel
   ============================================================ */
function LogosPanel() {
  const [logos, setLogos] = React.useState<DepartmentLogo[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [newName, setNewName] = React.useState("");
  const [newFile, setNewFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");
  const replaceInputRef = React.useRef<Record<string, HTMLInputElement | null>>({});

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLogos(await fetchLogos());
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
    [next[index], next[target]] = [next[target]!, next[index]!];
    setLogos(next);
    try {
      await reorderLogos(next.map((l, i) => ({ id: l.id, display_order: i })));
    } catch (e: any) {
      setError(e.message || "Reorder failed.");
      await load();
    }
  }

  return (
    <div>
      {error && (
        <div className="alert-error" style={{ marginBottom: 20 }}>
          {error}
        </div>
      )}

      <form
        onSubmit={handleAdd}
        className="contact-form-card"
        style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}
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

      <div style={{ marginTop: 28 }}>
        {loading ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>Loading logos…</p>
        ) : logos.length === 0 ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
            No logos yet — add your first one above.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {logos.map((logo, i) => (
              <div key={logo.id} className="contact-point" style={{ alignItems: "center", padding: 14 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    border: "1px solid var(--line)",
                    background: "#ffffff",
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
                    style={{ width: 34, height: 34, objectFit: "contain" }}
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
                  <button className="theme-btn" style={{ width: 34, height: 34 }} onClick={() => handleMove(i, -1)} disabled={i === 0} type="button" aria-label="Move up">
                    <ArrowUp size={14} />
                  </button>
                  <button className="theme-btn" style={{ width: 34, height: 34 }} onClick={() => handleMove(i, 1)} disabled={i === logos.length - 1} type="button" aria-label="Move down">
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
                    ref={(el) => { replaceInputRef.current[logo.id] = el; }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleReplaceImage(logo, f);
                      e.target.value = "";
                    }}
                  />
                  <button className="theme-btn" style={{ width: 34, height: 34 }} onClick={() => replaceInputRef.current[logo.id]?.click()} type="button" aria-label="Replace image" title="Replace image">
                    <Upload size={14} />
                  </button>
                  <button className="theme-btn" style={{ width: 34, height: 34, color: "#d64545" }} onClick={() => handleDelete(logo)} type="button" aria-label="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Feature cards panel ("Course management", "Trainer matching" etc.)
   ============================================================ */
function FeatureCardsPanel() {
  const [cards, setCards] = React.useState<FeatureCard[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [newTag, setNewTag] = React.useState("");
  const [newTitle, setNewTitle] = React.useState("");
  const [newDesc, setNewDesc] = React.useState("");
  const [newFile, setNewFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTag, setEditTag] = React.useState("");
  const [editTitle, setEditTitle] = React.useState("");
  const [editDesc, setEditDesc] = React.useState("");
  const replaceInputRef = React.useRef<Record<string, HTMLInputElement | null>>({});

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCards(await fetchFeatureCards());
    } catch (e: any) {
      setError(e.message || "Failed to load feature cards.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await addFeatureCard({
        tag: newTag.trim(),
        title: newTitle.trim(),
        description: newDesc.trim(),
        file: newFile,
      });
      setNewTag("");
      setNewTitle("");
      setNewDesc("");
      setNewFile(null);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to add card.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveText(id: string) {
    if (!editTitle.trim()) return;
    try {
      await updateFeatureCardText(id, {
        tag: editTag.trim(),
        title: editTitle.trim(),
        description: editDesc.trim(),
      });
      setEditingId(null);
      await load();
    } catch (e: any) {
      setError(e.message || "Update failed.");
    }
  }

  async function handleReplaceImage(card: FeatureCard, file: File) {
    try {
      await replaceFeatureCardImage(card, file);
      await load();
    } catch (e: any) {
      setError(e.message || "Image replace failed.");
    }
  }

  async function handleClearImage(card: FeatureCard) {
    try {
      await clearFeatureCardImage(card);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to remove image.");
    }
  }

  async function handleDelete(card: FeatureCard) {
    if (!confirm(`Delete the "${card.title}" card?`)) return;
    try {
      await deleteFeatureCard(card);
      await load();
    } catch (e: any) {
      setError(e.message || "Delete failed.");
    }
  }

  async function handleMove(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= cards.length) return;
    const next = [...cards];
    [next[index], next[target]] = [next[target]!, next[index]!];
    setCards(next);
    try {
      await reorderFeatureCards(next.map((c, i) => ({ id: c.id, display_order: i })));
    } catch (e: any) {
      setError(e.message || "Reorder failed.");
      await load();
    }
  }

  return (
    <div>
      {error && (
        <div className="alert-error" style={{ marginBottom: 20 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleAdd} className="contact-form-card" style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <div className="field" style={{ flex: "1 1 160px" }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6, display: "block" }}>
              Tag (small badge)
            </label>
            <input type="text" placeholder="e.g. Courses" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
          </div>
          <div className="field" style={{ flex: "2 1 260px" }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6, display: "block" }}>
              Title
            </label>
            <input type="text" placeholder="e.g. Course management" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
          </div>
        </div>

        <div className="field">
          <label style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6, display: "block" }}>
            Description
          </label>
          <textarea
            placeholder="One or two sentences describing this capability."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={2}
            style={{
              width: "100%",
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: 13.5,
              background: "var(--bg)",
              color: "var(--ink)",
              fontFamily: "var(--sans)",
              resize: "vertical",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 220px" }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6, display: "block" }}>
              Image (optional — falls back to an icon if left blank)
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? <Loader2 size={15} className="spin" /> : <Upload size={15} />}
            {submitting ? "Adding..." : "Add card"}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 28 }}>
        {loading ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>Loading feature cards…</p>
        ) : cards.length === 0 ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
            No feature cards yet — add your first one above.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {cards.map((card, i) => (
              <div key={card.id} className="contact-point" style={{ alignItems: "flex-start", padding: 14 }}>
                <div
                  style={{
                    width: 76,
                    height: 52,
                    borderRadius: 10,
                    border: "1px solid var(--line)",
                    background: card.image_url ? "var(--bg)" : "linear-gradient(150deg, #0b1e3d, #123368)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  {card.image_url ? (
                    <img src={card.image_url} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <ImageOff size={18} style={{ color: "rgba(255,255,255,0.5)" }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingId === card.id ? (
                    <div style={{ display: "grid", gap: 8 }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          type="text"
                          value={editTag}
                          onChange={(e) => setEditTag(e.target.value)}
                          placeholder="Tag"
                          style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "6px 10px", fontSize: 13.5, background: "var(--bg)", color: "var(--ink)", width: 120 }}
                        />
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title"
                          autoFocus
                          style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "6px 10px", fontSize: 13.5, background: "var(--bg)", color: "var(--ink)", flex: 1 }}
                        />
                      </div>
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        rows={2}
                        style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "6px 10px", fontSize: 13.5, background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--sans)", resize: "vertical" }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="theme-btn" style={{ width: 32, height: 32 }} onClick={() => handleSaveText(card.id)} type="button" aria-label="Save">
                          <Check size={14} />
                        </button>
                        <button className="theme-btn" style={{ width: 32, height: 32 }} onClick={() => setEditingId(null)} type="button" aria-label="Cancel">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {card.tag && (
                        <span
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: 10,
                            color: "var(--ink-soft)",
                            background: "var(--bg)",
                            border: "1px solid var(--line)",
                            padding: "2px 8px",
                            borderRadius: 999,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {card.tag}
                        </span>
                      )}
                      <h3 style={{ fontSize: 14.5, fontWeight: 700, marginTop: 6 }}>{card.title}</h3>
                      <p className="cp-sub" style={{ marginTop: 3 }}>{card.description}</p>
                    </>
                  )}
                </div>

                <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: 120 }}>
                  <button className="theme-btn" style={{ width: 34, height: 34 }} onClick={() => handleMove(i, -1)} disabled={i === 0} type="button" aria-label="Move up">
                    <ArrowUp size={14} />
                  </button>
                  <button className="theme-btn" style={{ width: 34, height: 34 }} onClick={() => handleMove(i, 1)} disabled={i === cards.length - 1} type="button" aria-label="Move down">
                    <ArrowDown size={14} />
                  </button>
                  <button
                    className="theme-btn"
                    style={{ width: 34, height: 34 }}
                    onClick={() => {
                      setEditingId(card.id);
                      setEditTag(card.tag);
                      setEditTitle(card.title);
                      setEditDesc(card.description);
                    }}
                    type="button"
                    aria-label="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    style={{ display: "none" }}
                    ref={(el) => { replaceInputRef.current[card.id] = el; }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleReplaceImage(card, f);
                      e.target.value = "";
                    }}
                  />
                  <button className="theme-btn" style={{ width: 34, height: 34 }} onClick={() => replaceInputRef.current[card.id]?.click()} type="button" aria-label="Upload/replace image" title="Upload/replace image">
                    <Upload size={14} />
                  </button>
                  {card.image_url && (
                    <button className="theme-btn" style={{ width: 34, height: 34 }} onClick={() => handleClearImage(card)} type="button" aria-label="Remove image" title="Remove image (revert to icon)">
                      <ImageOff size={14} />
                    </button>
                  )}
                  <button className="theme-btn" style={{ width: 34, height: 34, color: "#d64545" }} onClick={() => handleDelete(card)} type="button" aria-label="Delete card">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
