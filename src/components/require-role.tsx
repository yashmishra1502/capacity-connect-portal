import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/lib/mock-data";

export function loginPathFor(role: Role) {
  return role === "admin" ? "/admin-login" : "/login";
}

export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // still checking
    if (!profile || profile.role !== role) {
      navigate({ to: loginPathFor(role), replace: true });
    }
  }, [profile, loading, role, navigate]);

  if (!profile || profile.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <p className="text-sm text-muted-foreground">Checking your session…</p>
      </div>
    );
  }

  return <>{children}</>;
}
