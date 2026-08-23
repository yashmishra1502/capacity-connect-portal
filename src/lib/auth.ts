// ---------------------------------------------------------------------------
// CAPACITY CONNECT — auth layer (frontend only / mock).
// Validates against a static credential table and stores the session in
// localStorage. A backend developer can swap `login()` for a real call
// (e.g. Supabase Auth) without touching the components that use `useAuth()`.
// ---------------------------------------------------------------------------

import { currentUsers, type Role } from "./mock-data";

export type Session = {
  role: Role;
  id: string;
  name: string;
  email: string;
  title: string;
};

const AUTH_STORAGE_KEY = "capacity-connect-session";
const AUTH_EVENT = "capacity-connect-auth-change";

// Demo-only credentials, one per role. Replace with real authentication later.
const MOCK_CREDENTIALS: Record<Role, { email: string; password: string }> = {
  trainee: { email: currentUsers.trainee.email, password: "Trainee@123" },
  trainer: { email: currentUsers.trainer.email, password: "Trainer@123" },
  admin: { email: currentUsers.admin.email, password: "Admin@123" },
};

export function demoCredentials(role: Role) {
  return MOCK_CREDENTIALS[role];
}

export function getStoredSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function persistSession(session: Session | null) {
  if (typeof window === "undefined") return;
  if (session) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export type LoginResult = { ok: true; session: Session } | { ok: false; message: string };

export function login(role: Role, email: string, password: string): LoginResult {
  const record = MOCK_CREDENTIALS[role];
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return { ok: false, message: "Please enter both email and password." };
  }

  if (normalizedEmail !== record.email.toLowerCase() || password !== record.password) {
    return { ok: false, message: "Invalid email or password for this role." };
  }

  const profile = currentUsers[role];
  const session: Session = {
    role,
    id: profile.id,
    name: profile.name,
    email: profile.email,
    title: profile.title,
  };
  persistSession(session);
  return { ok: true, session };
}

export function logout() {
  persistSession(null);
}

export { AUTH_EVENT };
