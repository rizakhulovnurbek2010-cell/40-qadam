import React from "react";
import { cn } from "@/lib/utils";

export const Badge = ({
  className,
  variant = "default",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline";
}) => {
  const variants = {
    default: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900",
    secondary: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900",
    destructive: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900",
    outline: "border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
