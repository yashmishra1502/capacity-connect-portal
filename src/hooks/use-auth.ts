import { useEffect, useState } from "react";
import { AUTH_EVENT, getStoredSession, type Session } from "@/lib/auth";

/**
 * Returns the current session:
 *  - `undefined` while we haven't checked localStorage yet (first client render)
 *  - `null` when nobody is logged in
 *  - `Session` when a user is logged in
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const sync = () => setSession(getStoredSession());
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return session;
}
