import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));

    // ThemeToggle just toggles a class on <html>, no custom event is fired,
    // so watch for class attribute changes directly.
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export function BrandIcon({ className, size = 56 }: { className?: string; size?: number }) {
  const isDark = useIsDark();

  return (
    <img
      src={isDark ? "/night.png" : "/day.png"}
      alt="Capacity Connect"
      width={size}
      height={size}
      className={cn("inline-block shrink-0 object-contain", className)}
    />
  );
}

export function BrandLogo({ className }: { className?: string }) {
  const isDark = useIsDark();

  return (
    <img
      src={isDark ? "/night.png" : "/day.png"}
      alt="Capacity Connect — Digital Capacity Building Portal"
      className={cn(
        "inline-block h-auto w-full max-w-[560px] object-contain",
        className
      )}
    />
  );
}
