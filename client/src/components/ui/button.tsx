import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold shadow-sm transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-500 text-primary-foreground shadow-pink-glow hover:-translate-y-0.5 hover:shadow-pink-glow-lg",
        secondary:
          "border border-white/70 bg-white/60 text-foreground shadow-glass-sm backdrop-blur-xl hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary",
        ghost: "bg-transparent text-foreground hover:bg-white/55 hover:text-primary",
        outline:
          "border border-white/70 bg-white/35 text-foreground backdrop-blur-xl hover:border-primary/50 hover:text-primary",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export { Button, buttonVariants };
