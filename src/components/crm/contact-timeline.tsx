"use client";

import { useState } from "react";
import { Phone, Calendar, FileText, CheckCircle2, Clock, Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { createActivity } from "@/server/actions/activities";

interface ContactTimelineProps {
  contactId: string;
  activities: any[];
}

export function ContactTimeline({ contactId, activities: initialActivities }: ContactTimelineProps) {
  const [activities, setActivities] = useState(initialActivities);
  const [type, setType] = useState<"NOTE" | "CALL" | "MEETING">("NOTE");
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const res = await createActivity({
      type,
      content,
      contactId,
      dueDate: dueDate || undefined,
    });
    setLoading(false);

    if (res.success && res.data) {
      setActivities([res.data, ...activities]);
      setContent("");
      setDueDate("");
    }
  };

  const getIcon = (actType: string) => {
    switch (actType) {
      case "CALL":
        return <Phone className="w-4 h-4 text-emerald-500" />;
      case "MEETING":
        return <Calendar className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick activity creation box */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          Yangi muloqot / eslatma yozish
        </h4>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("NOTE")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                type === "NOTE"
                  ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300"
                  : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Eslatma
            </button>
            <button
              type="button"
              onClick={() => setType("CALL")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                type === "CALL"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
                  : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              Qo'ng'iroq
            </button>
            <button
              type="button"
              onClick={() => setType("MEETING")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                type === "MEETING"
                  ? "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300"
                  : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Uchrashuv
            </button>
          </div>

          <textarea
            rows={2}
            required
            placeholder="Nimalar kelishildi? Keyingi qadam nima..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-xs p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500">Muddati (ixtiyoriy):</span>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-xs p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300"
              />
            </div>
            <Button size="sm" type="submit" disabled={loading} className="gap-1.5">
              <Send className="w-3.5 h-3.5" />
              Qo'shish
            </Button>
          </div>
        </form>
      </div>

      {/* Chronological Timeline */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Muloqotlar tarixi (Timeline)
        </h4>

        {activities.length === 0 ? (
          <p className="text-xs text-zinc-400 py-4 text-center">
            Hozircha hech qanday yozuv yo'q.
          </p>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
            {activities.map((item) => (
              <div key={item.id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                </div>

                {/* Card */}
                <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-sm space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200">
                      {getIcon(item.type)}
                      <span>
                        {item.type === "CALL"
                          ? "Qo'ng'iroq qaydi"
                          : item.type === "MEETING"
                          ? "Uchrashuv"
                          : "Eslatma"}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {item.content}
                  </p>

                  {item.dueDate && (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 pt-1">
                      <Clock className="w-3 h-3" />
                      Muddati: {formatDate(item.dueDate)}
                    </div>
                  )}

                  {item.user && (
                    <div className="text-[10px] text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
                      Menejer: {item.user.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
