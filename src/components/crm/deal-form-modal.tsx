"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createDeal } from "@/server/actions/deals";

interface DealFormModalProps {
  contacts: Array<{ id: string; fullName: string; company?: string | null }>;
  users: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
}

export function DealFormModal({ contacts, users, onSuccess }: DealFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    value: 1000,
    currency: "USD",
    stage: "LEAD" as any,
    contactId: contacts[0]?.id || "",
    ownerId: users[0]?.id || "",
    expectedCloseDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await createDeal(formData);
    setLoading(false);

    if (res.success) {
      setIsOpen(false);
      setFormData({
        title: "",
        value: 1000,
        currency: "USD",
        stage: "LEAD",
        contactId: contacts[0]?.id || "",
        ownerId: users[0]?.id || "",
        expectedCloseDate: "",
      });
      if (onSuccess) onSuccess();
    } else {
      setError(res.error || "Xatolik yuz berdi");
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="w-4 h-4" />
        Yangi bitim yaratish
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Yangi bitim (Deal) kiritish
                </h3>
                <p className="text-xs text-zinc-500">
                  Sotuv loyihasi yoki shartnoma ma'lumotlarini kiriting
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 text-xs rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Bitim nomi *
                </label>
                <Input
                  required
                  placeholder="Masalan: ERP tizimini joriy etish"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Bitim qiymati *
                  </label>
                  <Input
                    type="number"
                    required
                    min={0}
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Valyuta
                  </label>
                  <select
                    className="w-full h-9 rounded-md border border-border bg-popover px-3 text-xs text-popover-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                  >
                    <option value="USD" className="bg-popover text-popover-foreground">USD ($)</option>
                    <option value="UZS" className="bg-popover text-popover-foreground">UZS (so'm)</option>
                    <option value="EUR" className="bg-popover text-popover-foreground">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Mijoz *
                </label>
                <select
                  required
                  className="w-full h-9 rounded-md border border-border bg-popover px-3 text-xs text-popover-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  value={formData.contactId}
                  onChange={(e) =>
                    setFormData({ ...formData, contactId: e.target.value })
                  }
                >
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id} className="bg-popover text-popover-foreground">
                      {c.fullName} {c.company ? `(${c.company})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Boshlang'ich bosqich
                  </label>
                  <select
                    className="w-full h-9 rounded-md border border-border bg-popover px-3 text-xs text-popover-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={formData.stage}
                    onChange={(e) =>
                      setFormData({ ...formData, stage: e.target.value as any })
                    }
                  >
                    <option value="LEAD" className="bg-popover text-popover-foreground">Yangi Lead</option>
                    <option value="CONTACTED" className="bg-popover text-popover-foreground">Bog'lanildi</option>
                    <option value="PROPOSAL" className="bg-popover text-popover-foreground">Taklif yuborildi</option>
                    <option value="NEGOTIATION" className="bg-popover text-popover-foreground">Muzokara</option>
                    <option value="WON" className="bg-popover text-popover-foreground">Yutildi</option>
                    <option value="LOST" className="bg-popover text-popover-foreground">Boy berildi</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Mas'ul menejer
                  </label>
                  <select
                    className="w-full h-9 rounded-md border border-border bg-popover px-3 text-xs text-popover-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={formData.ownerId}
                    onChange={(e) =>
                      setFormData({ ...formData, ownerId: e.target.value })
                    }
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id} className="bg-popover text-popover-foreground">
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Yaratish
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
