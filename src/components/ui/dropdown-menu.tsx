"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null);

export function DropdownMenu({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: React.SetStateAction<boolean>) => {
      const next = typeof value === "function" ? value(open) : value;
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, open, onOpenChange]
  );

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block w-full">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export const DropdownMenuTrigger = React.forwardRef<
  HTMLDivElement,
  { asChild?: boolean; children: React.ReactNode; className?: string }
>(({ asChild, children, className, ...props }, ref) => {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) throw new Error("DropdownMenuTrigger must be inside DropdownMenu");

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    ctx.setOpen((prev) => !prev);
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as any;
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        childProps.onClick?.(e);
        handleClick(e);
      },
      "aria-expanded": ctx.open,
      className: cn(childProps.className, className),
    });
  }

  return (
    <div
      ref={ref}
      onClick={handleClick}
      aria-expanded={ctx.open}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    className?: string;
    side?: "top" | "bottom";
  }
>(({ children, className, side = "top", ...props }, ref) => {
  const ctx = React.useContext(DropdownMenuContext);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ctx?.open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        ctx.setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        ctx.setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ctx]);

  if (!ctx?.open) return null;

  const positionClasses = side === "top" ? "bottom-full mb-2" : "top-full mt-2";

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute left-0 right-0 z-50 min-w-[14rem] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground p-1 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-100 select-none",
        positionClasses,
        className
      )}
      style={{ backgroundColor: "hsl(var(--popover))", opacity: 1 }}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    disabled?: boolean;
  }
>(({ children, className, onClick, disabled, ...props }, ref) => {
  const ctx = React.useContext(DropdownMenuContext);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    onClick?.(e);
    ctx?.setOpen(false);
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      role="menuitem"
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium outline-none transition-colors",
        "text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("my-1 h-px bg-border/60", className)} />;
}

export function DropdownMenuLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground", className)}>
      {children}
    </div>
  );
}
