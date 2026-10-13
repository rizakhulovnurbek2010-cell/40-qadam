import { getContacts, getUsersList } from "@/server/actions/contacts";
import { ContactsTable } from "@/components/crm/contacts-table";

export const metadata = {
  title: "Lidlar va Murojaatlar | Apex CRM Pro",
  description: "Sayt, bot va telefoniya orqali kelgan birlamchi murojaatlar",
};

export default async function LeadsPage() {
  const [contactsRes, usersRes] = await Promise.all([
    getContacts({ status: "LEAD" }),
    getUsersList(),
  ]);

  const leads = contactsRes.success && contactsRes.data ? contactsRes.data : [];
  const users = usersRes.success && usersRes.data ? usersRes.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Lidlar va Murojaatlar
          </h1>
          <p className="text-sm text-zinc-500">
            Birlamchi qabul qilingan barcha potentsial mijozlar (Jami: {leads.length} ta)
          </p>
        </div>
      </div>

      <ContactsTable contacts={leads} users={users} />
    </div>
  );
}
