"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Building,
  Phone,
  Mail,
  Trash2,
  ExternalLink,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContactFormModal } from "./contact-form-modal";
import { deleteContact } from "@/server/actions/contacts";
import { ContactItem, UserSummary } from "@/types/crm";
import { CustomSelect } from "@/components/ui/custom-select";

interface ContactsTableProps {
  contacts: ContactItem[];
  users: UserSummary[];
}

export function ContactsTable({ contacts: initialContacts, users }: ContactsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [managerFilter, setManagerFilter] = useState("ALL");
  const [contacts, setContacts] = useState<ContactItem[]>(initialContacts);

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase())) ||
      c.phone.includes(search);

    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchesManager =
      managerFilter === "ALL" || c.assignedToId === managerFilter;

    return matchesSearch && matchesStatus && matchesManager;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Haqiqatan ham "${name}" kontaktini o'chirmoqchimisiz?`)) return;
    const res = await deleteContact(id);
    if (res.success) {
      setContacts((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="success">Faol mijoz</Badge>;
      case "LEAD":
        return <Badge variant="default">Yangi Lead</Badge>;
      case "INACTIVE":
        return <Badge variant="warning">Nofaol</Badge>;
      case "CLOSED":
        return <Badge variant="destructive">Yopilgan</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ism, kompaniya yoki telefon..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <CustomSelect
            options={[
              { value: "ALL", label: "Barcha statuslar" },
              { value: "LEAD", label: "Lead" },
              { value: "ACTIVE", label: "Faol" },
              { value: "INACTIVE", label: "Nofaol" },
              { value: "CLOSED", label: "Yopilgan" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />

          <CustomSelect
            options={[
              { value: "ALL", label: "Barcha menejerlar" },
              ...users.map((u) => ({ value: u.id, label: u.name })),
            ]}
            value={managerFilter}
            onChange={setManagerFilter}
          />
        </div>

        <ContactFormModal users={users} />
      </div>

      {/* Table Container - Pure Dark Monochromatic Theme (Zero White/Light backgrounds) */}
      <div className="overflow-x-auto rounded-xl border border-border/60 bg-card text-card-foreground shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Mijoz / F.I.O</th>
              <th className="py-3 px-4">Kompaniya</th>
              <th className="py-3 px-4">Telefon & Email</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Mas'ul Menejer</th>
              <th className="py-3 px-4">Bitimlar</th>
              <th className="py-3 px-4 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  Mos keluvchi mijoz topilmadi.
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-muted/50 transition-colors bg-transparent"
                >
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    <Link
                      href={`/contacts/${contact.id}`}
                      className="hover:text-primary flex items-center gap-1.5 group"
                    >
                      <span>{contact.fullName}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {contact.company ? (
                      <span className="flex items-center gap-1.5 text-foreground/80">
                        <Building className="w-3.5 h-3.5 text-muted-foreground" />
                        {contact.company}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/60">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-foreground/90 font-mono">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      {contact.phone}
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {contact.email}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(contact.status)}</td>
                  <td className="py-3.5 px-4 text-foreground/90">
                    {contact.assignedTo ? (
                      <span className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                        {contact.assignedTo.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Biriktirilmagan</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-foreground/90">
                      {contact._count?.deals || contact.deals?.length || 0} ta
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/contacts/${contact.id}`}
                        className="px-2.5 py-1 rounded-md bg-secondary hover:bg-accent text-secondary-foreground transition-colors text-[11px] font-medium border border-border/50"
                      >
                        Profil
                      </Link>
                      <button
                        onClick={() => handleDelete(contact.id, contact.fullName)}
                        className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                        title="O'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
