"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
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
  PlusCircle,
  X,
  ArrowRight,
  CornerDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "Sahifalar" | "Tezkor amallar";
  keywords?: string[];
}

const COMMAND_ITEMS: CommandItem[] = [
  // Navigatsiya / Sahifalar
  {
    id: "nav-dashboard",
    title: "Boshqaruv paneli",
    description: "Kompaniya asosiy savdo tahlili va KPI metrikalari",
    href: "/dashboard",
    icon: LayoutDashboard,
    category: "Sahifalar",
    keywords: ["boshqaruv", "dashboard", "asosiy", "kpi", "daromad", "bosh sahifa"],
  },
  {
    id: "nav-leads",
    title: "Lidlar va murojaatlar",
    description: "Yangi kelgan so'rovlar va saralanmagan lidlar oqimi",
    href: "/leads",
    icon: UserPlus,
    category: "Sahifalar",
    keywords: ["lid", "lead", "murojaat", "mijoz", "so'rov", "yangi"],
  },
  {
    id: "nav-contacts",
    title: "Mijozlar bazasi (Kontaktlar)",
    description: "Kompaniyalar va mas'ul shaxslar ro'yxati",
    href: "/contacts",
    icon: Users,
    category: "Sahifalar",
    keywords: ["kontakt", "mijoz", "telefon", "email", "baza", "shaxs"],
  },
  {
    id: "nav-deals",
    title: "Bitimlar va sotuvlar",
    description: "Barcha faol va yopilgan B2B shartnomalar",
    href: "/deals",
    icon: Briefcase,
    category: "Sahifalar",
    keywords: ["bitim", "shartnoma", "deal", "pul", "savdo", "shartnomalar"],
  },
  {
    id: "nav-pipeline",
    title: "Savdo voronkasi (Kanban)",
    description: "Bitimlarning bosqichma-bosqich Kanban oqimi",
    href: "/pipeline",
    icon: TrendingUp,
    category: "Sahifalar",
    keywords: ["pipeline", "kanban", "voronka", "bosqich", "doska"],
  },
  {
    id: "nav-tasks",
    title: "Rejalar va eslatmalar",
    description: "Kunlik qo'ng'iroqlar, uchrashuvlar va vazifalar",
    href: "/tasks",
    icon: CheckSquare,
    category: "Sahifalar",
    keywords: ["vazifa", "reja", "eslatma", "task", "qo'ng'iroq", "uchrashuv"],
  },
  {
    id: "nav-finance",
    title: "Moliya va to'lovlar",
    description: "Hisob-fakturalar va kassa harakatlari",
    href: "/finance",
    icon: CreditCard,
    category: "Sahifalar",
    keywords: ["moliya", "to'lov", "hisob", "pul", "kassa", "faktura"],
  },
  {
    id: "nav-documents",
    title: "Hujjatlar va takliflar",
    description: "B2B shartnoma shablonlari va tijoriy takliflar",
    href: "/documents",
    icon: FileText,
    category: "Sahifalar",
    keywords: ["hujjat", "shartnoma", "fayl", "shablon", "taklif"],
  },
  {
    id: "nav-reports",
    title: "Savdo tahlili va hisobotlar",
    description: "Menejerlar samaradorligi va savdo hisobotlari",
    href: "/reports",
    icon: TrendingUp,
    category: "Sahifalar",
    keywords: ["hisobot", "tahlil", "statistika", "reyting", "menejerlar"],
  },
  {
    id: "nav-team",
    title: "Jamoa va rollar",
    description: "Savdo menejerlari va huquqlar boshqaruvi",
    href: "/team",
    icon: ShieldCheck,
    category: "Sahifalar",
    keywords: ["jamoa", "menejer", "xodim", "rol", "team", "admin"],
  },
  {
    id: "nav-settings",
    title: "Tizim sozlamalari",
    description: "Korporativ konfiguratsiya va profil ma'lumotlari",
    href: "/settings",
    icon: Settings,
    category: "Sahifalar",
    keywords: ["sozlama", "profil", "tizim", "integratsiya", "xavfsizlik"],
  },

  // Tezkor amallar
  {
    id: "action-new-deal",
    title: "Yangi bitim yaratish",
    description: "Savdo voronkasiga yangi B2B bitim kiritish",
    href: "/deals?action=new",
    icon: PlusCircle,
    category: "Tezkor amallar",
    keywords: ["bitim", "qo'shish", "yaratish", "savdo", "yangi bitim"],
  },
  {
    id: "action-new-contact",
    title: "Yangi kontakt qo'shish",
    description: "Yangi mijoz yoki kompaniyani bazaga qo'shish",
    href: "/contacts?action=new",
    icon: PlusCircle,
    category: "Tezkor amallar",
    keywords: ["yaratish", "qo'shish", "kontakt", "mijoz", "yangi kontakt"],
  },
  {
    id: "action-new-lead",
    title: "Yangi lid qabul qilish",
    description: "Kiruvchi murojaatni tizimga qayd etish",
    href: "/leads?action=new",
    icon: PlusCircle,
    category: "Tezkor amallar",
    keywords: ["lid", "lead", "qabul", "qo'shish", "murojaat"],
  },
  {
    id: "action-new-task",
    title: "Yangi vazifa rejalashtirish",
    description: "Qo'ng'iroq yoki uchrashuv eslatmasini belgilash",
    href: "/tasks?action=new",
    icon: PlusCircle,
    category: "Tezkor amallar",
    keywords: ["vazifa", "reja", "eslatma", "uchrashuv", "topshiriq"],
  },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Filter items
  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return COMMAND_ITEMS;
    const q = query.toLowerCase().trim();
    return COMMAND_ITEMS.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchKeywords;
    });
  }, [query]);

  // Reset selected index when query changes or dialog opens
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query, isOpen]);

  // Focus input on open
  React.useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Navigate to item
  const handleSelect = React.useCallback(
    (item: CommandItem) => {
      onClose();
      router.push(item.href);
    },
    [onClose, router]
  );

  // Keyboard controls
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [filteredItems, selectedIndex, handleSelect, onClose]
  );

  // Auto-scroll selected item into view
  React.useEffect(() => {
    if (!listRef.current) return;
    const selectedEl = listRef.current.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`);
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  // Group filtered items by category
  const categorized = {
    Sahifalar: filteredItems.filter((i) => i.category === "Sahifalar"),
    "Tezkor amallar": filteredItems.filter((i) => i.category === "Tezkor amallar"),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] sm:pt-[15vh] px-4 bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-border gap-3 bg-card flex-shrink-0">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tezkor qidiruv yoki buyruq kiriting..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none border-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground bg-muted border border-border/80 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-4 overscroll-contain select-none text-xs"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium text-foreground">Natija topilmadi</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                "{query}" bo'yicha sahifa yoki amal mavjud emas
              </p>
            </div>
          ) : (
            <>
              {categorized.Sahifalar.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Sahifalar
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {categorized.Sahifalar.map((item) => {
                      const itemIndex = filteredItems.findIndex((i) => i.id === item.id);
                      const isSelected = itemIndex === selectedIndex;
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.id}
                          data-index={itemIndex}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                            isSelected
                              ? "bg-accent text-accent-foreground font-medium"
                              : "text-foreground/90 hover:bg-muted/60"
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={cn(
                                "w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 border",
                                isSelected
                                  ? "bg-background border-border text-foreground"
                                  : "bg-muted border-border/50 text-muted-foreground"
                              )}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">
                                {item.title}
                              </p>
                              {item.description && (
                                <p className="text-[11px] text-muted-foreground truncate">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {isSelected && (
                            <CornerDownLeft className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 ml-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {categorized["Tezkor amallar"].length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Tezkor amallar
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {categorized["Tezkor amallar"].map((item) => {
                      const itemIndex = filteredItems.findIndex((i) => i.id === item.id);
                      const isSelected = itemIndex === selectedIndex;
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.id}
                          data-index={itemIndex}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                            isSelected
                              ? "bg-accent text-accent-foreground font-medium"
                              : "text-foreground/90 hover:bg-muted/60"
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={cn(
                                "w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 border",
                                isSelected
                                  ? "bg-background border-border text-foreground"
                                  : "bg-muted border-border/50 text-muted-foreground"
                              )}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">
                                {item.title}
                              </p>
                              {item.description && (
                                <p className="text-[11px] text-muted-foreground truncate">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {isSelected && (
                            <CornerDownLeft className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 ml-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2 border-t border-border bg-muted/40 text-[11px] text-muted-foreground flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">↑</kbd>
              <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">↓</kbd>
              <span>Harakatlanish</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">↵</kbd>
              <span>Tanlash</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">Esc</kbd>
            <span>Yopish</span>
          </span>
        </div>
      </div>
    </div>
  );
}
