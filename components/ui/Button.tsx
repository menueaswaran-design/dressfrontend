"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, fullWidth, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium tracking-widest uppercase transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-black text-white hover:bg-black/80 focus:ring-black": variant === "primary",
            "bg-white text-black border border-black hover:bg-black hover:text-white": variant === "secondary",
            "border border-black text-black hover:bg-black hover:text-white": variant === "outline",
            "text-black hover:bg-gray-100": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700": variant === "danger",
          },
          {
            "px-4 py-2 text-xs": size === "sm",
            "px-6 py-3 text-sm": size === "md",
            "px-8 py-4 text-sm": size === "lg",
            "px-10 py-5 text-base": size === "xl",
          },
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
