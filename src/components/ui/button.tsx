import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:transform hover:scale-105 hover:shadow-lg",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline hover:transform-none hover:shadow-none",
        // New variants using the specified colors
        pink: "bg-[#FF99C0] text-white shadow-xs hover:bg-[#FF80B0] focus-visible:ring-[#FF99C0]/50",
        blue: "bg-[#0053A3] text-white shadow-xs hover:bg-[#004890] focus-visible:ring-[#0053A3]/50",
        pinkOutline:
          "border border-[#FF99C0] bg-transparent text-[#FF99C0] shadow-xs hover:bg-[#FF99C0]/10 focus-visible:ring-[#FF99C0]/30",
        blueOutline:
          "border border-[#0053A3] bg-transparent text-[#0053A3] shadow-xs hover:bg-[#0053A3]/10 focus-visible:ring-[#0053A3]/30",
      },
      size: {
        default: "h-10 px-6 py-3 text-base",
        sm: "h-9 gap-1.5 px-4 py-2",
        lg: "h-12 px-8 py-4 text-base",
        icon: "size-11",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
      },
      animation: {
        none: "hover:transform-none hover:scale-100 hover:shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  shape,
  animation,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className, shape, animation })
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
