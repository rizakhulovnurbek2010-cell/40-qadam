"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createContact } from "@/server/actions/contacts";

interface ContactFormModalProps {
  users: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
}

export function ContactFormModal({ users, onSuccess }: ContactFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialFormState = {
    fullName: "",
    phone: "+998 ",
    email: "",
    company: "",
    status: "LEAD",
    assignedToId: users[0]?.id || "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Raqamlarni butunlay qabul qilmaslik
    const noDigits = e.target.value.replace(/[0-9]/g, "");
    // Har doim birinchi harf katta bo'lishi (har bir so'z bosh harfi katta)
    const formatted = noDigits.replace(/(^|\s|['ʻ`’\-])\p{L}/gu, (char) =>
      char.toUpperCase()
    );
    setFormData((prev) => ({ ...prev, fullName: formatted }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Harflarni va noo'rin belgilarni tozalab, faqat raqamlarni ajratib olamiz
    let digits = val.replace(/\D/g, "");

    // 998 prefiksi mavjud bo'lsa uni ajratamiz
    if (digits.startsWith("998")) {
      digits = digits.slice(3);
    }

    // 9 raqamdan ko'p yozilmasin
    digits = digits.slice(0, 9);

    if (digits.length === 0) {
      setFormData((prev) => ({ ...prev, phone: "+998 " }));
      return;
    }

    // Format: +998 XX XXX XX XX
    let formatted = "+998";
    if (digits.length > 0) formatted += ` ${digits.slice(0, 2)}`;
    if (digits.length > 2) formatted += ` ${digits.slice(2, 5)}`;
    if (digits.length > 5) formatted += ` ${digits.slice(5, 7)}`;
    if (digits.length > 7) formatted += ` ${digits.slice(7, 9)}`;

    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const rawDigits = formData.phone.replace(/\D/g, "").replace(/^998/, "");
    if (rawDigits.length !== 9) {
      setError("Telefon raqami to'liq 9 ta raqamdan iborat bo'lishi shart (+998 XX XXX XX XX)");
      return;
    }

    setLoading(true);

    const res = await createContact(formData);
    setLoading(false);

    if (res.success) {
      setIsOpen(false);
      setFormData(initialFormState);
      if (onSuccess) onSuccess();
    } else {
      setError(res.error || "Xatolik yuz berdi");
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="w-4 h-4" />
        Yangi mijoz qo'shish
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Yangi mijoz kiritish
                </h3>
                <p className="text-xs text-zinc-500">
                  Mijozning asosiy aloqa ma'lumotlarini to'ldiring
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 text-xs rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  To'liq Ism (F.I.O) *
                </label>
                <Input
                  required
                  placeholder="Masalan: Jamshid Aliyev"
                  value={formData.fullName}
                  onChange={handleFullNameChange}
                  onKeyDown={(e) => {
                    if (/^[0-9]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Telefon raqam *
                  </label>
                  <Input
                    required
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    onFocus={() => {
                      if (!formData.phone || formData.phone.trim() === "") {
                        setFormData((prev) => ({ ...prev, phone: "+998 " }));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        [
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "ArrowUp",
                          "ArrowDown",
                          "Tab",
                          "Enter",
                        ].includes(e.key) ||
                        e.ctrlKey ||
                        e.metaKey
                      ) {
                        if (
                          e.key === "Backspace" &&
                          (formData.phone === "+998 " || formData.phone === "+998")
                        ) {
                          e.preventDefault();
                        }
                        return;
                      }
                      // Harflarni va boshqa belgilarni taqiqlash (faqat raqamlar)
                      if (!/^[0-9]$/.test(e.key)) {
                        e.preventDefault();
                        return;
                      }
                      // 9 tadan ko'p raqam kiritilmasin
                      const digits = formData.phone
                        .replace(/\D/g, "")
                        .replace(/^998/, "");
                      if (
                        digits.length >= 9 &&
                        window.getSelection()?.toString() === ""
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="jamshid@kompaniya.uz"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Kompaniya nomi
                  </label>
                  <Input
                    placeholder="Masalan: Silk Road Cargo"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Holati (Status)
                  </label>
                  <select
                    className="w-full h-9 rounded-md border border-border bg-popover px-3 text-xs text-popover-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="LEAD" className="bg-popover text-popover-foreground">Yangi Lead</option>
                    <option value="ACTIVE" className="bg-popover text-popover-foreground">Faol mijoz</option>
                    <option value="INACTIVE" className="bg-popover text-popover-foreground">Nofaol</option>
                    <option value="CLOSED" className="bg-popover text-popover-foreground">Yopilgan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Mas'ul menejer
                </label>
                <select
                  className="w-full h-9 rounded-md border border-border bg-popover px-3 text-xs text-popover-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  value={formData.assignedToId}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedToId: e.target.value })
                  }
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id} className="bg-popover text-popover-foreground">
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Dastlabki eslatma / Izoh
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Mijoz nimalarga qiziqmoqda, qanday talablar bor..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
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
                  Saqlash
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
