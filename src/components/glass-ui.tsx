import type { ReactNode } from "react";

// Soft indigo/sky accent used consistently across the admin area
export const accent = "#818cf8";
export const accentSoft = "#a5b4fc";

/**
 * Frosted glass panel — the base building block for every admin surface.
 * Use in place of <Card> wherever a glass look is wanted.
 */
export function Glass({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={
        "rounded-2xl border border-white/30 bg-white/40 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 " +
        className
      }
    >
      {children}
    </div>
  );
}

/** Ambient gradient background — wrap a whole admin page in this. */
export function GlassBackground({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-full space-y-6 rounded-3xl p-6"
      style={{
        background:
          "radial-gradient(circle at 15% 10%, rgba(129,140,248,0.22), transparent 45%), radial-gradient(circle at 85% 25%, rgba(56,189,248,0.16), transparent 40%), radial-gradient(circle at 50% 95%, rgba(217,119,255,0.13), transparent 45%)",
      }}
    >
      {children}
    </div>
  );
}

/** Small frosted pill, e.g. for search bars or filters. */
export function GlassInputWrap({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={
        "rounded-xl border border-white/30 bg-white/30 backdrop-blur-md dark:border-white/10 dark:bg-white/5 " +
        className
      }
    >
      {children}
    </div>
  );
}
