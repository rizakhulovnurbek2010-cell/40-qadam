import { getTasks } from "@/server/actions/activities";
import { TaskList } from "@/components/crm/task-list";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Vazifalar & Eslatmalar | Apex CRM",
  description: "Kunlik savdo vazifalari va qo'ng'iroqlar taqvimi",
};

export default async function TasksPage() {
  const res = await getTasks();
  const tasks = res.success && res.data ? res.data : [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Kunlik Vazifalar & Eslatmalar
        </h1>
        <p className="text-sm text-zinc-500">
          Mijozlar bilan belgilangan barcha qo'ng'iroqlar, uchrashuvlar va eslatmalar
        </p>
      </div>

      <TaskList initialTasks={tasks} />
    </div>
  );
}
