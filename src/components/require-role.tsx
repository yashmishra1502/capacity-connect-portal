import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/lib/mock-data";

export function loginPathFor(role: Role) {
  return role === "admin" ? "/admin-login" : "/login";
}

export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const session = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session === undefined) return; // still checking
    if (!session || session.role !== role) {
      navigate({ to: loginPathFor(role), replace: true });
    }
  }, [session, role, navigate]);

  if (!session || session.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <p className="text-sm text-muted-foreground">Checking your session…</p>
      </div>
    );
  }

  return <>{children}</>;
}
