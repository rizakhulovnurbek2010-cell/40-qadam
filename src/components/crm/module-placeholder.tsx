import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, LucideIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  expectedFeatures?: string[];
}

export function ModulePlaceholder({
  title,
  description,
  icon: Icon,
  badge = "Tez kunda",
  expectedFeatures = [],
}: ModulePlaceholderProps) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-300">
      {/* Header card */}
      <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-white via-zinc-50 to-blue-50/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-950/20 shadow-sm space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                  {title}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {badge}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1 max-w-xl leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              Bosh sahifaga
            </Button>
          </Link>
        </div>

        {/* Feature roadmap preview */}
        {expectedFeatures.length > 0 && (
          <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Modulda kutilayotgan imkoniyatlar
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {expectedFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-950/40 flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60 flex items-center gap-2.5 text-xs text-blue-700 dark:text-blue-300">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>
            Ushbu modul hozirda rejalashtirish bosqichida. Tez orada Enterprise funksiyalar bilan ishga tushiriladi.
          </span>
        </div>
      </div>
    </div>
  );
}
