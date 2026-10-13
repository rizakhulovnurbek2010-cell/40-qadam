"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Briefcase,
  CheckSquare,
  CreditCard,
  FileText,
  TrendingUp,
  ShieldCheck,
  Settings,
  Search,
  Bell,
  User,
  LogOut,
  ChevronsUpDown,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/crm/command-palette";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/server/actions/auth";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeColor?: string;
}

export const navigationItems: NavItem[] = [
  {
    name: "Boshqaruv paneli",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Lidlar va murojaatlar",
    href: "/leads",
    icon: UserPlus,
    badge: "Yangi",
    badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  },
  {
    name: "Mijozlar bazasi",
    href: "/contacts",
    icon: Users,
  },
  {
    name: "Bitimlar va sotuvlar",
    href: "/deals",
    icon: Briefcase,
  },
  {
    name: "Rejalar va eslatmalar",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Moliya va to'lovlar",
    href: "/finance",
    icon: CreditCard,
  },
  {
    name: "Hujjatlar va takliflar",
    href: "/documents",
    icon: FileText,
  },
  {
    name: "Savdo tahlili",
    href: "/reports",
    icon: TrendingUp,
  },
  {
    name: "Jamoa va rollar",
    href: "/team",
    icon: ShieldCheck,
  },
  {
    name: "Tizim sozlamalari",
    href: "/settings",
    icon: Settings,
  },
];

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [commandOpen, setCommandOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
  };

  useEffect(() => {
    setIsMac(typeof window !== "undefined" && /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform));

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar - fixed-width, isolated from normal document flow, GPU accelerated hover */}
      <aside className="w-72 flex-shrink-0 border-r border-border bg-card/90 backdrop-blur-xl flex flex-col h-full z-30 select-none overflow-hidden will-change-transform">
        {/* Brand Header */}
        <div className="h-14 flex items-center px-6 gap-3.5 border-b border-border/50 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <TrendingUp className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-bold tracking-tight text-sm bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent truncate block">
              Apex CRM Pro
            </span>
            <span className="block text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Enterprise Sales Cloud
            </span>
          </div>
        </div>

        {/* Navigation list - vertically distributed to fill entire height without scrolling */}
        <nav className="flex-1 px-3 py-3 flex flex-col justify-between overflow-hidden">
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard" || pathname === "/"
                : item.href === "/deals"
                ? pathname === "/deals" || pathname.startsWith("/pipeline")
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium whitespace-nowrap will-change-transform transition-colors duration-150",
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 transition-colors duration-150",
                      isActive
                        ? "text-white"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span className="text-[13.5px] tracking-tight">{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold flex-shrink-0",
                      isActive
                        ? "bg-white/20 text-white"
                        : item.badgeColor || "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Card with DropdownMenu */}
        <div className="p-3 border-t border-border/50 flex-shrink-0 bg-card/40">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-muted/30 hover:bg-accent hover:text-accent-foreground border border-border/60 transition-colors cursor-pointer text-left select-none group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
                  SR
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-foreground group-hover:text-accent-foreground truncate">
                      Sardor Rahimov
                    </p>
                    {/* Small green status dot */}
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"
                      title="Enterprise DB Faol"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground group-hover:text-accent-foreground/80 truncate">
                    Senior Sales Lead
                  </p>
                </div>
                <ChevronsUpDown className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground flex-shrink-0 transition-colors" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="top" className="mb-2 w-64 p-1.5 shadow-2xl">
              <DropdownMenuLabel className="px-2.5 py-1.5">
                <p className="text-xs font-bold text-foreground">Sardor Rahimov</p>
                <p className="text-[11px] text-muted-foreground font-normal truncate">
                  sardor@apex.uz • Admin
                </p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="cursor-pointer"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Mening profilim</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span>Tizim sozlamalari</span>
                </div>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                  Admin
                </span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer font-medium"
              >
                <LogOut className="w-4 h-4 text-destructive" />
                <span>Tizimdan chiqish</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content Area - Scoped independent scrolling with zero bleed to sidebar */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header - pinned to top of main content area, Linear/Vercel inspired */}
        <header className="h-14 flex-shrink-0 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 flex items-center justify-between z-20">
          {/* Left / Search trigger button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="flex items-center justify-between w-64 sm:w-80 px-3 py-1.5 rounded-lg border border-border/80 bg-background/50 hover:bg-accent/50 text-muted-foreground hover:text-foreground text-xs transition-colors shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="font-normal text-muted-foreground">Tezkor qidiruv...</span>
              </div>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground bg-muted/80 border border-border/80 rounded group-hover:border-border">
                {isMac ? "⌘ K" : "Ctrl K"}
              </kbd>
            </button>
          </div>

          {/* Right actions: clean notification bell without visual noise */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
              aria-label="Xabarnomalar"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2 ring-2 ring-background"></span>
            </Button>
          </div>
        </header>

        {/* Page Body - Only this container scrolls vertically, completely isolated */}
        <main className="flex-1 overflow-y-auto p-8 overscroll-contain">
          {children}
        </main>
      </div>

      {/* Global Command Palette Dialog (Ctrl+K / ⌘K) */}
      <CommandPalette
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
      />
    </div>
  );
}
