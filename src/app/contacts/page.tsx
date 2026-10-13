import { getContacts, getUsersList } from "@/server/actions/contacts";
import { ContactsTable } from "@/components/crm/contacts-table";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mijozlar Boshqaruvi | Apex CRM",
  description: "B2B savdo mijozlari ro'yxati va filtrlash",
};

export default async function ContactsPage() {
  const [contactsRes, usersRes] = await Promise.all([
    getContacts(),
    getUsersList(),
  ]);

  const contacts = contactsRes.success && contactsRes.data ? contactsRes.data : [];
  const users = usersRes.success && usersRes.data ? usersRes.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Mijozlar va Leadlar
          </h1>
          <p className="text-sm text-zinc-500">
            Jami {contacts.length} ta ro'yxatga olingan B2B mijoz
          </p>
        </div>
      </div>

      <ContactsTable contacts={contacts} users={users} />
    </div>
  );
}
