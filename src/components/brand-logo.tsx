import iconAsset from "@/assets/capacity-connect-icon.png.asset.json";
import logoAsset from "@/assets/capacity-connect-logo.png.asset.json";
import { cn } from "@/lib/utils";

export function BrandIcon({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <img
      src={iconAsset.url}
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
      src={logoAsset.url}
      alt="Capacity Connect — Digital Capacity Building Portal"
      className={cn("inline-block h-auto w-full max-w-[280px] object-contain", className)}
    />
  );
}
