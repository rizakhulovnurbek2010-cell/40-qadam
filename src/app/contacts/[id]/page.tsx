import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building, Phone, Mail, User, DollarSign, Plus } from "lucide-react";
import { getContactById } from "@/server/actions/contacts";
import { ContactTimeline } from "@/components/crm/contact-timeline";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DEAL_STAGES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  const res = await getContactById(resolvedParams.id);

  if (!res.success || !res.data) {
    notFound();
  }

  const contact = res.data;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/contacts"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Mijozlar ro'yxatiga qaytish
      </Link>

      {/* Header Info */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {contact.fullName}
            </h1>
            <Badge variant="default">{contact.status}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-1">
            {contact.company && (
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-zinc-400" />
                {contact.company}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              {contact.phone}
            </span>
            {contact.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                {contact.email}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[11px] text-zinc-400">Mas'ul menejer</p>
            <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              {contact.assignedTo?.name || "Biriktirilmagan"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left side deals & info, Right side timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Deals and Notes */}
        <div className="lg:col-span-1 space-y-6">
          {/* Notes Box */}
          {contact.notes && (
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Mijoz haqida birlamchi izoh
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {contact.notes}
              </p>
            </div>
          )}

          {/* Deals list */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Bitimlar ({contact.deals.length})
              </h3>
              <Link
                href="/pipeline"
                className="text-[11px] text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Voronkaga o'tish
              </Link>
            </div>

            {contact.deals.length === 0 ? (
              <p className="text-xs text-zinc-400 py-3 text-center">
                Mijozga biriktirilgan bitim yo'q.
              </p>
            ) : (
              <div className="space-y-2.5">
                {contact.deals.map((deal) => {
                  const stageInfo = DEAL_STAGES.find((s) => s.id === deal.stage);
                  return (
                    <div
                      key={deal.id}
                      className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                          {deal.title}
                        </h4>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          {formatCurrency(deal.value, deal.currency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            stageInfo?.color || "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          {stageInfo?.label || deal.stage}
                        </span>
                        <span className="text-zinc-400">
                          {formatDate(deal.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Timeline */}
        <div className="lg:col-span-2">
          <ContactTimeline
            contactId={contact.id}
            activities={contact.activities}
          />
        </div>
      </div>
    </div>
  );
}
