import { useEffect, useRef } from "react";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Subtle scroll parallax. Any element with `data-parallax="0.15"` gets
 * translated on scroll via a single rAF-throttled listener. No re-renders.
 */
export function useParallax() {
  useEffect(() => {
    if (reduced()) return;
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    );
    if (nodes.length === 0) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      for (const el of nodes) {
        const rect = el.getBoundingClientRect();
        const speed = Number(el.dataset["parallax"] ?? 0.1);
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        el.style.setProperty("--cc-py", `${(-progress * speed * 100).toFixed(2)}px`);
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
}

/** Pointer-driven 3D tilt for a focal element. */
export function useTilt<T extends HTMLElement>(max = 8) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--cc-rx", `${(-py * max).toFixed(2)}deg`);
        el.style.setProperty("--cc-ry", `${(px * max).toFixed(2)}deg`);
        el.style.setProperty("--cc-mx", `${((px + 0.5) * 100).toFixed(1)}%`);
        el.style.setProperty("--cc-my", `${((py + 0.5) * 100).toFixed(1)}%`);
      });
    };
    const onLeave = () => {
      el.style.setProperty("--cc-rx", "0deg");
      el.style.setProperty("--cc-ry", "0deg");
      el.style.setProperty("--cc-mx", "50%");
      el.style.setProperty("--cc-my", "50%");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [max]);
  return ref;
}
