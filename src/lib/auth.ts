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
const REGISTERED_USERS_KEY = "capacity-connect-registered-users";

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

// --- Registered users store (demo only, lives in localStorage) -------------
type RegisteredUser = {
  role: Role;
  password: string;
  name: string;
  email: string;
  dept: string;
};

function getRegisteredUsers(): Record<string, RegisteredUser> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveRegisteredUsers(users: Record<string, RegisteredUser>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

export type RegisterInput = {
  role: Role;
  name: string;
  email: string;
  password: string;
  dept: string;
};

export function register(input: RegisterInput): LoginResult {
  const email = input.email.trim().toLowerCase();

  if (!input.name || !email || !input.password || !input.dept) {
    return { ok: false, message: "Please fill in all fields." };
  }
  if (input.password.length < 6) {
    return { ok: false, message: "Password must be at least 6 characters." };
  }

  const registered = getRegisteredUsers();
  const isBuiltInEmail = Object.values(MOCK_CREDENTIALS).some(
    (c) => c.email.toLowerCase() === email
  );

  if (registered[email] || isBuiltInEmail) {
    return { ok: false, message: "An account with this email already exists." };
  }

  registered[email] = {
    role: input.role,
    password: input.password,
    name: input.name,
    email,
    dept: input.dept,
  };
  saveRegisteredUsers(registered);

  const session: Session = {
    role: input.role,
    id: `NEW-${Date.now()}`,
    name: input.name,
    email,
    title:
      input.role === "admin"
        ? "Administrator"
        : input.role === "trainer"
        ? "Trainer"
        : "Trainee",
  };

  return { ok: true, session };
}

// --- Login -------------------------------------------------------------
export function login(role: Role, email: string, password: string): LoginResult {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return { ok: false, message: "Please enter both email and password." };
  }

  // 1. Check built-in demo credentials first
  const record = MOCK_CREDENTIALS[role];
  if (normalizedEmail === record.email.toLowerCase() && password === record.password) {
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

  // 2. Check registered (sign-up) users
  const registered = getRegisteredUsers();
  const user = registered[normalizedEmail];
  if (user && user.role === role && user.password === password) {
    const session: Session = {
      role: user.role,
      id: `REG-${normalizedEmail}`,
      name: user.name,
      email: user.email,
      title:
        user.role === "admin" ? "Administrator" : user.role === "trainer" ? "Trainer" : "Trainee",
    };
    persistSession(session);
    return { ok: true, session };
  }

  return { ok: false, message: "Invalid email or password for this role." };
}

export function logout() {
  persistSession(null);
}

export { AUTH_EVENT };
