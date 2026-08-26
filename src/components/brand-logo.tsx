import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

function useLogoSrc(dayLogo: string, nightLogo: string) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid a flash/mismatch before the theme is known on the client.
  if (!mounted) return dayLogo;

  return resolvedTheme === "dark" ? nightLogo : dayLogo;
}

export function BrandIcon({ className, size = 56 }: { className?: string; size?: number }) {
  const src = useLogoSrc("/day.png", "/night.png");

  return (
    <img
      src={src}
      alt="Capacity Connect"
      width={size}
      height={size}
      className={cn("inline-block shrink-0 object-contain", className)}
    />
  );
}

export function BrandLogo({ className }: { className?: string }) {
  const src = useLogoSrc("/day.png", "/night.png");

  return (
    <img
      src={src}
      alt="Capacity Connect — Digital Capacity Building Portal"
      className={cn("inline-block h-auto w-full max-w-[560px] object-contain", className)}
    />
  );
}
