import { cn } from "@/lib/utils";

export function BrandIcon({ className, size = 44 }: { className?: string; size?: number }) {
  return (
    <img
      src="/day.png"
      alt="Capacity Connect"
      width={size}
      height={size}
      className={cn("inline-block shrink-0 object-contain", className)}
    />
  );
}

export function BrandLogo({ className }: { className?: string }) {
  return (
    <img
      src="/night.png"
      alt="Capacity Connect — Digital Capacity Building Portal"
      className={cn("inline-block h-auto w-full max-w-[420px] object-contain", className)}
    />
  );
}
