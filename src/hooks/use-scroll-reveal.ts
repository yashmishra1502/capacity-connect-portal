import { useEffect } from "react";

/**
 * Lightweight scroll-reveal: one IntersectionObserver adds `.cc-revealed`
 * to every `[data-reveal]` element once it enters the viewport.
 *
 * Also watches the DOM for elements added later (async data, tab switches)
 * and has a safety timer so nothing can ever stay permanently invisible.
 */
export function useScrollReveal() {
  useEffect(() => {
    const revealAll = () =>
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((n) => n.classList.add("cc-revealed"));

    if (typeof IntersectionObserver === "undefined") {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = Number(el.dataset["revealDelay"] ?? 0);
          window.setTimeout(() => el.classList.add("cc-revealed"), delay);
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const observeAll = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((n) => {
        if (n.classList.contains("cc-revealed")) return;
        observer.observe(n);
      });
    };

    observeAll();

    // pick up nodes rendered after mount (async fetches, conditional UI)
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    // failsafe: never leave content hidden
    const fallback = window.setTimeout(revealAll, 2500);

    return () => {
      observer.disconnect();
      mo.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);
}
