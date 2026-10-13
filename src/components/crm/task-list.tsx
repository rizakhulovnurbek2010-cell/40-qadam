"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckSquare, Square, Clock, Phone, Calendar, FileText, Building } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toggleTaskComplete } from "@/server/actions/activities";
import { ActivityItem } from "@/types/crm";

interface TaskListProps {
  initialTasks: ActivityItem[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<ActivityItem[]>(initialTasks);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("pending");

  const handleToggle = async (taskId: string) => {
    // Optimistic toggle
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );

    const res = await toggleTaskComplete(taskId);
    if (!res.success) {
      setTasks(initialTasks);
    }
  };

  const filtered = tasks.filter((t) => {
    if (filter === "pending") return !t.isCompleted;
    if (filter === "completed") return t.isCompleted;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "CALL":
        return <Phone className="w-4 h-4 text-emerald-500" />;
      case "MEETING":
        return <Calendar className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === "pending"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
          }`}
        >
          Bajarilishi kerak ({tasks.filter((t) => !t.isCompleted).length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === "completed"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
          }`}
        >
          Bajarilganlar ({tasks.filter((t) => t.isCompleted).length})
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === "all"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
          }`}
        >
          Barchasi ({tasks.length})
        </button>
      </div>

      {/* Task list items */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-400 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            Ushbu bo'limda hech qanday vazifa topilmadi.
          </div>
        ) : (
          filtered.map((task) => {
            const isOverdue =
              task.dueDate &&
              new Date(task.dueDate) < new Date() &&
              !task.isCompleted;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border border-border/60 bg-card text-card-foreground flex items-start gap-3.5 transition-colors shadow-none ${
                  task.isCompleted
                    ? "opacity-50 bg-muted/20"
                    : isOverdue
                    ? "border-destructive/40 bg-destructive/5"
                    : "hover:border-border"
                }`}
              >
                <button
                  onClick={() => handleToggle(task.id)}
                  className="mt-0.5 text-zinc-400 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {task.isCompleted ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-zinc-400 hover:text-blue-600" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {getIcon(task.type)}
                    <span
                      className={`text-xs font-medium leading-relaxed ${
                        task.isCompleted
                          ? "line-through text-zinc-400"
                          : "text-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      {task.content}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500 pt-1">
                    {task.contact && (
                      <Link
                        href={`/contacts/${task.contact.id}`}
                        className="hover:text-blue-600 font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1"
                      >
                        <Building className="w-3 h-3 text-zinc-400" />
                        {task.contact.fullName}
                      </Link>
                    )}

                    {task.dueDate && (
                      <span
                        className={`flex items-center gap-1 font-medium ${
                          isOverdue
                            ? "text-rose-600 dark:text-rose-400 font-bold"
                            : "text-zinc-500"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        Muddati: {formatDate(task.dueDate)}
                        {isOverdue && " (Kechikkan!)"}
                      </span>
                    )}

                    {task.user && (
                      <span className="text-zinc-400">
                        Mas'ul: {task.user.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
