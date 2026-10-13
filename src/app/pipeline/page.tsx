import { getPipelineDeals } from "@/server/actions/deals";
import { getContacts, getUsersList } from "@/server/actions/contacts";
import { KanbanBoard } from "@/components/crm/kanban-board";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Savdo Voronkasi (Pipeline) | Apex CRM",
  description: "Bitimlar bosqichlari va sotuv jarayoni",
};

export default async function PipelinePage() {
  const [dealsRes, contactsRes, usersRes] = await Promise.all([
    getPipelineDeals(),
    getContacts(),
    getUsersList(),
  ]);

  const deals = dealsRes.success && dealsRes.data ? dealsRes.data : [];
  const contacts = contactsRes.success && contactsRes.data ? contactsRes.data : [];
  const users = usersRes.success && usersRes.data ? usersRes.data : [];

  return (
    <div className="h-full flex flex-col space-y-4">
      <KanbanBoard initialDeals={deals} contacts={contacts} users={users} />
    </div>
  );
}
