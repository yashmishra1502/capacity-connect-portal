import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative h-2 w-full grow overflow-hidden rounded-full",
        "border border-white/30 bg-white/20 backdrop-blur-md",
        "dark:border-white/15 dark:bg-white/[0.08]"
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          "absolute h-full rounded-full",
          "bg-[#818cf8]/70 backdrop-blur-md"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-4 w-4 rounded-full",
        "border border-white/50 bg-white/60 shadow-lg shadow-black/10 backdrop-blur-md",
        "dark:border-white/30 dark:bg-white/20 dark:shadow-black/30",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818cf8]/60",
        "disabled:pointer-events-none disabled:opacity-50"
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
