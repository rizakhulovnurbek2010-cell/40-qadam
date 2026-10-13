"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building,
  ArrowRight,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DEAL_STAGES } from "@/lib/constants";
import { updateDealStage, deleteDeal } from "@/server/actions/deals";
import { DealFormModal } from "./deal-form-modal";
import { DealItem, UserSummary } from "@/types/crm";

interface KanbanBoardProps {
  initialDeals: DealItem[];
  contacts: Array<{ id: string; fullName: string; company?: string | null }>;
  users: UserSummary[];
}

export function KanbanBoard({ initialDeals, contacts, users }: KanbanBoardProps) {
  const [deals, setDeals] = useState<DealItem[]>(initialDeals);
  const [movingId, setMovingId] = useState<string | null>(null);

  const handleStageMove = async (dealId: string, currentStage: string, direction: "next" | "prev") => {
    const currentIndex = DEAL_STAGES.findIndex((s) => s.id === currentStage);
    const targetIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex < 0 || targetIndex >= DEAL_STAGES.length) return;

    const newStage = DEAL_STAGES[targetIndex].id;

    // Optimistic UI update
    setMovingId(dealId);
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );

    const res = await updateDealStage(dealId, newStage);
    setMovingId(null);

    if (!res.success) {
      setDeals(initialDeals);
      alert(res.error || "Bosqichni yangilashda xatolik");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ushbu bitimni o'chirib tashlamoqchimisiz?")) return;
    const res = await deleteDeal(id);
    if (res.success) {
      setDeals((prev) => prev.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Savdo Voronkasi (Pipeline)
          </h2>
          <p className="text-xs text-zinc-500">
            Bitimlarni bosqichlar orasida o'tkazing va konversiyani kuzating
          </p>
        </div>
        <DealFormModal
          contacts={contacts}
          users={users}
          onSuccess={() => {
            window.location.reload();
          }}
        />
      </div>

      {/* Kanban Board Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
        {DEAL_STAGES.map((stage, colIdx) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id);
          const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={stage.id}
              className="w-80 flex-shrink-0 flex flex-col rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 p-3 max-h-[calc(100vh-210px)]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {stage.label}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {stageDeals.length}
                  </span>
                </div>
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  {formatCurrency(totalValue, "USD")}
                </span>
              </div>

              {/* Cards list */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {stageDeals.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                    Bu bosqichda bitim yo'q
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className={`p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md space-y-3 ${
                        movingId === deal.id ? "opacity-60 scale-98" : ""
                      }`}
                    >
                      <div>
                        <Link
                          href={`/contacts/${deal.contactId}`}
                          className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                        >
                          {deal.title}
                        </Link>
                        <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-1">
                          {formatCurrency(deal.value, deal.currency)}
                        </p>
                      </div>

                      {/* Contact Info */}
                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1 text-[11px] text-zinc-500">
                        <Link
                          href={`/contacts/${deal.contactId}`}
                          className="font-medium text-zinc-700 dark:text-zinc-300 hover:underline block truncate"
                        >
                          {deal.contact?.fullName}
                        </Link>
                        {deal.contact?.company && (
                          <span className="flex items-center gap-1 text-zinc-400 truncate">
                            <Building className="w-3 h-3" />
                            {deal.contact.company}
                          </span>
                        )}
                      </div>

                      {/* Moving Controls & Actions */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1">
                          {colIdx > 0 && (
                            <button
                              onClick={() => handleStageMove(deal.id, deal.stage, "prev")}
                              className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                              title="Oldingi bosqichga qaytarish"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {colIdx < DEAL_STAGES.length - 1 && (
                            <button
                              onClick={() => handleStageMove(deal.id, deal.stage, "next")}
                              className="p-1 rounded bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
                              title="Keyingi bosqichga o'tkazish"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => handleDelete(deal.id)}
                          className="p-1 text-zinc-300 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Bitimni o'chirish"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
